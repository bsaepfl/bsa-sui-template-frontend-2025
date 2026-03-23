# CLAUDE.md

## Project Overview

BSA 2025 Sui Template Frontend — a Next.js dApp starter template for the Sui blockchain. Features a counter smart contract (Move) with a React/TypeScript frontend for creating, incrementing, and managing on-chain counters.

## Tech Stack

- **Framework:** Next.js 15.5 (App Router) with React 19
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui (New York style)
- **Blockchain:** Sui SDK (`@mysten/sui` v1.38) + dApp Kit (`@mysten/dapp-kit` v0.18)
- **State Management:** TanStack React Query v5
- **Smart Contracts:** Sui Move (2024.beta edition)
- **Package Manager:** pnpm (>= 8.0.0)
- **Node.js:** >= 18.12.0 (see `.nvmrc`)

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix
```

## Project Structure

```
app/                        # Next.js app directory (also aliased as @/*)
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page entry point
├── providers.tsx           # React Query + Sui client + wallet providers
├── App.tsx                 # Main app component (view routing)
├── Counter.tsx             # Counter display & interaction (increment/reset)
├── CreateCounter.tsx       # Counter creation form
├── constants.ts            # Network-specific package IDs
├── networkConfig.ts        # Sui network configuration & hooks
├── globals.css             # Global styles + CSS variables
├── lib/
│   └── utils.ts            # cn() utility for Tailwind class merging
└── components/
    ├── Navbar.tsx           # Navigation bar with wallet connect
    ├── CounterList.tsx      # Search & list existing counters
    └── ui/                  # shadcn/ui components (button, card, input, alert, navigation-menu)

move/counter/               # Sui Move smart contract
├── Move.toml               # Package manifest (counter @ 0x0)
├── Move.lock               # Dependency lock
└── sources/
    └── counter.move         # Counter module: create, increment, set_value
```

## Path Aliases

- `@/*` maps to `./app/*` (configured in `tsconfig.json`)
- shadcn/ui aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`

## Key Architecture Patterns

- **Providers:** All blockchain/wallet context is set up in `app/providers.tsx` wrapping the app
- **Network config:** Multi-network support (devnet/testnet/mainnet) via `networkConfig.ts`; use `useNetworkVariable('counterPackageId')` to get the correct package ID
- **Transaction flow:** Components create Move transactions via `@mysten/sui` → signed by wallet via `useSignAndExecuteTransaction()` → confirmed on-chain → UI updated via React Query refetch
- **Smart contract calls:** Use `counterPackageId::counter::<function>` pattern (e.g., `increment`, `create`, `set_value`)
- **Package IDs:** Stored in `constants.ts` per network; testnet is configured, devnet/mainnet are `"0xTODO"`

## Smart Contract (Move)

The `counter` module at `move/counter/sources/counter.move`:
- `Counter` struct: shared object with `id`, `owner`, `value`
- `OwnerCap` struct: ownership capability
- `create()`: creates and shares a new counter
- `increment(counter)`: public, increments by 1
- `set_value(counter, value, ctx)`: owner-only, sets value

## Code Style

- **Formatter:** Prettier (prose wrap: always)
- **Linter:** ESLint with `@typescript-eslint` and `react-hooks` plugins (note: `eslint.config.js` is missing; `pnpm lint` will fail until one is created)
- **Components:** Functional components with TypeScript, using shadcn/ui primitives
- **CSS:** Tailwind utility classes; use `cn()` from `@/lib/utils` for conditional classes
- **Imports:** Use `@/` path alias for app-relative imports

## Development Notes

- Default network is **testnet**
- Wallet auto-connect is enabled in providers
- SVGs are processed via `@svgr/webpack` (turbopack config in `next.config.js`)
- No test framework is currently configured
- No CI/CD pipeline exists yet
- Dev container config available in `.devcontainer/` for GitHub Codespaces
