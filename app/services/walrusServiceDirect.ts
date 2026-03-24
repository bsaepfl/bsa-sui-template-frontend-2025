/**
 * Walrus Direct Service
 *
 * This service uses `new WalrusClient()` directly instead of the
 * `walrus()` extension pattern on SuiJsonRpcClient.
 *
 * Use this when you need full control over the WalrusClient instance,
 * e.g. custom upload relays or package config overrides.
 *
 * Installation:
 * pnpm install @mysten/walrus @mysten/sui
 */

import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import type { Signer } from "@mysten/sui/cryptography";
import {
  WalrusClient,
  WalrusFile,
  type WriteBlobStep,
  type WriteFilesFlow,
} from "@mysten/walrus";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WalrusDirectConfig {
  readonly network?: "testnet" | "mainnet";
  readonly suiClient?: SuiJsonRpcClient;
  readonly epochs?: number;
  readonly deletable?: boolean;
}

interface WriteBlobOptions {
  readonly epochs?: number;
  readonly deletable?: boolean;
  readonly signer: Signer;
  readonly owner?: string;
  readonly attributes?: Record<string, string | null>;
  readonly signal?: AbortSignal;
}

interface WriteFilesOptions {
  readonly epochs?: number;
  readonly deletable?: boolean;
  readonly signer: Signer;
  readonly owner?: string;
  readonly attributes?: Record<string, string | null>;
}

interface WriteFilesFlowFileInput {
  readonly contents: Uint8Array | Blob | string;
  readonly identifier?: string;
  readonly tags?: Record<string, string>;
}

interface WriteBlobResult {
  readonly blobId: string;
  readonly blobObjectId: string;
}

interface WriteFilesResult {
  readonly id: string;
  readonly blobId: string;
  readonly blobObject: unknown;
}

interface StorageCostResult {
  readonly storageCost: bigint;
  readonly writeCost: bigint;
  readonly totalCost: bigint;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_EPOCHS = 5;
const DEFAULT_DELETABLE = true;
const WASM_CDN_URL =
  "https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm";

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Walrus service backed by `WalrusClient` (direct instantiation).
 *
 * Unlike `WalrusService` (which extends `SuiJsonRpcClient` via the
 * `walrus()` plugin), this class creates a standalone `WalrusClient`
 * and exposes the same capabilities through a thin wrapper.
 */
export class WalrusDirectService {
  private readonly client: WalrusClient;
  private readonly defaultEpochs: number;
  private readonly defaultDeletable: boolean;

  constructor(config?: WalrusDirectConfig) {
    const network = config?.network ?? "testnet";

    const suiClient =
      config?.suiClient ??
      new SuiJsonRpcClient({
        url: getJsonRpcFullnodeUrl(network),
        network,
      });

    this.client = new WalrusClient({
      network,
      suiClient,
      wasmUrl: WASM_CDN_URL,
    });

    this.defaultEpochs = config?.epochs ?? DEFAULT_EPOCHS;
    this.defaultDeletable = config?.deletable ?? DEFAULT_DELETABLE;
  }

  // -------------------------------------------------------------------------
  // Write
  // -------------------------------------------------------------------------

  /**
   * Write a raw blob (binary data) to Walrus.
   *
   * Requires a `signer` capable of signing Sui transactions.
   */
  async writeBlob(
    blob: Uint8Array,
    options: WriteBlobOptions,
  ): Promise<WriteBlobResult> {
    const result = await this.client.writeBlob({
      blob,
      deletable: options.deletable ?? this.defaultDeletable,
      epochs: options.epochs ?? this.defaultEpochs,
      signer: options.signer,
      owner: options.owner,
      attributes: options.attributes,
      signal: options.signal,
    });

    return {
      blobId: result.blobId,
      blobObjectId: result.blobObject.id,
    };
  }

