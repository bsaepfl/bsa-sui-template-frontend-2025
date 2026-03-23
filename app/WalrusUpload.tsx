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
import { WALRUS_TESTNET_PUBLISHER } from "./constants";
import ClipLoader from "react-spinners/ClipLoader";

// Response shape from the Walrus publisher HTTP API
interface WalrusStoreResponse {
  newlyCreated?: {
    blobObject: {
      blobId: string;
      id: string;
    };
  };
  alreadyCertified?: {
    blobId: string;
  };
}

export function WalrusUpload() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"text" | "file">("text");
  const [epochs, setEpochs] = useState(3);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ blobId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async () => {
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      // Build the request body: either raw text or a file
      const body = mode === "text" ? new TextEncoder().encode(text) : file;
      if (!body) {
        setError("Nothing to upload");
        return;
      }

      // PUT to the Walrus publisher HTTP API
      const response = await fetch(
        `${WALRUS_TESTNET_PUBLISHER}/v1/blobs?epochs=${epochs}`,
        { method: "PUT", body },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data: WalrusStoreResponse = await response.json();

      // The API returns either newlyCreated or alreadyCertified
      const blobId =
        data.newlyCreated?.blobObject.blobId ?? data.alreadyCertified?.blobId;

      if (!blobId) {
        throw new Error("No blob ID in response");
      }

      setResult({ blobId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-gray-900">Store on Walrus</CardTitle>
        <CardDescription className="text-gray-600">
          Upload text or a file to Walrus decentralized storage. Data is
          erasure-coded across ~2,200 storage nodes on testnet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === "text" ? "default" : "outline"}
            onClick={() => setMode("text")}
            className={
              mode === "text"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }
            size="sm"
          >
            Text
          </Button>
          <Button
            variant={mode === "file" ? "default" : "outline"}
            onClick={() => setMode("file")}
            className={
              mode === "file"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }
            size="sm"
          >
            File
          </Button>
        </div>

        {/* Input */}
        {mode === "text" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to store on Walrus..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
          />
        ) : (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-gray-900"
          />
        )}

        {/* Epochs selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Storage epochs:</label>
          <select
            value={epochs}
            onChange={(e) => setEpochs(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded-md text-gray-900 text-sm"
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <span className="text-xs text-gray-500">(longer = stored longer)</span>
        </div>

        {/* Upload button */}
        <Button
          onClick={upload}
          disabled={uploading || (mode === "text" ? !text : !file)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
        >
          {uploading ? <ClipLoader size={20} color="white" /> : "Upload to Walrus"}
        </Button>

        {/* Error */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Result */}
        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-2">
            <p className="text-green-800 font-semibold">Stored successfully!</p>
            <div>
              <p className="text-xs text-gray-500">Blob ID (save this to retrieve later):</p>
              <code className="block text-xs bg-gray-100 p-2 rounded break-all text-gray-800">
                {result.blobId}
              </code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
