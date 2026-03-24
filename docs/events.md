# Event Fetching Patterns

This guide covers how the template queries on-chain data using `@mysten/dapp-kit` hooks backed by TanStack React Query.

## useSuiClientQuery

The main hook for all Sui RPC queries. It wraps any Sui JSON-RPC method with React Query (auto-refetch, caching, loading states):

```typescript
import { useSuiClientQuery } from "@mysten/dapp-kit";

const { data, isPending, error, refetch } = useSuiClientQuery(
  "getObject",  // RPC method name
  { id: objectId, options: { showContent: true } },  // params
  { enabled: !!objectId }  // React Query options
);
```

## Pattern: Get Object Data (Counter)

The `Counter` component fetches a single object by ID:

```typescript
const { data, refetch } = useSuiClientQuery("getObject", {
  id: counterId,
  options: { showContent: true, showOwner: true },
});

// Access Move struct fields
const fields = data.data.content.fields as { value: number; owner: string };
```

After a transaction, call `refetch()` to update the UI.

## Pattern: Get Owned Objects (Walrus Blobs)

The `useOwnedBlobs` hook finds all Walrus Blob objects owned by the wallet:

```typescript
const { data } = useSuiClientQuery("getOwnedObjects", {
  owner: currentAccount.address,
  filter: { StructType: "0xa998...::blob::Blob" },
  options: { showContent: true, showType: true },
}, { enabled: !!currentAccount?.address });
```

## Pattern: Get Owned Objects (Seal Caps)

The `WhitelistService` finds all `Cap` objects to list the user's whitelists:

```typescript
const objects = await suiClient.getOwnedObjects({
  owner: ownerAddress,
  filter: { StructType: `${packageId}::whitelist::Cap` },
  options: { showContent: true, showType: true },
});
```

## Pattern: Network Variables

Use `useNetworkVariable` to get the correct package ID for the current network:

```typescript
import { useNetworkVariable } from "./networkConfig";
const counterPackageId = useNetworkVariable("counterPackageId");
```

Defined in `networkConfig.ts` using `createNetworkConfig()` from dapp-kit.

## Pattern: Token Balance

The `useWalBalance` hook uses `getBalance` to fetch a specific coin type:

```typescript
const { data } = useSuiClientQuery("getBalance", {
  owner: address,
  coinType: "0xa998...::wal::WAL",
});
const balance = BigInt(data?.totalBalance ?? "0");
```

## Transaction Flow

1. Build a `Transaction` with `moveCall()`
2. Sign and execute with `useSignAndExecuteTransaction()`
3. Wait for confirmation with `suiClient.waitForTransaction({ digest })`
4. Refetch data with `refetch()` from the query hook
