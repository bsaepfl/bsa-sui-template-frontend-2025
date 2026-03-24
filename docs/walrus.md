# Walrus Storage Guide

Walrus is a decentralized blob storage network built on Sui. Data is erasure-coded and distributed across storage nodes. This template provides two ways to use Walrus: a free publisher HTTP API (no wallet needed) and the official SDK (requires WAL tokens).

## Two Upload Modes

| Mode | File | Wallet needed | Cost |
|------|------|---------------|------|
| Publisher HTTP API | `WalrusUpload.tsx` | No | Free (testnet) |
| SDK with WAL payment | `walrusServiceSDK.ts` / `walrusServiceDirect.ts` | Yes | WAL tokens |

The publisher API is simpler and ideal for hackathons. The SDK gives full control (deletable blobs, quilts, cost estimation).

## Upload via Publisher HTTP API

The `WalrusUpload` component uses a simple `PUT` request:

```typescript
const response = await fetch(
  `${WALRUS_TESTNET_PUBLISHER}/v1/blobs?epochs=${epochs}`,
  { method: "PUT", body: rawBytes }
);
const data: WalrusStoreResponse = await response.json();
// data.newlyCreated?.blobObject.blobId or data.alreadyCertified?.blobId
```

- `epochs` controls how long data is stored (more epochs = longer retention)
- Response contains either `newlyCreated` or `alreadyCertified` depending on content deduplication

## Download via Aggregator

The `WalrusRead` component fetches blobs by ID:

```typescript
const url = `${WALRUS_TESTNET_AGGREGATOR}/v1/blobs/${blobId}`;
const response = await fetch(url);
const blob = await response.blob();
```

The aggregator reconstructs data from storage nodes. Content type is returned in headers.

## Upload via SDK (WAL Payment)

`walrusServiceSDK.ts` uses the `walrus()` extension on `SuiJsonRpcClient`:

```typescript
const client = new SuiJsonRpcClient({ url, network: "testnet" })
  .$extend(walrus({ wasmUrl: "..." }));

const result = await client.walrus.writeBlob({
  blob, deletable: true, epochs: 5, signer
});
```

`walrusServiceDirect.ts` uses `new WalrusClient()` directly for more control over configuration.

Both require a `signer` (wallet keypair) and charge WAL tokens.

## WalrusRead Component

Fetches a blob by ID, auto-detects text content, and displays it inline. Binary blobs get a download link. Shows content type and size metadata.

## Blob Persistence

The `useOwnedBlobs` hook merges two data sources:
- **localStorage**: all uploads (publisher + SDK) saved with metadata (blobId, mimeType, timestamp)
- **On-chain**: `getOwnedObjects` with `StructType` filter for Walrus `Blob` objects owned by the wallet

Blobs are deduped by `blobId`. Publisher uploads only appear in localStorage (the publisher owns the on-chain object).

## WAL Balance

The `useWalBalance` hook queries the user's WAL token balance using `useSuiClientQuery("getBalance", ...)` with the WAL coin type. Returns formatted balance and a `hasEnoughFor(cost)` helper.

## Code Locations

| File | Purpose |
|------|---------|
| `app/WalrusUpload.tsx` | Upload UI (publisher HTTP API) |
| `app/WalrusRead.tsx` | Read/display blobs by ID |
| `app/services/walrusServiceSDK.ts` | SDK upload via `walrus()` extension |
| `app/services/walrusServiceDirect.ts` | SDK upload via `WalrusClient` |
| `app/hooks/useOwnedBlobs.ts` | Merge localStorage + on-chain history |
| `app/hooks/useWalBalance.ts` | WAL token balance hook |
| `app/constants.ts` | `WALRUS_TESTNET_AGGREGATOR`, `WALRUS_TESTNET_PUBLISHER` |
