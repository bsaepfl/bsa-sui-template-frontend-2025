/**
 * Walrus Service - Official SDK Version
 *
 * This service uses the official @mysten/walrus TypeScript SDK
 * Documentation: https://sdk.mystenlabs.com/walrus
 *
 * Installation:
 * pnpm install @mysten/walrus @mysten/sui
 */

import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { getFullnodeUrl } from "@mysten/sui/client";
import { walrus, WalrusFile, WalrusClient } from "@mysten/walrus";
import { SuiClient } from "@mysten/sui/client";

export interface WalrusConfig {
  network?: "testnet" | "mainnet";
  epochs?: number;
  deletable?: boolean;
}

/**
 * Walrus Service using Official SDK
 *
 * Follows the official pattern from https://sdk.mystenlabs.com/walrus
 * IMPORTANT: Must use SuiJsonRpcClient (not SuiClient) and include network property
 */
export class WalrusService {
  private client: any; // SuiJsonRpcClient extended with walrus()
  private defaultEpochs: number;
  private defaultDeletable: boolean;

  constructor(config?: WalrusConfig) {
    const network = config?.network || "testnet";

    // Create client with Walrus extension - MUST use SuiJsonRpcClient and include network
    // From official docs: https://sdk.mystenlabs.com/walrus
    // For Next.js, we need to load WASM from CDN to avoid bundling issues
    this.client = new SuiJsonRpcClient({
      url: getFullnodeUrl(network),
      // Setting network on your client is required for walrus to work correctly
      network: network,
    }).$extend(
      walrus({
        wasmUrl:
          "https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm",
      }),
    );

    this.defaultEpochs = config?.epochs || 5;
    this.defaultDeletable =
      config?.deletable !== undefined ? config.deletable : true;
  }

  /**
   * Write a blob directly (low-level API)
   * From official docs: https://sdk.mystenlabs.com/walrus
   */
  async writeBlob(
    blob: Uint8Array,
    options: {
      epochs?: number;
      deletable?: boolean;
      signer: any;
    },
  ): Promise<{ blobId: string; id: string }> {
    const result = await this.client.walrus.writeBlob({
      blob,
      deletable:
        options.deletable !== undefined
          ? options.deletable
          : this.defaultDeletable,
      epochs: options.epochs || this.defaultEpochs,
      signer: options.signer,
    });

    return {
      blobId: result.blobId,
      id: result.id || result.blobId,
    };
  }

  /**
   * Read a blob directly (low-level API)
   * From official docs: https://sdk.mystenlabs.com/walrus
   */
  async readBlob(blobId: string): Promise<Uint8Array> {
    return await this.client.walrus.readBlob({ blobId });
  }

  /**
   * Upload a file using WalrusFile API
   * From official docs: https://sdk.mystenlabs.com/walrus
   *
   * For browser environments, use uploadWithFlow instead to avoid popup blocking
   */
  async upload(
    contents: Uint8Array | Blob | string,
    options: {
      identifier?: string;
      tags?: Record<string, string>;
      epochs?: number;
      deletable?: boolean;
      signer: any;
    },
  ): Promise<{ blobId: string; id: string }> {
    // Convert string to Uint8Array
    const fileContents =
      typeof contents === "string"
        ? new TextEncoder().encode(contents)
        : contents;

    // Create WalrusFile - identifier and tags are optional
    const fileConfig: any = { contents: fileContents };
    if (options.identifier) fileConfig.identifier = options.identifier;
    if (options.tags) fileConfig.tags = options.tags;

    const file = WalrusFile.from(fileConfig);

    // Write using official SDK
    const results = await this.client.walrus.writeFiles({
      files: [file],
      epochs: options.epochs || this.defaultEpochs,
      deletable:
        options.deletable !== undefined
          ? options.deletable
          : this.defaultDeletable,
      signer: options.signer,
    });

    return {
      blobId: results[0].blobId,
      id: results[0].id,
    };
  }

  /**
   * Upload using writeFilesFlow for browser environments
   * This breaks the upload into steps to avoid popup blocking
   * From official docs: https://sdk.mystenlabs.com/walrus
   *
   * Returns a flow object with methods:
   * - encode(): Encodes files (returns Promise<void>)
   * - register(options): Returns transaction to register the blob (needs owner, epochs, deletable)
   * - upload(options): Uploads blob data to storage nodes (needs digest from register)
   * - certify(): Returns transaction to certify the blob after upload
   * - listFiles(): Returns array with blobId and id after completion
   */
  uploadWithFlow(
    files: Array<{
      contents: Uint8Array | Blob | string;
      identifier?: string;
      tags?: Record<string, string>;
    }>,
    options: {
      epochs?: number;
      deletable?: boolean;
    },
  ) {
    // Convert files to WalrusFile format
    const walrusFiles = files.map((file) => {
      const contents =
        typeof file.contents === "string"
          ? new TextEncoder().encode(file.contents)
          : file.contents;

      const fileConfig: any = { contents };
      if (file.identifier) fileConfig.identifier = file.identifier;
      if (file.tags) fileConfig.tags = file.tags;

      return WalrusFile.from(fileConfig);
    });

    // Use writeFilesFlow from Walrus SDK
    return this.client.walrus.writeFilesFlow({
      files: walrusFiles,
    });
  }

