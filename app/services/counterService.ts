import { SuiClient } from '@mysten/sui/client';
import { Transaction } from "@mysten/sui/transactions";
import type { CounterData, CounterFields } from './types';
import { getCounterFields } from './types';

/**
 * Counter Service
 * Handles all blockchain interactions for Counter smart contract
 */
export class CounterService {
  private suiClient: SuiClient;
  private packageId: string;

  constructor(suiClient: SuiClient, packageId: string) {
    this.suiClient = suiClient;
    this.packageId = packageId;
  }

  /**
   * Create a new counter transaction
   */
  createCounterTransaction(): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [],
      target: `${this.packageId}::counter::create`,
    });
    return tx;
  }

  /**
   * Increment counter transaction
   */
  incrementCounterTransaction(counterId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(counterId)],
      target: `${this.packageId}::counter::increment`,
    });
    return tx;
  }

  /**
   * Reset counter transaction (set value to 0)
   */
  resetCounterTransaction(counterId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(counterId), tx.pure.u64(0)],
      target: `${this.packageId}::counter::set_value`,
    });
    return tx;
  }

  /**
   * Set counter to specific value transaction
   */
  setCounterValueTransaction(counterId: string, value: number): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(counterId), tx.pure.u64(value)],
      target: `${this.packageId}::counter::set_value`,
    });
    return tx;
  }

  /**
   * Get counter object data by ID
   */
  async getCounter(counterId: string): Promise<CounterData | null> {
    try {
      const object = await this.suiClient.getObject({
        id: counterId,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
        },
      });

      if (!object.data) {
        return null;
      }

      const fields = getCounterFields(object.data);
      if (!fields) {
        return null;
      }

      return {
        objectId: counterId,
        value: fields.value,
        owner: fields.owner,
      };
    } catch (error) {
      console.error("Error fetching counter:", error);
      return null;
    }
  }

  /**
   * Wait for transaction to complete and get created object ID
   * Useful for getting newly created counter ID
   */
  async waitForTransactionAndGetCreatedObject(
    digest: string
  ): Promise<string | null> {
    try {
      const { effects } = await this.suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      const createdObjectId = effects?.created?.[0]?.reference?.objectId;
      return createdObjectId || null;
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      return null;
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
   * Check if an address owns a counter
   */
  async isCounterOwnedBy(counterId: string, address: string): Promise<boolean> {
    const counter = await this.getCounter(counterId);
    return counter?.owner === address;
  }

  /**
   * Search for counters by owner address
   * Returns all counter objects owned by the address
   */
  async getCountersByOwner(ownerAddress: string): Promise<CounterData[]> {
    try {
      // Query objects owned by the address
      const objects = await this.suiClient.getOwnedObjects({
        owner: ownerAddress,
        options: {
          showContent: true,
          showType: true,
        },
        filter: {
          StructType: `${this.packageId}::counter::Counter`,
        },
      });

      const counters: CounterData[] = [];
      
      for (const obj of objects.data) {
        if (obj.data) {
          const fields = getCounterFields(obj.data);
          if (fields) {
            counters.push({
              objectId: obj.data.objectId,
              value: fields.value,
              owner: fields.owner,
            });
          }
        }
      }

      return counters;
    } catch (error) {
      console.error("Error fetching counters by owner:", error);
      return [];
    }
  }
}

/**
 * Factory function to create a CounterService instance
 */
export function createCounterService(
  suiClient: SuiClient,
  packageId: string
): CounterService {
  return new CounterService(suiClient, packageId);
}

