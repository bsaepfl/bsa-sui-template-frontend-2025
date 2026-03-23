"use client";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";

/**
 * WAL token coin type on testnet.
 * Derived from the Walrus system object package_id.
 */
const TESTNET_WAL_COIN_TYPE =
  "0xa998b8719ca1c0a6dc4e24a859bbb39f5477417f71885fbf2967a6510f699144::wal::WAL";

const MAINNET_WAL_COIN_TYPE = "0x0000000000000000000000000000000000000000000000000000000000000000::wal::WAL"; // TODO: replace with actual mainnet

const WAL_DECIMALS = 9;

interface WalBalanceResult {
  /** Raw balance in smallest unit */
  readonly rawBalance: bigint;
  /** Formatted balance with decimals */
  readonly formattedBalance: string;
  /** Whether the query is loading */
  readonly isLoading: boolean;
  /** Error if any */
  readonly error: Error | null;
  /** Whether the user has enough WAL for a given cost */
  readonly hasEnoughFor: (cost: bigint) => boolean;
  /** Refetch balance */
  readonly refetch: () => void;
}

/**
 * Hook to get the current user's WAL token balance.
 * Returns formatted balance and helper to check if enough for a storage cost.
 */
export function useWalBalance(
  network: "testnet" | "mainnet" = "testnet",
): WalBalanceResult {
  const currentAccount = useCurrentAccount();
  const coinType =
    network === "testnet" ? TESTNET_WAL_COIN_TYPE : MAINNET_WAL_COIN_TYPE;

  const { data, isLoading, error, refetch } = useSuiClientQuery(
    "getBalance",
    {
      owner: currentAccount?.address ?? "",
      coinType,
    },
    {
      enabled: !!currentAccount?.address,
    },
  );

  const rawBalance = BigInt(data?.totalBalance ?? "0");
  const formattedBalance = formatWalBalance(rawBalance);

  return {
    rawBalance,
    formattedBalance,
    isLoading,
    error: error as Error | null,
    hasEnoughFor: (cost: bigint) => rawBalance >= cost,
    refetch,
  };
}

function formatWalBalance(raw: bigint): string {
  const whole = raw / BigInt(10 ** WAL_DECIMALS);
  const fractional = raw % BigInt(10 ** WAL_DECIMALS);
  const fractionalStr = fractional.toString().padStart(WAL_DECIMALS, "0");
  // Show max 4 decimal places
  const trimmed = fractionalStr.slice(0, 4).replace(/0+$/, "") || "0";
  return `${whole}.${trimmed}`;
}

export { TESTNET_WAL_COIN_TYPE, MAINNET_WAL_COIN_TYPE, WAL_DECIMALS };
