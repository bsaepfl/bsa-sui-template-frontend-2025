# Sui dApp Starter Template

This dApp was created using `@mysten/create-dapp` that sets up a basic React
Client dApp using the following tools:

## 🚀 Getting Started from Scratch

This guide will help you set up and run this Sui dApp template from scratch, even if you're completely new to development.

### Prerequisites

Before you begin, you'll need to install the following software on your computer:

#### 1. Node.js (Required)
Node.js is a JavaScript runtime that allows you to run JavaScript applications on your computer.

- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Recommended Version**: LTS (Long Term Support) - currently v20.x or v22.x
- **Installation**: Download the installer for your operating system and follow the setup wizard

**Verify Installation:**
```bash
node --version
npm --version
```

#### 2. pnpm (Package Manager)
pnpm is a fast, disk space efficient package manager that we use for this project.

**Install pnpm globally:**
```bash
npm install -g pnpm
```

**Alternative installation methods:**
- **Windows**: Download from [https://pnpm.io/installation](https://pnpm.io/installation)
- **macOS**: `brew install pnpm` (if you have Homebrew)
- **Linux**: `curl -fsSL https://get.pnpm.io/install.sh | sh -`

**Verify Installation:**
```bash
pnpm --version
```

#### 3. Git (Version Control)
Git is used to clone and manage the project code.

- **Download**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Installation**: Follow the installation guide for your operating system

**Verify Installation:**
```bash
git --version
```

#### 4. Code Editor (Recommended)
While not strictly required, a good code editor will make development much easier:

- **Visual Studio Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/) (Recommended)
- **WebStorm**: [https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/)
- **Sublime Text**: [https://www.sublimetext.com/](https://www.sublimetext.com/)

### Installation Steps

#### Step 1: Clone or Download the Project

**Option A: Clone with Git (Recommended)**
```bash
git clone <repository-url>
cd bsa-2025-frontend-template
```

**Option B: Download ZIP**
1. Download the project as a ZIP file
2. Extract it to your desired location
3. Open terminal/command prompt in the project folder

#### Step 2: Install Dependencies
Navigate to the project directory and install all required packages:

```bash
pnpm install
```

This command will:
- Download all necessary packages listed in `package.json`
- Create a `node_modules` folder with all dependencies
- Generate a `pnpm-lock.yaml` file to lock dependency versions

#### Step 3: Set Up Environment (Optional)
If you plan to deploy your own smart contracts, you'll need:

1. **Sui CLI**: Follow the [Sui installation guide](https://docs.sui.io/build/install)
2. **Wallet**: Install a Sui wallet like [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)

### Running the Project

#### Development Mode
Start the development server with hot reload:

```bash
pnpm dev
```

This will:
- Start the Next.js development server
- Open your browser to `http://localhost:3000`
- Automatically reload when you make changes to the code

#### Production Build
To build the project for production:

```bash
pnpm build
```

#### Start Production Server
After building, start the production server:

```bash
pnpm start
```

### Troubleshooting Common Issues

#### "Command not found" errors
- Make sure Node.js and pnpm are properly installed
- Restart your terminal after installation
- Check your PATH environment variable

#### Port already in use
If port 3000 is busy, the development server will automatically use the next available port (3001, 3002, etc.)

#### Permission errors on macOS/Linux
You might need to use `sudo` for global installations:
```bash
sudo npm install -g pnpm
```

#### Windows PowerShell execution policy
If you get execution policy errors on Windows:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Next Steps

Once you have the project running:

1. **Explore the Code**: Look at the files in the `app/` directory
2. **Connect a Wallet**: Use the "Connect Wallet" button to connect your Sui wallet
3. **Try the Counter**: Create and interact with counter objects
4. **Read the Documentation**: Continue reading this README for advanced features

---

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

## 🔗 Understanding Smart Contract Integration

### What are Smart Contracts and How Do They Work?

Before diving into deployment, let's understand what's happening behind the scenes:

#### **Smart Contracts Explained (For Beginners)**

Think of a smart contract as a **program that lives on the blockchain**. Unlike traditional applications that run on servers, smart contracts:

1. **Live on the Blockchain**: Once deployed, the code is stored permanently on the Sui blockchain
2. **Are Immutable**: The code cannot be changed after deployment (ensuring trust and security)
3. **Execute Automatically**: They run exactly as programmed, without human intervention
4. **Are Transparent**: Anyone can verify what the code does

#### **The Frontend ↔ Smart Contract Connection**

Here's how your React frontend communicates with smart contracts:

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────────┐
│   Your React    │    │     Sui      │    │   Smart Contract    │
│   Frontend      │◄──►│   Network    │◄──►│   (on Blockchain)   │
│  (This Project) │    │              │    │                     │
└─────────────────┘    └──────────────┘    └─────────────────────┘
```

**Step-by-Step Process:**

1. **User clicks a button** in your React app (e.g., "Create Counter")
2. **Frontend creates a transaction** using the Sui SDK
3. **Transaction is sent** to the Sui network via your wallet
4. **Smart contract executes** the requested function on the blockchain
5. **Result is returned** to your frontend and displayed to the user

#### **Why Deploy to Testnet First?**

- **Testnet** = Practice blockchain (free, safe for testing)
- **Mainnet** = Real blockchain (costs real money, permanent)

Always test on testnet before going to mainnet!

---

## 📦 Deploying Your Smart Contracts

### Step 1: Install Sui CLI

The Sui CLI is a command-line tool that lets you interact with the Sui blockchain. Think of it as your "control panel" for deploying and managing smart contracts.

**Download and Install:**
- **Official Guide**: [https://docs.sui.io/build/install](https://docs.sui.io/build/install)
- **Quick Install (Linux/macOS)**: 
  ```bash
  curl -fLJO https://github.com/MystenLabs/sui/releases/latest/download/sui-mainnet-v1.38.0-ubuntu-x86_64.tgz
  tar -xf sui-mainnet-v1.38.0-ubuntu-x86_64.tgz
  sudo mv sui /usr/local/bin
  ```

**Verify Installation:**
```bash
sui --version
```

### Step 2: Set Up Testnet Environment

The testnet is a "practice" version of the Sui blockchain where you can test your smart contracts without spending real money.

**Configure Testnet:**
```bash
# Add testnet environment
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# Switch to testnet
sui client switch --env testnet
```

**Create a New Wallet Address:**
```bash
# Generate a new address
sui client new-address secp256k1
```

This will output something like:
```
Created new keypair and saved it to keystore.
- Address: 0x1234567890abcdef...
- Alias: <none>
```

**Set Your Active Address:**
```bash
# Replace with your actual address from above
sui client switch --address 0x1234567890abcdef...
```

### Step 3: Get Test SUI Tokens

To deploy smart contracts, you need SUI tokens to pay for "gas" (transaction fees). On testnet, these are free!

**Get Free Testnet SUI:**
1. Visit: [https://faucet.sui.io](https://faucet.sui.io)
2. Enter your wallet address (from Step 2)
3. Click "Request SUI"
4. Wait a few seconds for the tokens to arrive

**Check Your Balance:**
```bash
sui client balance
```

### Step 4: Deploy Your Smart Contract

Now comes the exciting part - putting your smart contract on the blockchain!

**Navigate to the Move Code:**
```bash
cd move
```

**Deploy the Counter Smart Contract:**
```bash
sui client publish --gas-budget 100000000 counter
```

**What This Command Does:**
- `publish`: Tells Sui to deploy your smart contract
- `--gas-budget 100000000`: Sets the maximum gas you're willing to pay
- `counter`: The name of your Move package (folder)

**Understanding the Output:**

After deployment, you'll see a lot of output. Look for something like this:

```json
{
  "packageId": "0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5",
  "version": "1",
  "digest": "...",
  "modules": ["counter"],
  ...
}
```

**🎯 IMPORTANT**: Copy the `packageId` value - you'll need it in the next step!

### Step 5: Configure Your Frontend

This is where the magic happens - connecting your React app to your deployed smart contract.

#### **Understanding the Constants File**

Open <mcfile name="constants.ts" path="/home/Loris/BSA/bsa-2025-frontend-template/app/constants.ts"></mcfile> in your code editor. You'll see:

```typescript
export const DEVNET_COUNTER_PACKAGE_ID = "0xTODO";
export const TESTNET_COUNTER_PACKAGE_ID = "0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5";
export const MAINNET_COUNTER_PACKAGE_ID = "0xTODO";
```

**What These Mean:**

- **DEVNET**: Local development network (for advanced users)
- **TESTNET**: Practice network (what you just deployed to)
- **MAINNET**: Real network (costs real money)

#### **Update Your Package ID**

Replace the `TESTNET_COUNTER_PACKAGE_ID` with your actual package ID from Step 4:

```typescript
export const TESTNET_COUNTER_PACKAGE_ID = "0xYOUR_ACTUAL_PACKAGE_ID_HERE";
```

**Example:**
```typescript
export const TESTNET_COUNTER_PACKAGE_ID = "0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5";
```

#### **How the Frontend Uses This ID**

Your React components use this package ID to know which smart contract to interact with:

```typescript
// In your React components
const counterPackageId = useNetworkVariable("counterPackageId");

// When calling smart contract functions
tx.moveCall({
  target: `${counterPackageId}::counter::create`, // This becomes: 0xYOUR_ID::counter::create
  arguments: [],
});
```

**The Connection Process:**

1. **User clicks "Create Counter"** in your React app
2. **Frontend reads the package ID** from constants.ts
3. **Creates a transaction** targeting your specific smart contract
4. **Sends transaction** to the Sui testnet
5. **Your deployed smart contract** executes the function
6. **Result is returned** and displayed in your app

### Step 6: Test Your Integration

Now let's make sure everything works!

**Start Your Development Server:**
```bash
# Make sure you're in the project root directory
cd ..  # if you're still in the move/ folder
pnpm dev
```

**Test the Connection:**

1. **Open your browser** to `http://localhost:3000`
2. **Connect your wallet** (install Sui Wallet browser extension if needed)
3. **Switch your wallet to testnet** (in wallet settings)
4. **Try creating a counter** - click the "Create Counter" button
5. **Interact with the counter** - increment, reset, etc.

**What's Happening Behind the Scenes:**

```
Your React App → Sui Wallet → Testnet → Your Smart Contract → Back to Your App
```

### Troubleshooting Common Issues

#### **"Package not found" Error**
- Double-check your package ID in constants.ts
- Make sure you're connected to testnet (not mainnet or devnet)

#### **"Insufficient gas" Error**
- Get more testnet SUI from the faucet
- Check your wallet balance: `sui client balance`

#### **"Object not found" Error**
- Make sure you've created a counter object first
- Check that you're using the correct object ID

#### **Wallet Connection Issues**
- Install the Sui Wallet browser extension
- Make sure your wallet is set to testnet
- Refresh the page and try reconnecting

### Understanding the Complete Flow

Here's what happens when you click "Create Counter":

1. **Frontend** (React) creates a transaction
2. **Wallet** signs the transaction with your private key
3. **Transaction** is sent to Sui testnet
4. **Validators** on the network verify and execute the transaction
5. **Smart contract** runs the `create` function
6. **New counter object** is created on the blockchain
7. **Object ID** is returned to your frontend
8. **UI updates** to show the new counter

This is the power of blockchain - your data is now stored permanently and securely on a decentralized network!

## Understanding the Constants.ts Configuration

The <mcfile name="constants.ts" path="/home/Loris/BSA/bsa-2025-frontend-template/app/constants.ts"></mcfile> file is the bridge between your frontend and your deployed smart contracts. Let's break down exactly how it works and why it's crucial.

### What Are Package IDs?

When you deploy a smart contract to the Sui blockchain, it gets assigned a unique **Package ID**. Think of this as the "address" where your smart contract lives on the blockchain. Just like how your house has a unique address, your smart contract has a unique Package ID.

**Example Package ID:**
```
0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5
```

This long hexadecimal string uniquely identifies your deployed smart contract among millions of others on the network.

### The Three Networks

Your constants.ts file defines Package IDs for three different Sui networks:

```typescript
export const DEVNET_COUNTER_PACKAGE_ID = "0xTODO";
export const TESTNET_COUNTER_PACKAGE_ID = "0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5";
export const MAINNET_COUNTER_PACKAGE_ID = "0xTODO";
```

**Why Three Different Networks?**

1. **DEVNET (Development Network)**
   - **Purpose**: Local development and testing
   - **Cost**: Free
   - **Speed**: Very fast
   - **Use Case**: When you're building and testing locally
   - **Data Persistence**: May be reset frequently

2. **TESTNET (Test Network)**
   - **Purpose**: Public testing environment
   - **Cost**: Free (test tokens from faucet)
   - **Speed**: Similar to mainnet
   - **Use Case**: Testing with real network conditions
   - **Data Persistence**: More stable than devnet

3. **MAINNET (Main Network)**
   - **Purpose**: Production environment
   - **Cost**: Real SUI tokens (costs real money)
   - **Speed**: Standard network speed
   - **Use Case**: Live applications with real users
   - **Data Persistence**: Permanent

### How Your Frontend Uses These IDs

Your React components don't directly use these constants. Instead, they use a smart helper function that automatically selects the right Package ID based on your current network:

```typescript
// In your React components
const counterPackageId = useNetworkVariable("counterPackageId");
```

**The Magic Behind useNetworkVariable:**

This function looks at:
1. **Which network your wallet is connected to** (devnet/testnet/mainnet)
2. **Automatically selects the corresponding Package ID** from constants.ts
3. **Returns the correct ID** for your current network

**Example Flow:**
```
Wallet connected to testnet → useNetworkVariable returns → TESTNET_COUNTER_PACKAGE_ID
Wallet connected to mainnet → useNetworkVariable returns → MAINNET_COUNTER_PACKAGE_ID
```

### Setting Up Your Package IDs

#### **For Development (Recommended Start Here):**

1. **Deploy to Testnet** (as shown in the deployment guide above)
2. **Copy your Package ID** from the deployment output
3. **Update constants.ts:**
   ```typescript
   export const TESTNET_COUNTER_PACKAGE_ID = "0xYOUR_ACTUAL_PACKAGE_ID";
   ```

#### **For Production (Advanced):**

1. **Deploy to Mainnet** (costs real SUI tokens)
2. **Update constants.ts:**
   ```typescript
   export const MAINNET_COUNTER_PACKAGE_ID = "0xYOUR_MAINNET_PACKAGE_ID";
   ```

### Common Mistakes and How to Avoid Them

#### **❌ Wrong Network**
```typescript
// Your wallet is on testnet, but you're using mainnet Package ID
export const TESTNET_COUNTER_PACKAGE_ID = "0xMAINNET_PACKAGE_ID"; // Wrong!
```
**Result**: "Package not found" errors

#### **❌ Typos in Package ID**
```typescript
// Missing a character or wrong character
export const TESTNET_COUNTER_PACKAGE_ID = "0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b"; // Missing last character!
```
**Result**: "Package not found" errors

#### **❌ Using "0xTODO"**
```typescript
// Forgetting to replace the placeholder
export const TESTNET_COUNTER_PACKAGE_ID = "0xTODO"; // Still a placeholder!
```
**Result**: "Package not found" errors

#### **✅ Correct Setup**
```typescript
// Properly deployed and configured
export const TESTNET_COUNTER_PACKAGE_ID = "0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5";
```

### How Transactions Work with Package IDs

When you interact with your smart contract, here's what happens:

1. **User Action**: User clicks "Create Counter" in your app
2. **Package ID Lookup**: `useNetworkVariable` gets the correct Package ID
3. **Transaction Creation**: Your code creates a transaction like:
   ```typescript
   tx.moveCall({
     target: `${counterPackageId}::counter::create`,
     arguments: [],
   });
   ```
4. **Target Resolution**: This becomes something like:
   ```
   0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5::counter::create
   ```
5. **Blockchain Execution**: The Sui network finds your smart contract and executes the `create` function

### Debugging Package ID Issues

If you're getting errors, check these in order:

1. **Verify your Package ID is correct:**
   ```bash
   # Check if your package exists on testnet
   sui client object 0xYOUR_PACKAGE_ID --json
   ```

2. **Confirm your wallet network:**
   - Open Sui Wallet extension
   - Check the network dropdown (should say "Testnet")

3. **Check your constants.ts file:**
   - Make sure there are no typos
   - Ensure you're not using "0xTODO"
   - Verify the Package ID matches your deployment output

4. **Clear browser cache:**
   - Sometimes old Package IDs get cached
   - Hard refresh (Ctrl+Shift+R) or clear browser cache

### Advanced: Multiple Smart Contracts

As your dApp grows, you might deploy multiple smart contracts. You can organize them like this:

```typescript
// Multiple contracts for different features
export const TESTNET_COUNTER_PACKAGE_ID = "0xabc123...";
export const TESTNET_MARKETPLACE_PACKAGE_ID = "0xdef456...";
export const TESTNET_NFT_PACKAGE_ID = "0xghi789...";

// Or organize by environment
export const TESTNET_PACKAGES = {
  counter: "0xabc123...",
  marketplace: "0xdef456...",
  nft: "0xghi789...",
};
```

This configuration system ensures your frontend always connects to the right smart contracts on the right network, making your dApp robust and reliable across different environments.

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
