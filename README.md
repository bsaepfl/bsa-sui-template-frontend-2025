# BSA Sui Template Frontend 2025

Hackathon starter template for building dApps on Sui with Walrus storage and Seal encryption.

## Quick Start

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Stack

- Next.js 16 + React 19 + TypeScript
- @mysten/sui v2 + @mysten/dapp-kit v1
- @mysten/walrus v1.1 (decentralized storage)
- @mysten/seal v1.1 (identity-based encryption)
- Tailwind CSS v4 + shadcn/ui

## Features

- Counter smart contract (Move) with increment/reset
- Walrus file upload/download with MIME detection
- Seal encryption with whitelist access control
- WAL token balance display
- Persistent upload history (localStorage + on-chain)

## Documentation

- [Walrus Storage Guide](docs/walrus.md)
- [Seal Encryption Guide](docs/seal.md)
- [Event Fetching Patterns](docs/events.md)

## Project Structure

```
app/
  layout.tsx              # Root layout with providers
  page.tsx                # Home page
  providers.tsx           # React Query + Sui + Wallet providers
  App.tsx                 # Main view routing
  Counter.tsx             # Counter display and interaction
  CreateCounter.tsx       # Counter creation
  WalrusUpload.tsx        # Upload to Walrus (publisher HTTP API)
  WalrusRead.tsx          # Read blobs from Walrus
  SealWhitelist.tsx       # Seal encrypt/decrypt with whitelist
  constants.ts            # Package IDs + Walrus endpoints
  networkConfig.ts        # Multi-network Sui config
  services/
    sealService.ts        # Seal encryption/decryption
    whitelistService.ts   # Whitelist contract interactions
    walrusServiceSDK.ts   # Walrus SDK (wallet-signed)
    walrusServiceDirect.ts # WalrusClient direct instantiation
  hooks/
    useOwnedBlobs.ts      # Merge localStorage + on-chain blobs
    useWalBalance.ts      # WAL token balance
  components/
    Navbar.tsx             # Nav bar with wallet connect
    CounterList.tsx        # Search counters by object ID
    ui/                    # shadcn/ui primitives
move/startHack/
  sources/
    counter.move           # Counter: create, increment, set_value
    whitelist.move         # Whitelist: create, add, remove, seal_approve
```

## Commands

```bash
pnpm dev        # Dev server (port 3000)
pnpm build      # Production build
pnpm lint       # ESLint
pnpm lint:fix   # ESLint with auto-fix
```

## Network

Default: **Sui Testnet**

Package IDs and Walrus endpoints are configured in `app/constants.ts`.