  /**
   * Upload multiple files to Walrus (more efficient as a single quilt)
   */
  async uploadFiles(
    files: Array<{
      contents: Uint8Array | Blob | string;
      identifier?: string;
      tags?: Record<string, string>;
    }>,
    options: {
      epochs?: number;
      deletable?: boolean;
      signer: any;
    },
  ): Promise<{ blobId: string; id: string }[]> {
    const walrusFiles = files.map((file) => {
      const contents =
        typeof file.contents === "string"
          ? new TextEncoder().encode(file.contents)
          : file.contents;

      const fileConfig: any = { contents };
      if (file.identifier) fileConfig.identifier = file.identifier;
      if (file.tags) fileConfig.tags = file.tags;

      return WalrusFile.from(fileConfig);
    });

    return await this.client.walrus.writeFiles({
      files: walrusFiles,
      epochs: options?.epochs || this.defaultEpochs,
      deletable:
        options?.deletable !== undefined
          ? options.deletable
          : this.defaultDeletable,
      signer: options.signer,
    });
  }

  /**
   * Upload JSON data to Walrus
   *
   * Note: identifier is optional. If not provided, the JSON is stored without a specific identifier.
   */
  async uploadJson(
    data: any,
    options: {
      identifier?: string; // Optional - e.g., 'data.json'
      epochs?: number;
      deletable?: boolean;
      signer: any;
    },
  ): Promise<{ blobId: string; id: string }> {
    const jsonString = JSON.stringify(data);
    return this.upload(jsonString, {
      epochs: options.epochs,
      deletable: options.deletable,
      signer: options.signer,
      identifier: options.identifier, // Optional
      tags: { "content-type": "application/json" },
    });
  }

  /**
   * Get files using WalrusFile API
   * From official docs: https://sdk.mystenlabs.com/walrus
   */
  async getFiles(ids: string[]): Promise<any[]> {
    return await this.client.walrus.getFiles({ ids });
  }

  /**
   * Download and parse as text
   */
  async downloadAsText(id: string): Promise<string> {
    const [file] = await this.client.walrus.getFiles({ ids: [id] });
    return await file.text();
  }

  /**
   * Download and parse as JSON
   */
  async downloadAsJson<T = any>(id: string): Promise<T> {
    const [file] = await this.client.walrus.getFiles({ ids: [id] });
    return await file.json();
  }

  /**
   * Download as bytes
   */
  async downloadAsBytes(id: string): Promise<Uint8Array> {
    const [file] = await this.client.walrus.getFiles({ ids: [id] });
    return await file.bytes();
  }

  /**
   * Get a blob and check if it's a quilt
   */
  async getBlob(blobId: string) {
    return await this.client.walrus.getBlob({ blobId });
  }

  /**
   * Read files from a quilt by identifier
   */
  async getFilesFromQuilt(blobId: string, identifiers?: string[]) {
    const blob = await this.getBlob(blobId);
    return await blob.files({ identifiers });
  }

  /**
   * Read files from a quilt by tags
   */
  async getFilesByTags(blobId: string, tags: Record<string, string>[]) {
    const blob = await this.getBlob(blobId);
    return await blob.files({ tags });
  }
}

/**
 * Factory function to create WalrusService
 *
 * IMPORTANT: Uses SuiJsonRpcClient (not SuiClient) as required by Walrus SDK
 * See: https://sdk.mystenlabs.com/walrus
 *
 * @example
 * ```typescript
 * import { createWalrusService } from '@/services';
 *
 * const walrusService = createWalrusService({
 *   network: 'testnet',  // Required for Walrus SDK
 *   epochs: 10,
 *   deletable: true
 * });
 *
 * // Upload a file
 * const file = new TextEncoder().encode('Hello from Walrus!');
 * const { blobId } = await walrusService.writeBlob(file, {
 *   epochs: 10,
 *   deletable: true,
 *   signer: keypair,  // Required - signs blockchain transaction
 * });
 *
 * // Read a file
 * const data = await walrusService.readBlob(blobId);
 * ```
 */
export function createWalrusService(config?: WalrusConfig): WalrusService {
  return new WalrusService(config);
}
