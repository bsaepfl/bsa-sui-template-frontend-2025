"use client";

import { SuiClientProvider, WalletProvider, useSuiClientContext } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "./networkConfig";
import { useState, useEffect } from "react";
import { ViewProvider } from "./contexts/ViewContext";
import { registerEnokiWallets, isEnokiNetwork } from "@mysten/enoki";

const ENOKI_API_KEY = process.env.NEXT_PUBLIC_ENOKI_API_KEY ?? "";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/**
 * Registers Enoki wallets (zkLogin) so they appear in dApp Kit's wallet list.
 * Must be rendered INSIDE SuiClientProvider but BEFORE WalletProvider.
 */
function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    if (!ENOKI_API_KEY || !isEnokiNetwork(network)) return;

    const providers: Record<string, { clientId: string }> = {};
    if (GOOGLE_CLIENT_ID) {
      providers.google = { clientId: GOOGLE_CLIENT_ID };
    }
    // Add more providers here when client IDs are available:
    // providers.facebook = { clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID ?? "" };
    // providers.twitch = { clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID ?? "" };
    // providers.apple = { clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? "" };

    const { unregister } = registerEnokiWallets({
      apiKey: ENOKI_API_KEY,
      providers,
      client,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <RegisterEnokiWallets />
        <WalletProvider autoConnect>
          <ViewProvider>
            {children}
          </ViewProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
