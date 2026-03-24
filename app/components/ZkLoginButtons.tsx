"use client";

import { useConnectWallet, useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import { isEnokiWallet, type EnokiWallet, type AuthProvider } from "@mysten/enoki";
import { Button } from "@/components/ui/button";

const PROVIDER_CONFIG: Record<string, { label: string; bgClass: string }> = {
  google: {
    label: "Google",
    bgClass: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  },
  facebook: {
    label: "Facebook",
    bgClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  twitch: {
    label: "Twitch",
    bgClass: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  apple: {
    label: "Apple",
    bgClass: "bg-black hover:bg-gray-900 text-white",
  },
};

/**
 * OAuth sign-in buttons for zkLogin via Enoki.
 * Only shows buttons for providers that have registered wallets
 * (i.e., those with configured client IDs in providers.tsx).
 */
export function ZkLoginButtons() {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const enokiWallets = useWallets().filter(isEnokiWallet);

  const walletsByProvider = enokiWallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>(),
  );

  if (currentAccount || walletsByProvider.size === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">or</span>
      {Array.from(walletsByProvider.entries()).map(([provider, wallet]) => {
        const config = PROVIDER_CONFIG[provider];
        if (!config) return null;
        return (
          <Button
            key={provider}
            onClick={() => connect({ wallet })}
            className={`text-xs px-3 py-1 ${config.bgClass}`}
            size="sm"
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}
