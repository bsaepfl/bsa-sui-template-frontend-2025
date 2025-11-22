"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { ShieldCheck } from "lucide-react";
import { NavigationMenu, NavigationMenuList } from "./ui/navigation-menu";

export default function Navbar() {

  const account = useCurrentAccount();

  return (
    <NavigationMenu className="w-full bg-white border-b border-gray-100 px-8 py-4">
      <NavigationMenuList className="flex w-full justify-between items-center">
        <div className="flex gap-7 items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="font-bold text-lg text-blue-600">
              Instant<span className="text-gray-700 font-semibold">Reserve</span>
            </span>
          </Link>
          <Link href="/properties" className="ml-4 text-gray-700 hover:text-blue-600 font-medium">
            Properties
          </Link>
          <Link href="/how-it-works" className="ml-4 text-gray-700 hover:text-blue-600 font-medium">
            How it Works
          </Link>
          {account && (
            <Link href="/dashboard" className="text-blue-600 font-semibold text-base px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition">
              My Dashboard
            </Link>
          )}

        </div>
        <div className="flex gap-6 items-center">
          <span className="ml-2 flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Mainnet Active
          </span>
          <span className="ml-2 flex items-center gap-1 px-3 py-1 rounded-xl bg-gray-50 text-gray-700 text-xs font-medium border border-gray-200">
            <ShieldCheck size={16} className="text-gray-700" />
            zkLogin Ready
          </span>
          <Link href="/login" className="text-gray-800 font-semibold text-base">
            Promotor Login
          </Link>
          <ConnectButton className="bg-white border border-gray-200 text-gray-900 font-semibold py-2 px-6 rounded-xl shadow hover:bg-gray-50 transition min-w-[170px]" />
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
