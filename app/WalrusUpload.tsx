"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMemo } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { createWalrusService } from "./services";
import ClipLoader from "react-spinners/ClipLoader";
import { WriteFilesFlow } from "@mysten/walrus";

type UploadTab = "file" | "text" | "json";

interface UploadedItem {
  blobId: string;
  id: string; // Metadata ID for explorer links
  url: string;
  size: number;
  type: string;
  timestamp: number;
  filename?: string;
}

export function WalrusUpload() {
  // Get wallet hooks for signing
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  // Create walrus service directly (only on client-side)
  const walrus = useMemo(() => {
    if (typeof window === "undefined") {
      // Return a dummy service on server-side
      return null as any;
    }
    return createWalrusService({ network: "testnet", epochs: 10 });
  }, []);

  const [activeTab, setActiveTab] = useState<UploadTab>("file");
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Text/JSON upload state
  const [textContent, setTextContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");

  /**
   * Handle file upload using WalrusFile API with writeFilesFlow
   * From official docs: https://sdk.mystenlabs.com/walrus
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    if (!walrus) {
      setError("Walrus service not available. Please refresh the page.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Read file as array buffer
      const contents = await file.arrayBuffer();

      // Use writeFilesFlow for browser environments (avoids popup blocking)
      const flow: WriteFilesFlow = walrus.uploadWithFlow(
        [
          {
            contents: new Uint8Array(contents),
            identifier: file.name,
            tags: { "content-type": file.type || "application/octet-stream" },
          },
        ],
        { epochs: 10, deletable: true },
      );

      // Step 1: Encode files
      await flow.encode();

      // Step 2: Register the blob (returns transaction)
      const registerTx = flow.register({
        owner: currentAccount.address,
        epochs: 10,
        deletable: true,
      });

      // Step 3: Sign and execute register transaction and get the created blob object ID
      let registerDigest: string;
      let blobObjectId: string | null = null;
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: registerTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                registerDigest = digest;
                const result = await suiClient.waitForTransaction({
                  digest,
                  options: {
                    showEffects: true,
                    showEvents: true,
                  },
                });

                // Get the blob object ID from BlobRegistered event
                if (result.events) {
                  const blobRegisteredEvent = result.events.find((event) =>
                    event.type.includes("BlobRegistered"),
                  );

                  if (blobRegisteredEvent?.parsedJson) {
                    // Extract object_id from the event (can be snake_case or camelCase)
                    const eventData = blobRegisteredEvent.parsedJson as {
                      object_id?: string;
                      objectId?: string;
                    };
                    blobObjectId =
                      eventData.object_id || eventData.objectId || null;
                  }
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          },
        );
      });

      // Step 4: Upload the blob data to storage nodes
      await flow.upload({ digest: registerDigest! });

      // Step 5: Certify the blob (returns transaction)
      const certifyTx = flow.certify();

      // Step 6: Sign and execute certify transaction
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: certifyTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                await suiClient.waitForTransaction({ digest });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          },
        );
      });

      // Step 7: Get the blobId from listFiles
      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;

      if (!blobId) {
        throw new Error("Failed to get blobId after upload");
      }

      // Use the blob object ID from transaction effects, or fallback to blobId if not found
      const metadataId = blobObjectId || blobId;

      const uploadedItem: UploadedItem = {
        blobId,
        id: metadataId,
        url: `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`,
        size: file.size,
        type: file.type || "application/octet-stream",
        timestamp: Date.now(),
        filename: file.name,
      };
      setUploadHistory([uploadedItem, ...uploadHistory]);
      setSuccess(`File "${file.name}" uploaded successfully!`);

      // Reset input
      event.target.value = "";
    } catch (err) {
      setError(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle text upload using WalrusFile API with writeFilesFlow
   */
  const handleTextUpload = async () => {
    if (!textContent.trim()) {
      setError("Please enter some text to upload");
      return;
    }

    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    if (!walrus) {
      setError("Walrus service not available. Please refresh the page.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use writeFilesFlow for browser environments
      const flow = walrus.uploadWithFlow(
        [
          {
            contents: textContent,
            identifier: "text.txt",
            tags: { "content-type": "text/plain" },
          },
        ],
        { epochs: 10, deletable: true },
      );

      // Step 1: Encode
      await flow.encode();

      // Step 2: Register
      const registerTx = flow.register({
        owner: currentAccount.address,
        epochs: 10,
        deletable: true,
      });

      let registerDigest: string;
      let blobObjectId: string | null = null;
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: registerTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                registerDigest = digest;
                const result = await suiClient.waitForTransaction({
                  digest,
                  options: {
                    showEffects: true,
                    showEvents: true,
                  },
                });

                // Get the blob object ID from BlobRegistered event
                if (result.events) {
                  const blobRegisteredEvent = result.events.find((event) =>
                    event.type.includes("BlobRegistered"),
                  );

                  if (blobRegisteredEvent?.parsedJson) {
                    // Extract object_id from the event (can be snake_case or camelCase)
                    const eventData = blobRegisteredEvent.parsedJson as {
                      object_id?: string;
                      objectId?: string;
                    };
                    blobObjectId =
                      eventData.object_id || eventData.objectId || null;
                  }
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          },
        );
      });

      // Step 3: Upload
      await flow.upload({ digest: registerDigest! });

      // Step 4: Certify
      const certifyTx = flow.certify();
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: certifyTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                await suiClient.waitForTransaction({ digest });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          },
        );
      });

      // Step 5: Get blobId
      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;

      if (!blobId) {
        throw new Error("Failed to get blobId after upload");
      }

      // Use the blob object ID from transaction effects, or fallback to blobId if not found
      const metadataId = blobObjectId || blobId;

      const uploadedItem: UploadedItem = {
        blobId,
        id: metadataId,
        url: `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`,
        size: textContent.length,
        type: "text/plain",
        timestamp: Date.now(),
      };
      setUploadHistory([uploadedItem, ...uploadHistory]);
      setSuccess("Text uploaded successfully!");
      setTextContent("");
    } catch (err) {
      setError(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle JSON upload using WalrusFile API with writeFilesFlow
   */
  const handleJsonUpload = async () => {
    if (!jsonContent.trim()) {
      setError("Please enter JSON data to upload");
      return;
    }

    // Validate JSON
    try {
      JSON.parse(jsonContent);
    } catch {
      setError("Invalid JSON format. Please check your syntax.");
      return;
    }

    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    if (!walrus) {
      setError("Walrus service not available. Please refresh the page.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use writeFilesFlow for browser environments
      const flow = walrus.uploadWithFlow(
        [
          {
            contents: jsonContent,
            identifier: "data.json",
            tags: { "content-type": "application/json" },
          },
        ],
        { epochs: 10, deletable: true },
      );

      // Step 1: Encode
      await flow.encode();

      // Step 2: Register
      const registerTx = flow.register({
        owner: currentAccount.address,
        epochs: 10,
        deletable: true,
      });

      let registerDigest: string;
      let blobObjectId: string | null = null;
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: registerTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                registerDigest = digest;
                const result = await suiClient.waitForTransaction({
                  digest,
                  options: {
                    showEffects: true,
                    showEvents: true,
                  },
                });

                // Get the blob object ID from BlobRegistered event
                if (result.events) {
                  const blobRegisteredEvent = result.events.find((event) =>
                    event.type.includes("BlobRegistered"),
                  );

                  if (blobRegisteredEvent?.parsedJson) {
                    // Extract object_id from the event (can be snake_case or camelCase)
                    const eventData = blobRegisteredEvent.parsedJson as {
                      object_id?: string;
                      objectId?: string;
                    };
                    blobObjectId =
                      eventData.object_id || eventData.objectId || null;
                  }
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          },
        );
      });

      // Step 3: Upload
      await flow.upload({ digest: registerDigest! });

      // Step 4: Certify
      const certifyTx = flow.certify();
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: certifyTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                await suiClient.waitForTransaction({ digest });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          },
        );
      });

      // Step 5: Get blobId
      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;

      if (!blobId) {
        throw new Error("Failed to get blobId after upload");
      }

      // Use the blob object ID from transaction effects, or fallback to blobId if not found
      const metadataId = blobObjectId || blobId;

      const uploadedItem: UploadedItem = {
        blobId,
        id: metadataId,
        url: `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`,
        size: jsonContent.length,
        type: "application/json",
        timestamp: Date.now(),
      };
      setUploadHistory([uploadedItem, ...uploadHistory]);
      setSuccess("JSON uploaded successfully!");
      setJsonContent("");
    } catch (err) {
      setError(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Copy blob ID or URL to clipboard
   */
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setSuccess(`${label} copied to clipboard!`);
    setTimeout(() => setSuccess(null), 2000);
  };

  /**
   * Format file size
   */
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-black">
              Walrus Storage Upload
            </CardTitle>
            <CardDescription className="text-black">
              Upload files, text, or JSON to Walrus decentralized storage
              network. Files are stored for 10 epochs (~30 days on testnet).
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-900">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <AlertDescription className="text-green-900">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Upload Content</CardTitle>
            {/* Tabs */}
            <div className="flex gap-2 pt-4">
              <Button
                variant={activeTab === "file" ? "default" : "outline"}
                onClick={() => setActiveTab("file")}
                className={
                  activeTab === "file" ? "bg-blue-600 hover:bg-blue-700" : ""
                }
              >
                📁 File
              </Button>
              <Button
                variant={activeTab === "text" ? "default" : "outline"}
                onClick={() => setActiveTab("text")}
                className={
                  activeTab === "text" ? "bg-blue-600 hover:bg-blue-700" : ""
                }
              >
                📝 Text
              </Button>
              <Button
                variant={activeTab === "json" ? "default" : "outline"}
                onClick={() => setActiveTab("json")}
                className={
                  activeTab === "json" ? "bg-blue-600 hover:bg-blue-700" : ""
                }
              >
                🔧 JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* File Upload */}
            {activeTab === "file" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="file-upload"
                    accept="*/*"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="text-5xl mb-4">📤</div>
                    <div className="text-lg font-semibold text-black mb-2">
                      {uploading
                        ? "Uploading..."
                        : "Choose a file or drag it here"}
                    </div>
                    <div className="text-sm text-black">
                      Any file type supported • Max size depends on Walrus
                      limits
                    </div>
                  </label>
                </div>
                {uploading && (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={30} color="#2563eb" />
                    <span className="ml-3 text-black">
                      Uploading to Walrus...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Text Upload */}
            {activeTab === "text" && (
              <div className="space-y-4">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter your text here..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-black placeholder:text-gray-500"
                  disabled={uploading}
                />
                <Button
                  onClick={handleTextUpload}
                  disabled={uploading || !textContent.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <ClipLoader size={20} color="white" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    "📤 Upload Text to Walrus"
                  )}
                </Button>
              </div>
            )}

            {/* JSON Upload */}
            {activeTab === "json" && (
              <div className="space-y-4">
                <textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  placeholder={
                    '{\n  "key": "value",\n  "data": "your JSON here"\n}'
                  }
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-black placeholder:text-gray-500"
                  disabled={uploading}
                />
                <Button
                  onClick={handleJsonUpload}
                  disabled={uploading || !jsonContent.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <ClipLoader size={20} color="white" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    "📤 Upload JSON to Walrus"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">
                Upload History ({uploadHistory.length})
              </CardTitle>
              <CardDescription className="text-black">
                Your recently uploaded items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadHistory.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {item.filename && (
                          <div className="font-semibold text-gray-900">
                            📄 {item.filename}
                          </div>
                        )}
                        <div className="text-sm text-black">
                          <span className="font-medium">Type:</span> {item.type}{" "}
                          • <span className="font-medium">Size:</span>{" "}
                          {formatSize(item.size)} •{" "}
                          <span className="font-medium">Time:</span>{" "}
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="flex flex-col gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-black">
                              Sui Metadata ID:
                            </span>
                            <code className="bg-gray-100 px-2 py-1 rounded flex-1 truncate text-black">
                              {item.id}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                copyToClipboard(item.id, "Sui Metadata ID")
                              }
                              className="text-xs text-black"
                            >
                              Copy
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-black">
                              Blob ID:
                            </span>
                            <code className="bg-gray-100 px-2 py-1 rounded flex-1 truncate text-black">
                              {item.blobId}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                copyToClipboard(item.blobId, "Blob ID")
                              }
                              className="text-xs text-black"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://testnet.suivision.xyz/object/${item.id}`,
                            "_blank",
                          )
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        🔍 View on SuiVision
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://walruscan.com/testnet/blob/${item.blobId}`,
                            "_blank",
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        🔍 View on WalrusCan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(item.url, "URL")}
                        className="text-black border-gray-300"
                      >
                        📋 Copy URL
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              ℹ️ About Walrus Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p>
              <strong>Walrus</strong> is a decentralized storage network built
              on Sui blockchain.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Files are stored redundantly across multiple nodes</li>
              <li>Content is permanently accessible via blob ID</li>
              <li>
                Storage duration is set in epochs (currently 10 epochs ≈ 30
                days)
              </li>
              <li>No central point of failure - fully decentralized</li>
              <li>Retrieve files anytime using the blob ID or URL</li>
            </ul>
            <p className="mt-4">
              <strong>Network:</strong> Testnet •{" "}
              <strong>Storage Duration:</strong> 10 epochs
            </p>
            <p className="mt-4 text-sm">
              For documentation and resources, visit the{" "}
              <strong>Resources</strong> tab in the navigation bar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
