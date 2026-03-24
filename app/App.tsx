"use client";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { CounterList } from "./components/CounterList";
import { WalrusUpload } from "./WalrusUpload";
import { SealWhitelist } from "./SealWhitelist";
import { Resources } from "./Resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useView } from "./contexts/ViewContext";

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState<string | null>(null);
  const { view, setView } = useView();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (isValidSuiObjectId(hash)) {
      setCounter(hash);
      setView("counter");
    }
  }, [setView]);

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
    setView("home");
    window.location.hash = "";
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="min-h-[500px]">
        <CardContent className="pt-6">
          {currentAccount ? (
            counterId ? (
              <div className="space-y-4">
                {/* Back button when viewing a counter */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={goBackToSelection}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ← Back to Counter Selection
                  </Button>
                  <div className="text-sm text-gray-500">
                    Counter ID: {counterId.slice(0, 8)}...{counterId.slice(-8)}
                  </div>
                </div>

                {/* Counter component */}
                <Counter id={counterId} />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Content based on view */}
                {view === "resources" && <Resources />}

                {view === "home" && (
                  <div className="space-y-6">
                    {/* Feature Navigation Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Counter Section */}
                      <Card className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Counter
                        </h3>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => setView("createCounter")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            Create Counter
                          </Button>
                          <Button
                            onClick={() => setView("search")}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                            size="sm"
                          >
                            Find Counter
                          </Button>
                        </div>
                      </Card>

                      {/* Walrus Section */}
                      <Card className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Walrus Storage
                        </h3>
                        <Button
                          onClick={() => setView("walrus")}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          size="sm"
                        >
                          Upload Files
                        </Button>
                      </Card>

                      {/* Seal Section */}
                      <Card className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Seal Encryption
                        </h3>
                        <Button
                          onClick={() => setView("seal")}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                          size="sm"
                        >
                          Seal Whitelist
                        </Button>
                      </Card>
                    </div>
                  </div>
                )}

                {view === "createCounter" && (
                  <CreateCounter onCreated={handleCounterCreated} />
                )}

                {view === "search" && (
                  <CounterList onSelectCounter={handleCounterSelected} />
                )}

                {view === "walrus" && <WalrusUpload />}

                {view === "seal" && <SealWhitelist />}
              </div>
            )
          ) : (
            <div className="space-y-6">
              {view === "resources" ? (
                <Resources />
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to Hackathon Starter
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Please connect your wallet to get started
                  </p>
                  <p className="text-sm text-gray-500">
                    All documentation and resources are available in the{" "}
                    <strong>Resources</strong> tab in the navigation bar.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
