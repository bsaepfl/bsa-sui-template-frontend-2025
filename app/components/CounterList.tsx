'use client'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CounterData {
  objectId: string;
  value: number;
  owner: string;
}

function getCounterFields(data: any): { value: number; owner: string } | null {
  if (data?.content?.dataType !== "moveObject") {
    return null;
  }
  return data.content.fields as { value: number; owner: string };
}

export function CounterList({ onSelectCounter }: { onSelectCounter: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CounterData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCounters = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Search by object ID if it's a valid Sui object ID
      if (searchQuery.startsWith("0x") && searchQuery.length === 66) {
        // Create Sui client and query directly
        const client = new SuiClient({ url: getFullnodeUrl("testnet") });
        
        const object = await client.getObject({
          id: searchQuery,
          options: {
            showContent: true,
            showOwner: true,
            showType: true,
          },
        });

        if (object.data && object.data.content?.dataType === "moveObject") {
          const fields = getCounterFields(object.data);
          if (fields) {
            setSearchResults([{
              objectId: searchQuery,
              value: fields.value,
              owner: fields.owner,
            }]);
          } else {
            setError("Object found but is not a counter");
          }
        } else {
          setError("Object not found or invalid");
        }
      } else {
        setError("Please enter a valid Sui object ID (starts with 0x and is 66 characters long)");
      }
    } catch (err) {
      setError("Error searching for counters");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Existing Counters</h2>
        <p className="text-gray-600 mb-6">
          Search for existing counter objects by their Object ID
        </p>
      </div>

      {/* Search by Object ID */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Search by Object ID</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter counter object ID (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <Button 
              onClick={searchCounters}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((counter) => (
                <div key={counter.objectId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-900">Counter Value: {counter.value}</p>
                    <p className="text-sm text-gray-600">Owner: {counter.owner.slice(0, 8)}...{counter.owner.slice(-8)}</p>
                    <p className="text-xs text-gray-500">ID: {counter.objectId.slice(0, 8)}...{counter.objectId.slice(-8)}</p>
                  </div>
                  <Button 
                    onClick={() => onSelectCounter(counter.objectId)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Select Counter
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <h3 className="font-semibold mb-2 text-gray-900">How to find counter object IDs:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Create a counter first to get its object ID</li>
              <li>Copy the object ID from the URL hash after creating a counter</li>
              <li>Or check the Sui Explorer for your package transactions</li>
              <li>Look for objects of type: <code className="bg-gray-100 px-1 rounded text-gray-800">Counter</code></li>
              <li>Object IDs are 66 characters long and start with "0x"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
