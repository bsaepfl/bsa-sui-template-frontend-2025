# zkLogin with Enoki

zkLogin lets users sign in with OAuth providers (Google, Facebook, Apple, Twitch) instead of a wallet extension. Enoki handles ZK proof generation, salt management, and sponsored transactions.

## How it works

1. User clicks "Sign in with Google" (or other provider)
2. Enoki SDK registers as a wallet in dApp Kit via `registerEnokiWallets`
3. OAuth redirect authenticates the user
4. Enoki generates a ZK proof linking the OAuth identity to a Sui address
5. The user can now sign transactions with their OAuth-derived address
6. Sponsored transactions allow gas-free interactions

## Setup

### 1. Create an Enoki project

Go to [portal.enoki.mystenlabs.com](https://portal.enoki.mystenlabs.com) and create a project. Get your API key.

### 2. Create OAuth Client IDs

For each provider you want to support:

- **Google**: [console.cloud.google.com](https://console.cloud.google.com) > APIs & Services > Credentials > Create OAuth Client ID
  - Application type: Web application
  - Authorized redirect URIs: `http://localhost:3000` (dev) + your production URL
  - Configure the Client ID in Enoki portal

- **Facebook**: [developers.facebook.com](https://developers.facebook.com) > Create App > Facebook Login
- **Twitch**: [dev.twitch.tv](https://dev.twitch.tv) > Console > Applications
- **Apple**: [developer.apple.com](https://developer.apple.com) > Certificates, Identifiers & Profiles

### 3. Configure environment variables

```bash
# .env
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_xxxxx
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
# Optional: add more providers
# NEXT_PUBLIC_FACEBOOK_CLIENT_ID=xxxxx
# NEXT_PUBLIC_TWITCH_CLIENT_ID=xxxxx
# NEXT_PUBLIC_APPLE_CLIENT_ID=xxxxx
```

### 4. Configure sponsored transactions in Enoki portal

In the Enoki portal, add the Move call targets that should be sponsorable:

```
{COUNTER_PACKAGE_ID}::counter::create
{COUNTER_PACKAGE_ID}::counter::increment
{COUNTER_PACKAGE_ID}::counter::set_value
{WHITELIST_PACKAGE_ID}::whitelist::create_whitelist_entry
{WHITELIST_PACKAGE_ID}::whitelist::add
{WHITELIST_PACKAGE_ID}::whitelist::remove
```

## Code locations

| File | Purpose |
|------|---------|
| `app/providers.tsx` | `RegisterEnokiWallets` component registers Enoki wallets in dApp Kit |
| `app/components/ZkLoginButtons.tsx` | OAuth sign-in buttons (Google, Facebook, etc.) |
| `app/services/sponsoredTxService.ts` | Create and execute sponsored transactions via Enoki |
| `app/services/index.ts` | Re-exports `SponsoredTxService` |

## Sponsored transactions

zkLogin users may not have SUI for gas. Enoki can sponsor transactions:

```typescript
import { createSponsoredTxService } from "@/services";
import { Transaction } from "@mysten/sui/transactions";

const sponsor = createSponsoredTxService("testnet");
const tx = new Transaction();
tx.moveCall({ target: "...", arguments: [...] });

// Enoki sponsors the gas
const { digest, bytes } = await sponsor.createSponsored({
  transaction: tx,
  sender: userAddress,
  suiClient,
  allowedMoveCallTargets: ["0x...::counter::increment"],
});

// User signs the sponsored transaction bytes
const { signature } = await signTransaction({ transaction: fromBase64(bytes) });

// Execute with Enoki
await sponsor.executeSponsored(digest, signature);
```

## Architecture

```
User clicks "Sign in with Google"
    │
    ▼
registerEnokiWallets (providers.tsx)
    │ registers Google/Facebook/etc as dApp Kit wallets
    ▼
useConnectWallet({ wallet: googleWallet })
    │ triggers OAuth redirect
    ▼
Google OAuth → returns id_token
    │
    ▼
Enoki generates ZK proof + derives Sui address
    │
    ▼
User is "connected" in dApp Kit (same as wallet extension)
    │
    ▼
Transactions signed via zkLogin keypair
    │ optionally sponsored by Enoki (gas-free)
    ▼
On-chain execution
```
