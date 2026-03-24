"use client";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState, useEffect, useCallback } from "react";

/**
 * Walrus Blob type on testnet (from the walrus system package).
 */
const TESTNET_BLOB_TYPE =
  "0xa998b8719ca1c0a6dc4e24a859bbb39f5477417f71885fbf2967a6510f699144::blob::Blob";

const LOCAL_STORAGE_KEY = "walrus-upload-history";

export interface StoredBlob {
  readonly blobId: string;
  readonly objectId: string;
  readonly url: string;
  readonly size: number;
  readonly mimeType: string;
  readonly filename?: string;
  readonly timestamp: number;
  /** "publisher" = free testnet publisher, "sdk" = user paid WAL */
  readonly source: "publisher" | "sdk";
}

interface OnChainBlob {
  readonly objectId: string;
  readonly blobId: string;
  readonly size: number;
  readonly registeredEpoch: number;
  readonly endEpoch: number;
  readonly deletable: boolean;
}

interface UseOwnedBlobsResult {
  /** All blobs: localStorage + on-chain merged, deduped by blobId */
  readonly blobs: readonly StoredBlob[];
  /** On-chain blobs owned by the connected wallet */
  readonly onChainBlobs: readonly OnChainBlob[];
  /** Whether on-chain query is loading */
  readonly isLoading: boolean;
  /** Add a blob to localStorage history */
  readonly addBlob: (blob: StoredBlob) => void;
  /** Clear localStorage history */
  readonly clearHistory: () => void;
  /** Refetch on-chain blobs */
  readonly refetch: () => void;
}

/**
 * Hook that merges localStorage upload history with on-chain owned Blob objects.
 * - Publisher uploads: stored in localStorage only (publisher owns the object)
 * - SDK uploads: stored both in localStorage AND on-chain (user owns the object)
 */
export function useOwnedBlobs(): UseOwnedBlobsResult {
  const currentAccount = useCurrentAccount();

  // localStorage history
  const [localBlobs, setLocalBlobs] = useState<StoredBlob[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setLocalBlobs(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage when localBlobs change
  const persistToStorage = useCallback((blobs: StoredBlob[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blobs));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const addBlob = useCallback(
    (blob: StoredBlob) => {
      setLocalBlobs((prev) => {
        const updated = [blob, ...prev.filter((b) => b.blobId !== blob.blobId)];
        persistToStorage(updated);
        return updated;
      });
    },
    [persistToStorage],
  );

  const clearHistory = useCallback(() => {
    setLocalBlobs([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  // Query on-chain Blob objects owned by the wallet
  const {
    data: ownedObjects,
    isLoading,
    refetch,
  } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: currentAccount?.address ?? "",
      filter: { StructType: TESTNET_BLOB_TYPE },
      options: { showContent: true, showType: true },
    },
    { enabled: !!currentAccount?.address },
  );

  // Parse on-chain blobs
  const onChainBlobs: OnChainBlob[] = (ownedObjects?.data ?? [])
    .filter(
      (obj) => obj.data?.content?.dataType === "moveObject",
    )
    .map((obj) => {
      const content = obj.data!.content as { dataType: "moveObject"; fields: Record<string, unknown> };
      const fields = content.fields;
      const storage = fields.storage as Record<string, unknown> | undefined;
      return {
        objectId: obj.data!.objectId,
        blobId: String(fields.blob_id ?? ""),
        size: Number(fields.size ?? 0),
        registeredEpoch: Number(fields.registered_epoch ?? 0),
        endEpoch: Number(storage?.end_epoch ?? 0),
        deletable: Boolean(fields.deletable),
      };
    });

  // Merge: localStorage + on-chain, dedupe by blobId
  const mergedBlobs: StoredBlob[] = [...localBlobs];
  for (const onChain of onChainBlobs) {
    if (!mergedBlobs.some((b) => b.blobId === onChain.blobId)) {
      mergedBlobs.push({
        blobId: onChain.blobId,
        objectId: onChain.objectId,
        url: `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${onChain.blobId}`,
        size: onChain.size,
        mimeType: "application/octet-stream",
        timestamp: 0,
        source: "sdk",
      });
    }
  }

  return {
    blobs: mergedBlobs,
    onChainBlobs,
    isLoading,
    addBlob,
    clearHistory,
    refetch,
  };
}
