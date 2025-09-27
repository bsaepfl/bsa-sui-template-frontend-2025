# Sui dApp Starter Template

This dApp was created using `@mysten/create-dapp` that sets up a basic React
Client dApp using the following tools:

## 🚀 Getting Started from Scratch

This guide will help you set up and run this Sui dApp template from scratch, even if you're completely new to development.

### GitHub Codespaces Setup

This project includes a `.devcontainer` configuration for GitHub Codespaces that automatically sets up the correct Node.js and pnpm versions.

**To use GitHub Codespaces:**

1. **Open in Codespace**: Click the green "Code" button on GitHub → "Codespaces" → "Create codespace on main"
2. **Wait for Setup**: The devcontainer will automatically:
   - Install Node.js 18.12+
   - Install pnpm latest version
   - Install all project dependencies
   - Set up VS Code extensions for optimal development
3. **Start Development**: Once setup is complete, run `pnpm dev` to start the development server

**Manual Setup (if not using Codespaces):**

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
```

#### 2. pnpm (Package Manager)
pnpm is a fast, disk space efficient package manager that we use for this project.

**Installation methods:**
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
You might need to use `sudo` for global installations. Refer to the pnpm installation guide above for alternative installation methods.

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

Open <mcfile name="constants.ts" path="app/constants.ts"></mcfile> in your code editor. You'll see:

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

## Creating Your Own Smart Contract

Ready to move beyond the counter example? Here's how to create your own custom smart contract and integrate it with your frontend.

### Step 1: Understanding the Move Code Structure

First, let's look at the current counter smart contract to understand the structure:

**File: `move/counter/sources/counter.move`**

```move
module counter::counter {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// A counter object
    public struct Counter has key {
        id: UID,
        value: u64,
    }

    /// Create a new counter
    public fun create(ctx: &mut TxContext) {
        let counter = Counter {
            id: object::new(ctx),
            value: 0,
        };
        transfer::share_object(counter);
    }

    /// Increment the counter
    public fun increment(counter: &mut Counter) {
        counter.value = counter.value + 1;
    }
}
```

**Key Components:**
- **Module Declaration**: `module counter::counter` defines the module name
- **Struct Definition**: `Counter` is the main data structure
- **Functions**: `create()` and `increment()` are the public functions you can call

### Step 2: Create Your Custom Smart Contract

Let's create a simple **Task Manager** smart contract as an example:

**File: `move/task_manager/sources/task_manager.move`**

```move
module task_manager::task_manager {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::vector;

    /// A task list object
    public struct TaskList has key {
        id: UID,
        tasks: vector<Task>,
        owner: address,
    }

    /// Individual task structure
    public struct Task has store, copy, drop {
        id: u64,
        title: String,
        completed: bool,
    }

    /// Create a new task list
    public fun create_task_list(ctx: &mut TxContext) {
        let task_list = TaskList {
            id: object::new(ctx),
            tasks: vector::empty<Task>(),
            owner: tx_context::sender(ctx),
        };
        transfer::transfer(task_list, tx_context::sender(ctx));
    }

    /// Add a new task
    public fun add_task(
        task_list: &mut TaskList, 
        title: String, 
        ctx: &mut TxContext
    ) {
        assert!(task_list.owner == tx_context::sender(ctx), 0);
        
        let task = Task {
            id: vector::length(&task_list.tasks),
            title,
            completed: false,
        };
        vector::push_back(&mut task_list.tasks, task);
    }

    /// Mark task as completed
    public fun complete_task(
        task_list: &mut TaskList, 
        task_id: u64, 
        ctx: &mut TxContext
    ) {
        assert!(task_list.owner == tx_context::sender(ctx), 0);
        
        let task = vector::borrow_mut(&mut task_list.tasks, task_id);
        task.completed = true;
    }