  /**
   * Write an array of `WalrusFile` objects to Walrus in a single quilt.
   *
   * Requires a `signer` capable of signing Sui transactions.
   */
  async writeFiles(
    files: readonly WalrusFile[],
    options: WriteFilesOptions,
  ): Promise<readonly WriteFilesResult[]> {
    return await this.client.writeFiles({
      files: [...files],
      deletable: options.deletable ?? this.defaultDeletable,
      epochs: options.epochs ?? this.defaultEpochs,
      signer: options.signer,
      owner: options.owner,
      attributes: options.attributes,
    });
  }

  /**
   * Browser-friendly step-by-step write flow.
   *
   * Returns a `WriteFilesFlow` with `encode()`, `register()`, `upload()`,
   * `certify()`, and `listFiles()` methods so each wallet-signing step
   * can happen in its own user gesture (avoids popup blocking).
   */
  writeFilesFlow(
    files: readonly WriteFilesFlowFileInput[],
    options?: { readonly resume?: WriteBlobStep },
  ): WriteFilesFlow {
    const walrusFiles = files.map((f) => {
      const contents =
        typeof f.contents === "string"
          ? new TextEncoder().encode(f.contents)
          : f.contents;

      return WalrusFile.from({
        contents,
        identifier: f.identifier ?? "file",
        tags: f.tags,
      });
    });

    return this.client.writeFilesFlow({
      files: walrusFiles,
      resume: options?.resume,
    });
  }

  /**
   * Alias for `writeFilesFlow` — matches WalrusService (extension) API.
   */
  uploadWithFlow(
    files: readonly WriteFilesFlowFileInput[],
    _options?: { readonly epochs?: number; readonly deletable?: boolean },
  ): WriteFilesFlow {
    return this.writeFilesFlow(files);
  }

  // -------------------------------------------------------------------------
  // Read
  // -------------------------------------------------------------------------

  /**
   * Read a raw blob by its blob ID.
   *
   * Returns the raw `Uint8Array` content.
   */
  async readBlob(blobId: string): Promise<Uint8Array> {
    return await this.client.readBlob({ blobId });
  }

  /**
   * Retrieve blob metadata (including quilt information).
   */
  async getBlob(blobId: string) {
    return await this.client.getBlob({ blobId });
  }

  /**
   * Retrieve one or more WalrusFiles by their Blob IDs or Quilt IDs.
   *
   * Prefer fetching in batches for efficiency.
   */
  async getFiles(ids: readonly string[]) {
    return await this.client.getFiles({ ids: [...ids] });
  }

  // -------------------------------------------------------------------------
  // Cost
  // -------------------------------------------------------------------------

  /**
   * Estimate storage cost for a given blob size and epoch count.
   */
  async storageCost(
    size: number,
    epochs?: number,
  ): Promise<StorageCostResult> {
    return await this.client.storageCost(size, epochs ?? this.defaultEpochs);
  }

  // -------------------------------------------------------------------------
  // Convenience helpers
  // -------------------------------------------------------------------------

  /**
   * Download a blob and decode it as UTF-8 text.
   */
  async downloadAsText(blobId: string): Promise<string> {
    const bytes = await this.readBlob(blobId);
    return new TextDecoder().decode(bytes);
  }

  /**
   * Download a blob and return raw bytes.
   */
  async downloadAsBytes(blobId: string): Promise<Uint8Array> {
    return await this.readBlob(blobId);
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a `WalrusDirectService` instance.
 *
 * @example
 * ```typescript
 * import { createWalrusDirectService } from '@/services';
 *
 * const service = createWalrusDirectService({ network: 'testnet' });
 *
 * // Write a blob
 * const { blobId } = await service.writeBlob(
 *   new TextEncoder().encode('Hello!'),
 *   { signer: keypair },
 * );
 *
 * // Read it back as text
 * const text = await service.downloadAsText(blobId);
 * ```
 */
export function createWalrusDirectService(
  config?: WalrusDirectConfig,
): WalrusDirectService {
  return new WalrusDirectService(config);
}
