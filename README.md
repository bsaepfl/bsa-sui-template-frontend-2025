# BSA Sui Template Frontend 2025

Hackathon starter template for building dApps on Sui with Walrus storage and Seal encryption.

## Quick Start (from scratch)

### 1. Install prerequisites

**Node.js** (v18+):
```bash
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
```

**pnpm** (package manager):
```bash
npm install -g pnpm
```

**Sui CLI** (for smart contract development):
```bash
# macOS
brew install sui

# Linux / WSL
curl -fsSL https://sui.io/install.sh | bash

# Verify installation
sui --version
sui client active-address
```

If you don't have a Sui wallet address yet:
```bash
sui client new-address ed25519
sui client switch --address <your-new-address>

# Get testnet SUI tokens
sui client faucet --url https://faucet.testnet.sui.io
```

**Sui wallet extension** (for the frontend):
Install [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil) or [Suiet](https://chrome.google.com/webstore/detail/suiet/khpkpbbcccdmmclmpigdgddabeilkdpd) in your browser and switch to **Testnet**.

### 2. Clone and run

```bash
git clone https://github.com/bsaepfl/bsa-sui-template-frontend-2025.git
cd bsa-sui-template-frontend-2025
pnpm install
pnpm dev
# Open http://localhost:3000
```

### 3. Connect and use

1. Open http://localhost:3000
2. Click **Connect Wallet** (top right)
3. Approve the connection in your wallet extension
4. Explore: Counter, Walrus Storage, Seal Encryption via the **Features** menu

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
