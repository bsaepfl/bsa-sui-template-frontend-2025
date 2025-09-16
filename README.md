# Sui dApp Starter Template

This dApp was created using `@mysten/create-dapp` that sets up a basic React
Client dApp using the following tools:

- [React](https://react.dev/) (v19.1.1) as the UI framework
- [Next.js](https://nextjs.org/) (v15.5.3) for the React framework with SSR support
- [TypeScript](https://www.typescriptlang.org/) (v5.9.2) for type checking
- [Tailwind CSS](https://tailwindcss.com/) (v4.1.13) for styling
- [ShadCN UI](https://ui.shadcn.com/) for pre-built accessible UI components
- [ESLint](https://eslint.org/) (v9.17.0) for linting
- [`@mysten/dapp-kit`](https://sdk.mystenlabs.com/dapp-kit) (v0.18.0) for connecting to wallets and loading data
- [`@mysten/sui`](https://www.npmjs.com/package/@mysten/sui) (v1.38.0) for Sui blockchain interactions
- [React Query](https://tanstack.com/query) (v5.87.1) for data fetching and caching
- [pnpm](https://pnpm.io/) for package management

## Key Dependencies

### Core Framework
- **React**: v19.1.1 - The main UI library
- **Next.js**: v15.5.3 - React framework with SSR, routing, and build optimization
- **TypeScript**: v5.9.2 - Type safety and better development experience

### Sui Integration
- **@mysten/dapp-kit**: v0.18.0 - Wallet connection and dApp utilities
- **@mysten/sui**: v1.38.0 - Sui SDK for blockchain interactions
- **@tanstack/react-query**: v5.87.1 - Data fetching and state management

### UI Components
- **@shadcn**:Accessible navigation components
- **Tailwind CSS**: v4.1.13 - Utility-first CSS framework
- **tailwindcss-animate**: v1.0.7 - Animation utilities
- **lucide-react**: v0.544.0 - Icon library
- **react-spinners**: v0.14.1 - Loading spinners

### Utilities
- **class-variance-authority**: v0.7.1 - Component variant management
- **clsx**: v2.1.1 - Conditional className utility
- **tailwind-merge**: v3.3.1 - Tailwind class merging utility

For a full guide on how to build this dApp from scratch, visit this
[guide](http://docs.sui.io/guides/developer/app-examples/e2e-counter#frontend).

## Deploying your Move code

### Install Sui cli

Before deploying your move code, ensure that you have installed the Sui CLI. You
can follow the [Sui installation instruction](https://docs.sui.io/build/install)
to get everything set up.

This template uses `testnet` by default, so we'll need to set up a testnet
environment in the CLI:

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

If you haven't set up an address in the sui client yet, you can use the
following command to get a new address:

```bash
sui client new-address secp256k1
```

This well generate a new address and recover phrase for you. You can mark a
newly created address as you active address by running the following command
with your new address:

```bash
sui client switch --address 0xYOUR_ADDRESS...
```

We can ensure we have some Sui in our new wallet by requesting Sui from the
faucet `https://faucet.sui.io`.

### Publishing the move package

The move code for this template is located in the `move` directory. To publish
it, you can enter the `move` directory, and publish it with the Sui CLI:

```bash
cd move
sui client publish --gas-budget 100000000 counter
```

In the output there will be an object with a `"packageId"` property. You'll want
to save that package ID to the `src/constants.ts` file as `PACKAGE_ID`:

```ts
export const TESTNET_COUNTER_PACKAGE_ID = "<YOUR_PACKAGE_ID>";
```

Now that we have published the move code, and update the package ID, we can
start the app.

## Starting your dApp

To install dependencies you can run

```bash
pnpm install
```

To start your dApp in development mode run

```bash
pnpm dev
```

## Building

To build your app for deployment you can run

```bash
pnpm build
```

## Move Smart Contract Integration Guide

This template demonstrates how to integrate Move smart contracts with your React frontend. The examples below show how to create and interact with a counter smart contract.

### Prerequisites

Before integrating Move smart contracts, ensure you have:

1. **Sui CLI installed** - Follow the [Sui installation guide](https://docs.sui.io/build/install)
2. **Published Move package** - Your smart contract deployed on the Sui network
3. **Package ID** - The unique identifier of your deployed Move package

### Core Integration Components

#### 1. Network Configuration (`networkConfig.ts`)

Set up your network configuration to handle different environments:

```typescript
export const TESTNET_COUNTER_PACKAGE_ID = "YOUR_PACKAGE_ID_HERE";
```

#### 2. Essential Hooks and Imports

For Move smart contract integration, you'll typically need these imports:

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
```

### Smart Contract Integration Patterns

#### Pattern 1: Creating Objects (CreateCounter Example)

**File: `app/CreateCounter.tsx`**

This pattern shows how to call a Move function that creates a new object:

```typescript
export function CreateCounter({ onCreated }: { onCreated: (id: string) => void }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isSuccess, isPending } = useSignAndExecuteTransaction();

  function create() {
    // 1. Create a new transaction
    const tx = new Transaction();

    // 2. Add a moveCall to the transaction
    tx.moveCall({
      arguments: [], // No arguments needed for counter::create
      target: `${counterPackageId}::counter::create`, // module::function format
    });

    // 3. Sign and execute the transaction
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          // 4. Wait for transaction completion and get effects
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: { showEffects: true },
          });

          // 5. Extract the created object ID
          const createdObjectId = effects?.created?.[0]?.reference?.objectId;
          if (createdObjectId) {
            onCreated(createdObjectId);
          }
        },
      },
    );
  }

  return (
    <Button 
      onClick={create} 
      disabled={isSuccess || isPending}
    >
      {isPending ? "Creating..." : "Create Counter"}
    </Button>
  );
}
```

**Key Points:**
- Use `Transaction()` to build your transaction
- `tx.moveCall()` specifies the Move function to call
- `target` format: `${packageId}::${module}::${function}`
- Handle success callback to get created object IDs
- Use loading states (`isPending`, `isSuccess`) for UX

#### Pattern 2: Interacting with Existing Objects (Counter Example)

**File: `app/Counter.tsx`**

This pattern shows how to call Move functions on existing objects:

```typescript
export function Counter({ id }: { id: string }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  // Query object data
  const { data, refetch } = useSuiClientQuery("getObject", {
    id,
    options: { showContent: true, showOwner: true },
  });

  const [waitingForTxn, setWaitingForTxn] = useState("");

  const executeMoveCall = (method: "increment" | "reset") => {
    setWaitingForTxn(method);
    const tx = new Transaction();

    if (method === "reset") {
      // Move call with multiple arguments
      tx.moveCall({
        arguments: [
          tx.object(id),        // Object reference
          tx.pure.u64(0)        // Pure value (u64 type)
        ],
        target: `${counterPackageId}::counter::set_value`,
      });
    } else {
      // Move call with single object argument
      tx.moveCall({
        arguments: [tx.object(id)],
        target: `${counterPackageId}::counter::increment`,
      });
    }

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (tx) => {
          // Wait for transaction and refresh data
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await refetch(); // Refresh object data
            setWaitingForTxn("");
          });
        },
      },
    );
  };

  return (
    <div>
      <p>Count: {getCounterFields(data.data)?.value}</p>
      <Button onClick={() => executeMoveCall("increment")}>
        {waitingForTxn === "increment" ? "Processing..." : "Increment"}
      </Button>
      <Button onClick={() => executeMoveCall("reset")}>
        {waitingForTxn === "reset" ? "Processing..." : "Reset"}
      </Button>
    </div>
  );
}
```

**Key Points:**
- Use `useSuiClientQuery` to fetch object data
- `tx.object(id)` for object references
- `tx.pure.u64(value)` for pure values with specific types
- Always `refetch()` after successful transactions to update UI
- Track transaction states for better UX

### Common Move Call Patterns

#### 1. Object References
```typescript
tx.moveCall({
  arguments: [tx.object(objectId)],
  target: `${packageId}::module::function`,
});
```

#### 2. Pure Values
```typescript
tx.moveCall({
  arguments: [
    tx.pure.u64(123),           // 64-bit unsigned integer
    tx.pure.string("hello"),    // String
    tx.pure.bool(true),         // Boolean
    tx.pure.address(address),   // Sui address
  ],
  target: `${packageId}::module::function`,
});
```

#### 3. Mixed Arguments
```typescript
tx.moveCall({
  arguments: [
    tx.object(objectId),        // Object reference
    tx.pure.u64(amount),        // Pure value
    tx.pure.address(recipient), // Another pure value
  ],
  target: `${packageId}::module::transfer`,
});
```

### Error Handling Best Practices

```typescript
signAndExecute(
  { transaction: tx },
  {
    onSuccess: (result) => {
      console.log("Transaction successful:", result.digest);
      // Handle success
    },
    onError: (error) => {
      console.error("Transaction failed:", error);
      // Handle error - show user feedback
      setWaitingForTxn("");
    },
  },
);
```

### Data Fetching and State Management

#### Fetching Object Data
```typescript
const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
  id: objectId,
  options: {
    showContent: true,  // Include object content
    showOwner: true,    // Include owner information
    showType: true,     // Include type information
  },
});
```

#### Parsing Object Data
```typescript
function getCounterFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }
  return data.content.fields as { value: number; owner: string };
}
```

### Testing Your Integration

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

2. **Connect your wallet** using the Connect Wallet button

3. **Test contract interactions:**
   - Create new objects
   - Call functions on existing objects
   - Verify state changes in the UI

### Troubleshooting

- **"Package not found"**: Verify your package ID is correct
- **"Function not found"**: Check the module and function names
- **"Insufficient gas"**: Ensure your wallet has enough SUI for gas fees
- **"Object not found"**: Verify object IDs and ownership

This integration pattern can be extended to work with any Move smart contract by adjusting the function calls, arguments, and data parsing logic.
