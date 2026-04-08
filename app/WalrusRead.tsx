"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WALRUS_TESTNET_AGGREGATOR } from "./constants";
import { detectMimeType, isPreviewableImage, isTextContent, formatBytes } from "@/lib/mimeDetection";
import ClipLoader from "react-spinners/ClipLoader";

interface ReadResult {
  readonly text: string | null;
  readonly objectUrl: string | null;
  readonly aggregatorUrl: string;
  readonly mimeType: string;
  readonly size: number;
}

interface WalrusReadProps {
  /** Pre-filled blob ID from upload history */
  readonly initialBlobId?: string;
  /** Known MIME type from upload history (avoids magic byte guessing) */
  readonly knownMimeType?: string;
}

export function WalrusRead({ initialBlobId, knownMimeType }: WalrusReadProps) {
  const [blobId, setBlobId] = useState(initialBlobId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReadResult | null>(null);

  // Update blobId when initialBlobId prop changes
  useEffect(() => {
    if (initialBlobId) {
      setBlobId(initialBlobId);
    }
  }, [initialBlobId]);

  // Clean up object URLs on unmount or new result
  useEffect(() => {
    return () => {
      if (result?.objectUrl) {
        URL.revokeObjectURL(result.objectUrl);
      }
    };
  }, [result]);

  const readBlob = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Revoke previous object URL before creating a new one
    if (result?.objectUrl) {
      URL.revokeObjectURL(result.objectUrl);
    }
    setResult(null);

    try {
      const aggregatorUrl = `${WALRUS_TESTNET_AGGREGATOR}/v1/blobs/${blobId}`;
      const response = await fetch(aggregatorUrl);

      if (!response.ok) {
        throw new Error(`Read failed: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const size = data.length;

      // Use known MIME type from upload history, or detect from magic bytes
      const mimeType = knownMimeType ?? detectMimeType(data);

      // For text content, decode and display inline
      let text: string | null = null;
      if (isTextContent(mimeType)) {
        try {
          text = new TextDecoder("utf-8", { fatal: true }).decode(data);
        } catch {
          // Not valid UTF-8 despite detection, treat as binary
        }
      }

      // Create object URL for binary content (images, downloads)
      const objectUrl = URL.createObjectURL(new Blob([data], { type: mimeType }));

      setResult({ text, objectUrl, aggregatorUrl, mimeType, size });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Read failed");
    } finally {
      setLoading(false);
    }
  }, [blobId, knownMimeType, result?.objectUrl]);

  const triggerDownload = useCallback(() => {
    if (!result?.objectUrl) return;

    const extension = getFileExtension(result.mimeType);
    const filename = `walrus-${blobId.slice(0, 8)}${extension}`;

    const anchor = document.createElement("a");
    anchor.href = result.objectUrl;
    anchor.download = filename;
    anchor.click();
  }, [result, blobId]);

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
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Type: {result.mimeType}</span>
                <span>Size: {formatBytes(result.size)}</span>
              </div>
              <Button
                onClick={triggerDownload}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Download
              </Button>
            </div>

            {/* Image preview */}
            {isPreviewableImage(result.mimeType) && result.objectUrl && (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                <img
                  src={result.objectUrl}
                  alt={`Walrus blob ${blobId.slice(0, 8)}`}
                  className="max-w-full max-h-64 mx-auto rounded"
                />
              </div>
            )}

            {/* Text content display */}
            {result.text !== null && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <pre className="whitespace-pre-wrap break-all text-sm text-gray-800 max-h-64 overflow-auto">
                  {result.text}
                </pre>
              </div>
            )}

            {/* Binary non-image fallback */}
            {result.text === null && !isPreviewableImage(result.mimeType) && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Binary blob ({result.mimeType})
                </p>
              </div>
            )}

            {/* Aggregator link */}
            <p className="text-xs text-gray-400">
              Direct URL:{" "}
              <a
                href={result.aggregatorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {result.aggregatorUrl}
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Map common MIME types to file extensions for download filenames. */
function getFileExtension(mimeType: string): string {
  const EXTENSIONS: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
    "application/json": ".json",
    "application/zip": ".zip",
    "application/xml": ".xml",
    "text/plain": ".txt",
    "text/html": ".html",
  };
  return EXTENSIONS[mimeType] ?? "";
}
