'use client'
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { CounterList } from "./components/CounterList";
import { WalrusUpload } from "./WalrusUpload";
import { WalrusRead } from "./WalrusRead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type View = "create" | "search" | "counter" | "walrus-upload" | "walrus-read";

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState<string | null>(null);
  const [view, setView] = useState<View>("create");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (isValidSuiObjectId(hash)) {
      setCounter(hash);
      setView("counter");
    }
  }, []);

  const handleCounterCreated = (id: string) => {
    window.location.hash = id;
    setCounter(id);
    setView("counter");
  };

  const handleCounterSelected = (id: string) => {
    window.location.hash = id;
    setCounter(id);
    setView("counter");
  };

  const goBackToSelection = () => {
    setCounter(null);
    setView("create");
    window.location.hash = "";
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="min-h-[500px]">
        <CardContent className="pt-6">
          {currentAccount ? (
            counterId ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button
                    onClick={goBackToSelection}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    &larr; Back
                  </Button>
                  <div className="text-sm text-gray-500">
                    Counter: {counterId.slice(0, 8)}...{counterId.slice(-8)}
                  </div>
                </div>
                <Counter id={counterId} />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Navigation tabs */}
                <div className="flex justify-center flex-wrap gap-2">
                  {([
                    ["create", "Create Counter"],
                    ["search", "Find Counter"],
                    ["walrus-upload", "Walrus Upload"],
                    ["walrus-read", "Walrus Read"],
                  ] as const).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={view === key ? "default" : "outline"}
                      onClick={() => setView(key)}
                      className={
                        view === key
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Content based on active view */}
                {view === "create" && (
                  <CreateCounter onCreated={handleCounterCreated} />
                )}
                {view === "search" && (
                  <CounterList onSelectCounter={handleCounterSelected} />
                )}
                {view === "walrus-upload" && <WalrusUpload />}
                {view === "walrus-read" && <WalrusRead />}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Sui dApp Starter
              </h2>
              <p className="text-gray-600">
                Please connect your wallet to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
