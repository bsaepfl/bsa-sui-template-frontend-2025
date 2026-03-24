# Seal Encryption Guide

Seal is an identity-based encryption system built on Sui. It lets you encrypt data so that only addresses meeting an on-chain access policy can decrypt it. Key shares are distributed across independent key servers, and decryption requires a threshold of servers to verify the caller's access on-chain before releasing their shares.

## Whitelist Pattern

This template uses the **whitelist** access control pattern:

1. **Create whitelist**: deploys a shared `Whitelist` object + an admin `Cap`
2. **Add/remove addresses**: the `Cap` owner manages who can decrypt
3. **Encrypt**: anyone can encrypt data to a whitelist's key ID
4. **Decrypt**: only whitelisted addresses can request decryption keys

## How Encryption Works

The `SealService.encrypt()` method builds an ID from the whitelist object ID and a random nonce:

```typescript
// ID = [whitelistObjectId bytes][nonce bytes]
const { encryptedBytes, backupKey } = await sealClient.encrypt({
  threshold: 1,
  packageId: whitelistPackageId,
  id: hexEncodedId,
  data: plaintext,
});
```

Seal prepends the `packageId` to form the full key ID: `[packageId][whitelistObjectId][nonce]`.

## How Decryption Works

Decryption requires a **session key** (signed by the user's wallet) and a Move transaction that proves access:

```typescript
// 1. Create session key (TTL: 10 minutes)
const sessionKey = await SessionKey.create({
  address, packageId: whitelistPackageId, ttlMin: 10, suiClient
});
sessionKey.setPersonalMessageSignature(await signPersonalMessage(sessionKey.getPersonalMessage()));

// 2. Build seal_approve transaction
const tx = new Transaction();
tx.moveCall({
  target: `${packageId}::whitelist::seal_approve`,
  arguments: [tx.pure.vector("u8", idBytes), tx.object(whitelistObjectId)],
});

// 3. Decrypt
const decrypted = await sealClient.decrypt({ data: encryptedBytes, sessionKey, txBytes });
```

Key servers execute the `seal_approve` transaction to verify the caller is whitelisted before releasing key shares.

## Move Contract

Located at `move/startHack/sources/whitelist.move`:

- `create_whitelist_entry(ctx)`: creates shared `Whitelist` + `Cap` transferred to sender
- `add(wl, cap, address)`: add address to whitelist (cap holder only)
- `remove(wl, cap, address)`: remove address from whitelist
- `seal_approve(id, wl, ctx)`: called by key servers to verify access

## Key Server Selection

10 testnet key servers are available in `sealService.ts` (`SEAL_TESTNET_SERVERS`). The UI lets users pick which server to use. Default: `Mysten Testnet 1`.

## Code Locations

| File | Purpose |
|------|---------|
| `app/SealWhitelist.tsx` | Full UI: create whitelist, add/remove addresses, encrypt/decrypt |
| `app/services/sealService.ts` | `SealService` class: encrypt, decrypt, session keys |
| `app/services/whitelistService.ts` | `WhitelistService`: transaction builders for whitelist operations |
| `move/startHack/sources/whitelist.move` | On-chain whitelist + seal_approve |
| `app/constants.ts` | `TESTNET_WHITELIST_PACKAGE_ID` |
