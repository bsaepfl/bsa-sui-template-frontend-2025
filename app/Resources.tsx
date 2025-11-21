"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Resources() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-black">
              📚 Documentation & Resources
            </CardTitle>
            <CardDescription className="text-black">
              Comprehensive documentation and resources for building on Sui
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Sui Framework */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">🚀 Sui Framework</CardTitle>
            <CardDescription className="text-black">
              Core Sui blockchain documentation and guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="https://docs.sui.io"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📚 Sui Documentation
              </a>
              <a
                href="https://docs.sui.io/guides/developer/sui-101"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🎓 Sui 101 - Getting Started Guide
              </a>
              <a
                href="https://github.com/MystenLabs/awesome-sui"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                ⭐ Awesome Sui GitHub
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Move Language */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">📖 Move Language</CardTitle>
            <CardDescription className="text-black">
              Learn the Move programming language for Sui smart contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="https://move-book.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📘 The Move Book
              </a>
              <a
                href="https://github.com/MystenLabs/sui-move-community-modules/tree/main"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🧩 Sui Move Community Modules
              </a>
            </div>
          </CardContent>
        </Card>

        {/* TypeScript SDK & dApp Kit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">⚡ TypeScript SDK & dApp Kit</CardTitle>
            <CardDescription className="text-black">
              Build frontend applications with TypeScript
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="https://sdk.mystenlabs.com/typescript"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📘 Sui TypeScript SDK
              </a>
              <a
                href="https://sdk.mystenlabs.com/dapp-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🎨 Sui dApp Kit - React Components & Hooks
              </a>
              <a
                href="https://www.typescriptlang.org/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📘 TypeScript Documentation
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Walrus Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">📦 Walrus Storage</CardTitle>
            <CardDescription className="text-black">
              Decentralized storage network built on Sui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="https://sdk.mystenlabs.com/walrus"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📘 Walrus SDK Documentation
              </a>
              <a
                href="https://github.com/MystenLabs/awesome-walrus?tab=readme-ov-file#sdks"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                ⭐ Awesome Walrus GitHub
              </a>
              <a
                href="https://docs.wal.app/usage/started.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🚀 Walrus Getting Started Guide
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Seal Encryption */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">🔐 Seal Encryption</CardTitle>
            <CardDescription className="text-black">
              Identity-Based Encryption (IBE) with access control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="https://github.com/MystenLabs/awesome-seal/?tab=readme-ov-file"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                ⭐ Awesome Seal GitHub
              </a>
              <a
                href="https://seal-docs.wal.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📘 Seal Documentation
              </a>
              <a
                href="https://sdk.mystenlabs.com/seal"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📦 Seal SDK Documentation
              </a>
              <a
                href="https://seal-docs.wal.app/Design/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                🎨 Seal Design Documentation
              </a>
              <a
                href="https://seal-docs.wal.app/UsingSeal/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                💻 Using Seal Guide
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