    /// Get task count
    public fun get_task_count(task_list: &TaskList): u64 {
        vector::length(&task_list.tasks)
    }
}
```

**What's Different:**
- **Multiple Functions**: `create_task_list()`, `add_task()`, `complete_task()`
- **Complex Data**: Uses vectors and custom structs
- **Access Control**: Only the owner can modify tasks
- **String Handling**: Tasks have titles

### Step 3: Update Your Move.toml Configuration

**File: `move/task_manager/Move.toml`**

```toml
[package]
name = "task_manager"
version = "1.0.0"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
task_manager = "0x0"
```

**Key Changes:**
- **Package Name**: Changed from "counter" to "task_manager"
- **Module Address**: Updated to match your module name

### Step 4: Deploy Your Custom Smart Contract

**Navigate to Your Move Directory:**
```bash
cd move/task_manager
```

**Deploy to Testnet:**
```bash
sui client publish --gas-budget 100000000 .
```

**Save Your Package ID:**
After deployment, copy the `packageId` from the output and update your constants:

```typescript
// In constants.ts
export const TESTNET_TASK_MANAGER_PACKAGE_ID = "0xYOUR_NEW_PACKAGE_ID";
```

### Step 5: Update Frontend Configuration

**File: `app/constants.ts`**

```typescript
// Keep the counter package ID
export const TESTNET_COUNTER_PACKAGE_ID = "0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5";

// Add your new package ID
export const TESTNET_TASK_MANAGER_PACKAGE_ID = "0xYOUR_NEW_PACKAGE_ID";
```

**File: `app/networkConfig.ts`**

```typescript
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { 
  TESTNET_COUNTER_PACKAGE_ID, 
  TESTNET_TASK_MANAGER_PACKAGE_ID 
} from "./constants";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        counterPackageId: TESTNET_COUNTER_PACKAGE_ID,
        taskManagerPackageId: TESTNET_TASK_MANAGER_PACKAGE_ID, // Add this line
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        counterPackageId: "0xTODO",
        taskManagerPackageId: "0xTODO", // Add this line
      },
    },
  });

export { networkConfig, useNetworkVariable, useNetworkVariables };
```

### Step 6: Create Frontend Components

**File: `app/TaskManager.tsx`**

```typescript
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export function TaskManager({ taskListId }: { taskListId?: string }) {
  const taskManagerPackageId = useNetworkVariable("taskManagerPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch task list data
  const { data: taskListData, refetch } = useSuiClientQuery(
    "getObject",
    {
      id: taskListId!,
      options: { showContent: true },
    },
    { enabled: !!taskListId }
  );

  // Create new task list
  const createTaskList = () => {
    setIsLoading(true);
    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${taskManagerPackageId}::task_manager::create_task_list`,
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest,
            options: { showEffects: true },
          });
          
          const createdObjectId = effects?.created?.[0]?.reference?.objectId;
          console.log("Task list created:", createdObjectId);
          setIsLoading(false);
        },
        onError: () => setIsLoading(false),
      }
    );
  };

  // Add new task
  const addTask = () => {
    if (!newTaskTitle.trim() || !taskListId) return;
    
    setIsLoading(true);
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(taskListId),
        tx.pure.string(newTaskTitle),
      ],
      target: `${taskManagerPackageId}::task_manager::add_task`,
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({ digest });
          await refetch();
          setNewTaskTitle("");
          setIsLoading(false);
        },
        onError: () => setIsLoading(false),
      }
    );
  };

  // Complete task
  const completeTask = (taskId: number) => {
    if (!taskListId) return;
    
    setIsLoading(true);
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(taskListId),
        tx.pure.u64(taskId),
      ],
      target: `${taskManagerPackageId}::task_manager::complete_task`,
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({ digest });
          await refetch();
          setIsLoading(false);
        },
        onError: () => setIsLoading(false),
      }
    );
  };

  // Parse task list data
  const getTaskListFields = (data: any) => {
    if (data?.content?.dataType !== "moveObject") return null;
    return data.content.fields as {
      tasks: Array<{ id: string; title: string; completed: boolean }>;
      owner: string;
    };
  };

  const taskListFields = taskListData ? getTaskListFields(taskListData) : null;

  if (!taskListId) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Task Manager</h2>
        <Button onClick={createTaskList} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Task List"}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      
      {/* Add new task */}
      <div className="flex gap-2 mb-4">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title..."
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask} disabled={isLoading || !newTaskTitle.trim()}>
          Add Task
        </Button>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {taskListFields?.tasks.map((task, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 border rounded ${
              task.completed ? "bg-green-50 text-green-800" : "bg-white"
            }`}
          >
            <span className={task.completed ? "line-through" : ""}>
              {task.title}
            </span>
            {!task.completed && (
              <Button
                size="sm"
                onClick={() => completeTask(parseInt(task.id))}
                disabled={isLoading}
              >
                Complete
              </Button>
            )}
          </div>
        ))}
      </div>

      {taskListFields?.tasks.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No tasks yet. Add your first task above!
        </p>
      )}
    </div>
  );
}
```

### General Steps for Any Custom Smart Contract

#### **1. Plan Your Smart Contract**
- **Define your data structures** (what objects will you store?)
- **List the functions** you need (create, update, delete, query)
- **Consider access control** (who can call which functions?)

#### **2. Write the Move Code**
```move
module your_module::your_contract {
    // Import necessary modules
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // Define your data structures
    public struct YourObject has key {
        id: UID,
        // your fields here
    }

