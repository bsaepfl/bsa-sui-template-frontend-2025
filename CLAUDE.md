# CLAUDE.md

## Project Overview

BSA 2025 Sui Template Frontend — a Next.js dApp starter for the Sui
blockchain. Counter smart contract (Move) with a React/TypeScript frontend
for creating, incrementing, and managing on-chain counters.

## Tech Stack

- **Framework:** Next.js 16.2 (App Router, Turbopack) with React 19
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS v4.2 + shadcn/ui (New York style)
- **Blockchain:** Sui SDK (`@mysten/sui` v2.9) + dApp Kit (`@mysten/dapp-kit`
  v1.0)
- **State Management:** TanStack React Query v5
- **Smart Contracts:** Sui Move (2024.beta edition)
- **Package Manager:** pnpm (>= 8.0.0)
- **Node.js:** >= 20.9.0 (see `.nvmrc`)

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix
```

## Testing Before Commits

**Always run the full verification suite before every commit:**

```bash
pnpm lint && pnpm build
```

Both commands must pass with zero errors. Do not skip either step. If lint
fails, fix all reported issues before committing. If build fails, resolve
all type errors and build issues before committing. No partial passes — both
must succeed cleanly.

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
    └── ui/                  # shadcn/ui primitives (button, card, input, alert, navigation-menu)

move/counter/               # Sui Move smart contract
├── Move.toml               # Package manifest (counter @ 0x0)
├── Move.lock               # Dependency lock
└── sources/
    └── counter.move         # Counter module: create, increment, set_value
```

## Path Aliases

- `@/*` maps to `./app/*` (configured in `tsconfig.json`)

## Key Architecture Patterns

- **Providers:** `app/providers.tsx` wraps the app with `SuiClientProvider`,
  `WalletProvider`, and `QueryClientProvider`
- **Network config:** Multi-network support (devnet/testnet/mainnet) via
  `networkConfig.ts`; use `useNetworkVariable('counterPackageId')` for the
  correct package ID per network
- **Sui SDK v2 imports:** `getJsonRpcFullnodeUrl` from `@mysten/sui/jsonRpc`
  (not `@mysten/sui/client`); `Transaction` from
  `@mysten/sui/transactions`; `isValidSuiObjectId` from `@mysten/sui/utils`
- **Transaction flow:** Components build Move transactions via `Transaction`
  from `@mysten/sui/transactions` → signed by wallet via
  `useSignAndExecuteTransaction()` → confirmed on-chain → UI updated via
  React Query refetch
- **Smart contract calls:** Use
  `counterPackageId::counter::<function>` pattern (`increment`, `create`,
  `set_value`)
- **Package IDs:** Stored in `constants.ts` per network; testnet is
  configured, devnet/mainnet are `"0xTODO"`

## Smart Contract (Move)

Module `counter::counter` at `move/counter/sources/counter.move`:

- `Counter` struct: shared object with `id`, `owner`, `value`
- `OwnerCap` struct: ownership capability
- `create(ctx)`: creates and shares a new counter
- `increment(counter)`: public, increments by 1
- `set_value(counter, value, ctx)`: owner-only, sets arbitrary value

## Code Style

- **Formatter:** Prettier (config in `prettier.config.cjs`)
- **Linter:** ESLint 9 with `@typescript-eslint` and `react-hooks` plugins
  (note: `eslint.config.js` is missing; `pnpm lint` will fail until created)
- **Components:** Functional components with TypeScript, using shadcn/ui
  primitives
- **CSS:** Tailwind utility classes; use `cn()` from `@/lib/utils` for
  conditional classes
- **Imports:** Use `@/` path alias for app-relative imports

## Git Conventions

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <description>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`

**Scopes:** `ui`, `wallet`, `counter`, `move`, `config`, `deps`

**Rules:** imperative mood, lowercase after colon, max 72 chars, no trailing
period. Body explains what/why, not how. Footer: `Closes #N` or
`BREAKING CHANGE:`.

### Branches

Format: `<type>/<short-kebab-case-description>` — branch from and merge to
`main` via PR.

### Pull Requests

Title follows commit convention, under 72 chars. Body includes Summary,
Changes, Test Plan, and Related Issues sections. Keep PRs small and focused
(< 400 lines of diff).

## Development Notes

- Default network is **testnet**
- Wallet auto-connect is enabled in providers
- Sui SDK v2 is ESM-only; uses `@mysten/sui/jsonRpc` for JSON-RPC client
  (JSON-RPC sunset by July 2026; future migration to gRPC via
  `@mysten/sui/grpc`)
- Network config requires a `network` property alongside `url` (Sui SDK v2)
- Turbopack is the default bundler in Next.js 16
- No test framework is currently configured
- No CI/CD pipeline exists yet
- Dev container config available in `.devcontainer/`
