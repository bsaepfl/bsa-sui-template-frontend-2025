'use client'
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { CounterList } from "./components/CounterList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState<string | null>(null);
  const [view, setView] = useState<'create' | 'search' | 'counter'>('create');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (isValidSuiObjectId(hash)) {
      setCounter(hash);
      setView('counter');
    }
  }, []);

  const handleCounterCreated = (id: string) => {
    window.location.hash = id;
    setCounter(id);
    setView('counter');
  };

  const handleCounterSelected = (id: string) => {
    window.location.hash = id;
    setCounter(id);
    setView('counter');
  };

  const goBackToSelection = () => {
    setCounter(null);
    setView('create');
    window.location.hash = '';
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
                {/* Navigation with proper styling */}
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={view === 'create' ? 'default' : 'outline'}
                    onClick={() => setView('create')}
                    className={view === 'create' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  >
                    Create New Counter
                  </Button>
                  <Button
                    variant={view === 'search' ? 'default' : 'outline'}
                    onClick={() => setView('search')}
                    className={view === 'search' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  >
                    Find Existing Counter
                  </Button>
                </div>

                {/* Content based on view */}
                {view === 'create' && (
                  <CreateCounter onCreated={handleCounterCreated} />
                )}
                
                {view === 'search' && (
                  <CounterList onSelectCounter={handleCounterSelected} />
                )}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Counter App</h2>
              <p className="text-gray-600">Please connect your wallet to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