    // Create functions
    public fun create_object(ctx: &mut TxContext) {
        // implementation
    }

    // Other functions
    public fun update_object(obj: &mut YourObject, /* params */) {
        // implementation
    }
}
```

#### **3. Deploy and Configure**
```bash
# Deploy
sui client publish --gas-budget 100000000 your_module

# Update constants.ts
export const TESTNET_YOUR_PACKAGE_ID = "0xYOUR_PACKAGE_ID";

# Update networkConfig.ts
variables: {
  yourPackageId: TESTNET_YOUR_PACKAGE_ID,
}
```

#### **4. Create Frontend Components**
```typescript
// Get package ID
const yourPackageId = useNetworkVariable("yourPackageId");

// Create transactions
const tx = new Transaction();
tx.moveCall({
  arguments: [/* your arguments */],
  target: `${yourPackageId}::your_contract::your_function`,
});

// Execute transactions
signAndExecute({ transaction: tx }, {
  onSuccess: async ({ digest }) => {
    // Handle success
  }
});
```

### Common Smart Contract Patterns

Here are some popular smart contract patterns you can implement:

#### **1. NFT Collection**
```move
module nft_collection::nft {
    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        creator: address,
    }

    public fun mint_nft(
        name: String,
        description: String, 
        image_url: String,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name,
            description,
            image_url,
            creator: tx_context::sender(ctx),
        };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }
}
```

#### **2. Voting System**
```move
module voting::poll {
    public struct Poll has key {
        id: UID,
        question: String,
        options: vector<String>,
        votes: vector<u64>,
        voters: vector<address>,
        creator: address,
        end_time: u64,
    }

    public fun create_poll(
        question: String,
        options: vector<String>,
        duration_ms: u64,
        ctx: &mut TxContext
    ) {
        let poll = Poll {
            id: object::new(ctx),
            question,
            options,
            votes: vector::empty<u64>(),
            voters: vector::empty<address>(),
            creator: tx_context::sender(ctx),
            end_time: tx_context::epoch_timestamp_ms(ctx) + duration_ms,
        };
        transfer::share_object(poll);
    }

    public fun vote(poll: &mut Poll, option_index: u64, ctx: &mut TxContext) {
        let voter = tx_context::sender(ctx);
        assert!(!vector::contains(&poll.voters, &voter), 0); // No double voting
        assert!(tx_context::epoch_timestamp_ms(ctx) < poll.end_time, 1); // Poll not ended
        
        vector::push_back(&mut poll.voters, voter);
        let current_votes = vector::borrow_mut(&mut poll.votes, option_index);
        *current_votes = *current_votes + 1;
    }
}
```

#### **3. Marketplace**
```move
module marketplace::shop {
    public struct Item has key, store {
        id: UID,
        name: String,
        price: u64,
        seller: address,
        for_sale: bool,
    }

