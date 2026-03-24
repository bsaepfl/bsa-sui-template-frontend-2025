"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { useView } from "../contexts/ViewContext";

const components: { title: string; view: string; description: string }[] = [
  {
    title: "Create Counter",
    view: "createCounter",
    description: "Create a new counter instance on the blockchain.",
  },
  {
    title: "Find Counter",
    view: "search",
    description: "Search for existing counter objects by ID.",
  },
  {
    title: "Walrus Storage",
    view: "walrus",
    description: "Upload files, text, or JSON to Walrus decentralized storage.",
  },
  {
    title: "Seal Whitelist",
    view: "seal",
    description: "Identity-Based Encryption with whitelist access control.",
  },
];

export default function Navbar() {
  const { setView } = useView();

  return (
    <NavigationMenu className="max-w-full justify-between p-4 bg-white border-b border-gray-200">
      <NavigationMenuList className="flex w-full justify-between items-center">
        <div className="flex items-center space-x-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link 
                href="/" 
                className="flex items-center space-x-2 font-semibold text-lg text-gray-900"
                onClick={() => setView('home')}
              >
                Hackathon Starter
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-900">Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white">
                <li className="row-span-4">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-slate-50 to-slate-100 p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                      onClick={() => setView('home')}
                    >
                      <div className="mb-2 mt-4 text-lg font-medium text-gray-900">
                        Hackathon Starter
                      </div>
                      <p className="text-sm leading-tight text-slate-600">
                        A stable base template for Sui hackathons with essential components and integrations.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    onClick={() => setView(component.view as any)}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link 
                href="/" 
                className="text-gray-900"
                onClick={() => setView('home')}
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <button
                onClick={() => setView('resources')}
                className="text-gray-900"
              >
                Resources
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a
                href="https://sdk.mystenlabs.com/dapp-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                📘 dApp Kit
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <ConnectButton />
        </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & { title: string; children: React.ReactNode }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <button
          ref={ref}
          className={`block w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-600">
            {children}
          </p>
        </button>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";