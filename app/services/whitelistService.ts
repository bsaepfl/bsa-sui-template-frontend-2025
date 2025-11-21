import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export interface WhitelistData {
  objectId: string;
  version: number;
  addresses: string[];
}

export interface CapData {
  objectId: string;
  whitelistId: string;
}

/**
 * Whitelist Service
 * Handles all blockchain interactions for Whitelist smart contract
 */
export class WhitelistService {
  private suiClient: SuiClient;
  private packageId: string;

  constructor(suiClient: SuiClient, packageId: string) {
    this.suiClient = suiClient;
    this.packageId = packageId;
  }

  /**
   * Create a new whitelist transaction
   * Calls create_whitelist_entry which creates both Cap and Whitelist
   */
  createWhitelistTransaction(): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [],
      target: `${this.packageId}::whitelist::create_whitelist_entry`,
    });
    return tx;
  }

  /**
   * Add an address to the whitelist
   */
  addAddressTransaction(
    whitelistId: string,
    capId: string,
    address: string,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [
        tx.object(whitelistId),
        tx.object(capId),
        tx.pure.address(address),
      ],
      target: `${this.packageId}::whitelist::add`,
    });
    return tx;
  }

  /**
   * Remove an address from the whitelist
   */
  removeAddressTransaction(
    whitelistId: string,
    capId: string,
    address: string,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [
        tx.object(whitelistId),
        tx.object(capId),
        tx.pure.address(address),
      ],
      target: `${this.packageId}::whitelist::remove`,
    });
    return tx;
  }

  /**
   * Get Cap object data by ID
   */
  async getCap(capId: string): Promise<CapData | null> {
    try {
      const object = await this.suiClient.getObject({
        id: capId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (!object.data || !object.data.content) {
        return null;
      }

      const content = object.data.content;
      if (content.dataType !== "moveObject") {
        return null;
      }

      const fields = content.fields as any;
      return {
        objectId: capId,
        whitelistId: fields.wl_id,
      };
    } catch (error) {
      console.error("Error fetching cap:", error);
      return null;
    }
  }

  /**
   * Wait for transaction to complete and get created object IDs
   * Returns both the Cap ID and Whitelist ID
   */
  async waitForTransactionAndGetCreatedObjects(
    digest: string,
  ): Promise<{ capId: string | null; whitelistId: string | null }> {
    try {
      const { effects } = await this.suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      if (!effects?.created) {
        return { capId: null, whitelistId: null };
      }

      // Find Cap and Whitelist objects
      let capId: string | null = null;
      let whitelistId: string | null = null;

      for (const created of effects.created) {
        const objectId = created.reference?.objectId;
        if (!objectId) continue;

        // Check the type to determine if it's a Cap or Whitelist
        const object = await this.suiClient.getObject({
          id: objectId,
          options: { showType: true },
        });

        if (object.data?.type) {
          if (object.data.type.includes("::whitelist::Cap")) {
            capId = objectId;
          } else if (object.data.type.includes("::whitelist::Whitelist")) {
            whitelistId = objectId;
          }
        }
      }

      return { capId, whitelistId };
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      return { capId: null, whitelistId: null };
    }
  }

  /**
   * Wait for transaction to complete
   */
  async waitForTransaction(digest: string): Promise<void> {
    try {
      await this.suiClient.waitForTransaction({ digest });
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      throw error;
    }
  }

  /**
   * Get all Caps owned by an address
   */
  async getCapsByOwner(ownerAddress: string): Promise<CapData[]> {
    try {
      const objects = await this.suiClient.getOwnedObjects({
        owner: ownerAddress,
        options: {
          showContent: true,
          showType: true,
        },
        filter: {
          StructType: `${this.packageId}::whitelist::Cap`,
        },
      });

      const caps: CapData[] = [];

      for (const obj of objects.data) {
        if (
          obj.data &&
          obj.data.content &&
          obj.data.content.dataType === "moveObject"
        ) {
          const fields = obj.data.content.fields as any;
          caps.push({
            objectId: obj.data.objectId,
            whitelistId: fields.wl_id,
          });
        }
      }

      return caps;
    } catch (error) {
      console.error("Error fetching caps by owner:", error);
      return [];
    }
  }
}

/**
 * Factory function to create a WhitelistService instance
 */
export function createWhitelistService(
  suiClient: SuiClient,
  packageId: string,
): WhitelistService {
  return new WhitelistService(suiClient, packageId);
}
