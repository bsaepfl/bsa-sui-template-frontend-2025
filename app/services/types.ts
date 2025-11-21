import type { SuiObjectData } from "@mysten/sui/client";

/**
 * Represents a Counter object from the blockchain
 */
export interface CounterData {
  objectId: string;
  value: number;
  owner: string;
}

/**
 * Fields of a Counter object as stored on-chain
 */
export interface CounterFields {
  value: number;
  owner: string;
}

/**
 * Walrus storage response
 */
export interface WalrusUploadResponse {
  blobId: string;
  url: string;
  size: number;
}

/**
 * Walrus configuration
 */
export interface WalrusConfig {
  publisherUrl: string;
  aggregatorUrl: string;
  epochs?: number;
}

/**
 * Extract counter fields from Sui object data
 */
export function getCounterFields(data: SuiObjectData): CounterFields | null {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }
  return data.content.fields as unknown as CounterFields;
}
