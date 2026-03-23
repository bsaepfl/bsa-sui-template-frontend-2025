"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WALRUS_TESTNET_AGGREGATOR } from "./constants";
import ClipLoader from "react-spinners/ClipLoader";

export function WalrusRead() {
  const [blobId, setBlobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    text: string | null;
    url: string;
    contentType: string;
    size: number;
  } | null>(null);

  const readBlob = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // GET from the Walrus aggregator HTTP API
      const url = `${WALRUS_TESTNET_AGGREGATOR}/v1/blobs/${blobId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Read failed: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") ?? "application/octet-stream";
      const blob = await response.blob();
      const size = blob.size;

      // Try to display as text if it looks like text
      let text: string | null = null;
      if (contentType.startsWith("text/") || contentType.includes("json") || size < 10_000) {
        try {
          text = await blob.text();
        } catch {
          // Not text, that's fine
        }
      }

      setResult({ text, url, contentType, size });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Read failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-gray-900">Read from Walrus</CardTitle>
        <CardDescription className="text-gray-600">
          Retrieve a blob from Walrus by its blob ID. The aggregator
          reconstructs the data from storage nodes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Blob ID input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={blobId}
            onChange={(e) => setBlobId(e.target.value)}
            placeholder="Enter blob ID..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <Button
            onClick={readBlob}
            disabled={loading || !blobId.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Read"}
          </Button>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Result */}
        {result && (
          <div className="space-y-3">
            {/* Metadata */}
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Type: {result.contentType}</span>
              <span>Size: {formatBytes(result.size)}</span>
            </div>

            {/* Content display */}
            {result.text !== null ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <pre className="whitespace-pre-wrap break-all text-sm text-gray-800 max-h-64 overflow-auto">
                  {result.text}
                </pre>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                <p className="text-sm text-gray-600 mb-2">Binary blob ({result.contentType})</p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Download from aggregator
                </a>
              </div>
            )}

            {/* Direct link */}
            <p className="text-xs text-gray-400">
              Direct URL:{" "}
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {result.url}
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
