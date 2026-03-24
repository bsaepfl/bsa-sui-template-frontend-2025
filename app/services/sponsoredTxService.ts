import { EnokiClient } from "@mysten/enoki";
import { Transaction } from "@mysten/sui/transactions";
import { toBase64 } from "@mysten/sui/utils";
import type { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

const ENOKI_API_KEY = process.env.NEXT_PUBLIC_ENOKI_API_KEY ?? "";

interface SponsoredTxResult {
  readonly digest: string;
  readonly bytes: string;
}

/**
 * Create and execute sponsored transactions via Enoki.
 * zkLogin users can transact without SUI for gas.
 */
export class SponsoredTxService {
  private readonly enokiClient: EnokiClient;
  private readonly network: "testnet" | "mainnet";

  constructor(network: "testnet" | "mainnet" = "testnet") {
    this.network = network;
    this.enokiClient = new EnokiClient({ apiKey: ENOKI_API_KEY });
  }

  /**
   * Sponsor a transaction. Enoki pays the gas fees.
   * The caller must then sign the returned bytes and call executeSponsored.
   */
  async createSponsored(options: {
    readonly transaction: Transaction;
    readonly sender: string;
    readonly suiClient: SuiJsonRpcClient;
    readonly allowedMoveCallTargets?: string[];
    readonly allowedAddresses?: string[];
  }): Promise<SponsoredTxResult> {
    const txBytes = await options.transaction.build({
      client: options.suiClient,
      onlyTransactionKind: true,
    });

    const result = await this.enokiClient.createSponsoredTransaction({
      network: this.network,
      transactionKindBytes: toBase64(txBytes),
      sender: options.sender,
      allowedMoveCallTargets: options.allowedMoveCallTargets,
      allowedAddresses: options.allowedAddresses,
    });

    return { digest: result.digest, bytes: result.bytes };
  }

  /**
   * Execute a sponsored transaction after the user has signed it.
   */
  async executeSponsored(digest: string, signature: string): Promise<void> {
    await this.enokiClient.executeSponsoredTransaction({ digest, signature });
  }
}

export function createSponsoredTxService(
  network: "testnet" | "mainnet" = "testnet",
): SponsoredTxService {
  return new SponsoredTxService(network);
}
