# CLAUDE.md

## Project Overview

BSA 2025 Sui Template Frontend — a Next.js dApp starter template for the Sui blockchain. Features a counter smart contract (Move) with a React/TypeScript frontend for creating, incrementing, and managing on-chain counters.

## Tech Stack

- **Framework:** Next.js 16.2 (App Router, Turbopack) with React 19
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS v4.2 + shadcn/ui (New York style)
- **Blockchain:** Sui SDK (`@mysten/sui` v2.9) + dApp Kit (`@mysten/dapp-kit` v1.0)
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

## Git Conventions

### Commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/)
specification:

```
<type>(scope): <description>

[optional body]

[optional footer]
```

**Types:**

| Type       | When to use                                              |
| ---------- | -------------------------------------------------------- |
| `feat`     | New feature                                              |
| `fix`      | Bug fix                                                  |
| `docs`     | Documentation-only changes                               |
| `style`    | Formatting, whitespace — no logic change                 |
| `refactor` | Code change that neither fixes a bug nor adds a feature  |
| `perf`     | Performance improvement                                  |
| `test`     | Adding or updating tests                                 |
| `build`    | Build system or dependency changes (pnpm, webpack, etc.) |
| `ci`       | CI/CD configuration changes                              |
| `chore`    | Maintenance tasks (gitignore, tool versions, etc.)       |

**Scopes** (optional, project-specific): `ui`, `wallet`, `counter`, `move`,
`config`, `deps`

**Rules:**

- Subject line: imperative mood, lowercase after colon, max 72 chars, no
  trailing period
- Body (if needed): blank line after subject, wrap at 72 chars, explain
  **what/why** not how
- Footer: reference issues with `Closes #N` or `Fixes #N`; note breaking
  changes with `BREAKING CHANGE:`

**Examples:**

```
feat(counter): add reset button to counter component
```

```
fix(wallet): handle disconnection on network switch

The wallet provider was not cleaning up state when the user switched
networks, causing stale transaction errors.

Fixes #42
```

### Branches

Format: `<type>/<short-kebab-case-description>`

```
feat/add-counter-reset
fix/wallet-disconnect-error
docs/update-readme
refactor/extract-transaction-hook
```

- Use the same type prefixes as commits
- Keep descriptions short and descriptive (under 50 chars)
- Branch from and merge to `main` via PR

### Pull Requests

**Title:** follows commit convention, under 72 characters

**Body template:**

```markdown
## Summary
<!-- 1-3 sentences: what this PR does and why -->

## Changes
<!-- Bulleted list of specific modifications -->

## Test Plan
<!-- How to verify: manual steps, automated tests, screenshots for UI -->

## Related Issues
<!-- Closes #N, Fixes #N -->
```

**Guidelines:**

- Keep PRs small and focused on a single concern (aim for < 400 lines of diff)
- Separate refactoring from feature work into distinct PRs
- Link related issues in the description
- Include screenshots for UI changes

## Development Notes

- Default network is **testnet**
- Wallet auto-connect is enabled in providers
- Sui SDK v2 uses `@mysten/sui/jsonRpc` for `SuiJsonRpcClient` and
  `getJsonRpcFullnodeUrl` (moved from `@mysten/sui/client` in v1)
- Network config requires a `network` property alongside `url` (Sui SDK v2)
- Turbopack is the default bundler in Next.js 16
- No test framework is currently configured
- No CI/CD pipeline exists yet
- Dev container config available in `.devcontainer/` for GitHub Codespaces