    public fun list_item(
        name: String,
        price: u64,
        ctx: &mut TxContext
    ) {
        let item = Item {
            id: object::new(ctx),
            name,
            price,
            seller: tx_context::sender(ctx),
            for_sale: true,
        };
        transfer::share_object(item);
    }

    public fun buy_item(
        item: &mut Item,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(item.for_sale, 0);
        assert!(coin::value(&payment) >= item.price, 1);
        
        transfer::public_transfer(payment, item.seller);
        item.for_sale = false;
        
        // Transfer ownership logic here
    }
}
```

### Deployment Best Practices

#### **Testing Before Deployment**
```bash
# 1. Test your Move code locally
sui move test

# 2. Build without publishing to check for errors
sui move build

# 3. Deploy to devnet first for testing
sui client switch --env devnet
sui client publish --gas-budget 100000000 .

# 4. Test thoroughly on devnet
# 5. Deploy to testnet for public testing
sui client switch --env testnet
sui client publish --gas-budget 100000000 .

# 6. Finally deploy to mainnet when ready
sui client switch --env mainnet
sui client publish --gas-budget 100000000 .
```

#### **Gas Budget Guidelines**
- **Simple contracts**: 10,000,000 (10M)
- **Medium complexity**: 50,000,000 (50M)
- **Complex contracts**: 100,000,000 (100M)
- **Very large contracts**: 200,000,000 (200M)

#### **Version Management**
```toml
# In Move.toml, always increment version
[package]
name = "your_contract"
version = "1.1.0"  # Increment this for updates
edition = "2024.beta"
```

### Troubleshooting Deployment Issues

#### **Common Errors and Solutions**

**Error: "Insufficient gas"**
```bash
# Solution: Increase gas budget
sui client publish --gas-budget 200000000 .
```

**Error: "Module already exists"**
```bash
# Solution: You can't redeploy the same module. Create a new version or use upgrade
# For new version, change the module name:
module your_contract_v2::contract {
    // your code
}
```

**Error: "Invalid address"**
```toml
# Solution: Make sure addresses in Move.toml are correct
[addresses]
your_contract = "0x0"  # This should always be 0x0 for new deployments
```

**Error: "Compilation failed"**
```bash
# Solution: Check your Move syntax
sui move build  # This will show detailed error messages
```

#### **Debugging Tips**
1. **Use `sui move test`** to run unit tests before deployment
2. **Check dependencies** in Move.toml match your Sui version
3. **Verify imports** - make sure all `use` statements are correct
4. **Test functions individually** before deploying the full contract
5. **Use `assert!` statements** for input validation in your Move code

### Frontend Integration Patterns

#### **Pattern 1: Simple Function Calls**
```typescript
// For functions that don't return data
const callFunction = () => {
  const tx = new Transaction();
  tx.moveCall({
    arguments: [tx.pure.string("hello")],
    target: `${packageId}::module::function_name`,
  });
  
  signAndExecute({ transaction: tx });
};
```

#### **Pattern 2: Object Queries**
```typescript
// For reading object data
const { data } = useSuiClientQuery(
  "getObject",
  {
    id: objectId,
    options: { showContent: true },
  },
  { enabled: !!objectId }
);

// Parse the data
const objectFields = data?.content?.dataType === "moveObject" 
  ? data.content.fields 
  : null;
```

#### **Pattern 3: Event Listening**
```typescript
// For listening to contract events
const { data: events } = useSuiClientQuery(
  "queryEvents",
  {
    query: {
      MoveModule: {
        package: packageId,
        module: "your_module",
      },
    },
  }
);
```

#### **Pattern 4: Multi-Step Transactions**
```typescript
// For complex operations requiring multiple calls
const complexOperation = () => {
  const tx = new Transaction();
  
  // Step 1: Create object
  const [obj] = tx.moveCall({
    arguments: [],
    target: `${packageId}::module::create_object`,
  });
  
  // Step 2: Use the created object
  tx.moveCall({
    arguments: [obj, tx.pure.string("data")],
    target: `${packageId}::module::update_object`,
  });
  
  signAndExecute({ transaction: tx });
};
```

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
