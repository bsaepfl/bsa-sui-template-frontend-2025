"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useCurrentAccount,
  useSuiClient,
  useWallets,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import {
  createSealService,
  createWhitelistService,
  SEAL_TESTNET_SERVERS,
  type CapData,
} from "./services";
import ClipLoader from "react-spinners/ClipLoader";
import { SessionKey } from "@mysten/seal";
import { TESTNET_WHITELIST_PACKAGE_ID } from "./constants";
import { generateUUID } from "./lib/utils";

interface EncryptedItem {
  encryptedBytes: Uint8Array;
  backupKey: Uint8Array;
  whitelistObjectId: string;
  nonce: string;
  originalData: string;
  timestamp: number;
}

export function SealWhitelist() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const wallets = useWallets();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Seal server selection - must be declared before useMemo
  const [selectedSealServer, setSelectedSealServer] =
    useState<keyof typeof SEAL_TESTNET_SERVERS>("Mysten Testnet 1");

  // Create seal service with selected server
  const sealService = useMemo(() => {
    if (typeof window === "undefined") {
      return null as any;
    }
    return createSealService({
      network: "testnet",
      whitelistPackageId: TESTNET_WHITELIST_PACKAGE_ID,
      serverObjectIds: [SEAL_TESTNET_SERVERS[selectedSealServer]],
    });
  }, [selectedSealServer]);

  // Create whitelist service
  const whitelistService = useMemo(() => {
    if (typeof window === "undefined") {
      return null as any;
    }
    return createWhitelistService(suiClient, TESTNET_WHITELIST_PACKAGE_ID);
  }, [suiClient]);

  const [whitelistObjectId, setWhitelistObjectId] = useState("");
  const [nonce, setNonce] = useState("");
  const [textToEncrypt, setTextToEncrypt] = useState("");
  const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
  const [sessionKeyCreatedAt, setSessionKeyCreatedAt] = useState<number | null>(
    null,
  );
  const [encryptedItems, setEncryptedItems] = useState<EncryptedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Separate loading states for each action
  const [loadingSessionKey, setLoadingSessionKey] = useState(false);
  const [loadingEncrypt, setLoadingEncrypt] = useState(false);
  const [loadingDecrypt, setLoadingDecrypt] = useState<string | null>(null); // Track which item is being decrypted
  const [loadingCreateWhitelist, setLoadingCreateWhitelist] = useState(false);
  const [loadingAddAddress, setLoadingAddAddress] = useState(false);
  const [loadingRemoveAddress, setLoadingRemoveAddress] = useState(false);

  // Whitelist management state
  const [ownedCaps, setOwnedCaps] = useState<CapData[]>([]);
  const [selectedCap, setSelectedCap] = useState<string>("");
  const [addressToAdd, setAddressToAdd] = useState("");
  const [addressToRemove, setAddressToRemove] = useState("");

  // Manual decryption state (for decrypting data from another wallet)
  const [manualEncryptedBytes, setManualEncryptedBytes] = useState("");
  const [manualWhitelistId, setManualWhitelistId] = useState("");
  const [manualNonce, setManualNonce] = useState("");
  const [loadingManualDecrypt, setLoadingManualDecrypt] = useState(false);
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [decryptedBytesHex, setDecryptedBytesHex] = useState<string | null>(
    null,
  );
  const [decryptedBytesArray, setDecryptedBytesArray] = useState<
    number[] | null
  >(null);

  // Encryption result display state
  const [lastEncryptedBytes, setLastEncryptedBytes] =
    useState<Uint8Array | null>(null);
  const [lastEncryptedBytesHex, setLastEncryptedBytesHex] = useState<
    string | null
  >(null);
  const [lastEncryptedBytesArray, setLastEncryptedBytesArray] = useState<
    number[] | null
  >(null);
  const [lastOriginalString, setLastOriginalString] = useState<string | null>(
    null,
  );

  /**
   * Sign personal message using wallet
   */
  const signPersonalMessage = async (message: Uint8Array): Promise<string> => {
    if (!currentAccount || !wallets.length) {
      throw new Error("Please connect your wallet first");
    }

    const connectedWallet = wallets.find((w) =>
      w.accounts.find((acc) => acc.address === currentAccount.address),
    );

    if (!connectedWallet) {
      throw new Error("Wallet not found");
    }

    const account = connectedWallet.accounts.find(
      (acc) => acc.address === currentAccount.address,
    );

    if (!account) {
      throw new Error("Account not found");
    }

    // Use the wallet's signPersonalMessage feature
    const signer = connectedWallet.features["sui:signPersonalMessage"];
    if (!signer) {
      throw new Error("Wallet does not support signPersonalMessage");
    }

    const result = await signer.signPersonalMessage({
      message: message,
      account: account,
    });

    return result.signature;
  };

  /**
   * Check if session key is expired (10 minutes TTL)
   */
  const isSessionKeyExpired = (): boolean => {
    if (!sessionKey || !sessionKeyCreatedAt) {
      return true;
    }
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    return now - sessionKeyCreatedAt > tenMinutes;
  };

  /**
   * Create session key with wallet signing
   */
  const handleCreateSessionKey = async () => {
    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    if (!sealService) {
      setError("Seal service not available. Please refresh the page.");
      return;
    }

    setLoadingSessionKey(true);
    setError(null);
    setSuccess(null);

    try {
      const key = await sealService.createSessionKey(
        currentAccount.address,
        signPersonalMessage,
      );
      setSessionKey(key);
      setSessionKeyCreatedAt(Date.now());
      setSuccess("Session key created successfully! Valid for 10 minutes.");
    } catch (err) {
      setError(
        `Failed to create session key: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      console.error("Session key creation error:", err);
    } finally {
      setLoadingSessionKey(false);
    }
  };

  /**
   * Encrypt data using Seal
   */
  const handleEncrypt = async () => {
    if (!textToEncrypt.trim()) {
      setError("Please enter text to encrypt");
      return;
    }

    if (!whitelistObjectId.trim()) {
      setError("Please enter whitelist object ID");
      return;
    }

    if (!sealService) {
      setError("Seal service not available. Please refresh the page.");
      return;
    }

    setLoadingEncrypt(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate random nonce if not provided
      const encryptionNonce = nonce.trim() || generateUUID();

      // Convert text to bytes
      const data = new TextEncoder().encode(textToEncrypt);

      // Encrypt using Seal
      const { encryptedBytes, backupKey } = await sealService.encrypt(
        whitelistObjectId,
        encryptionNonce,
        data,
      );

      const encryptedItem: EncryptedItem = {
        encryptedBytes,
        backupKey,
        whitelistObjectId,
        nonce: encryptionNonce,
        originalData: textToEncrypt,
        timestamp: Date.now(),
      };

      // Store for display
      setLastEncryptedBytes(encryptedBytes);
      setLastEncryptedBytesHex(uint8ArrayToHex(encryptedBytes));
      setLastEncryptedBytesArray(Array.from(encryptedBytes));
      setLastOriginalString(textToEncrypt);

      // Console logs for debugging
      console.log("=== ENCRYPTION RESULTS ===");
      console.log("Original String:", textToEncrypt);
      console.log("Encrypted Bytes (Uint8Array):", Array.from(encryptedBytes));
      console.log(
        "Encrypted Bytes (Hex):",
        `0x${uint8ArrayToHex(encryptedBytes)}`,
      );
      console.log("Encrypted Bytes Length:", encryptedBytes.length);
      console.log("Whitelist ID:", whitelistObjectId);
      console.log("Nonce:", encryptionNonce);
      console.log("==========================");

      setEncryptedItems([encryptedItem, ...encryptedItems]);
      setSuccess("Data encrypted successfully!");
      setTextToEncrypt("");
      setNonce("");
    } catch (err) {
      setError(
        `Encryption failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      console.error("Encryption error:", err);
    } finally {
      setLoadingEncrypt(false);
    }
  };

  /**
   * Load owned caps
   */
  const loadOwnedCaps = async () => {
    if (!currentAccount || !whitelistService) {
      return;
    }

    try {
      const caps = await whitelistService.getCapsByOwner(
        currentAccount.address,
      );
      setOwnedCaps(caps);
      if (caps.length > 0 && !selectedCap) {
        setSelectedCap(caps[0].objectId);
        if (!whitelistObjectId) {
          setWhitelistObjectId(caps[0].whitelistId);
        }
      }
    } catch (err) {
      console.error("Error loading caps:", err);
    }
  };

  // Load owned caps on mount and when account changes
  useEffect(() => {
    if (currentAccount && whitelistService) {
      loadOwnedCaps();
    }
  }, [currentAccount, whitelistService]);

  /**
   * Create a new whitelist
   */
  const handleCreateWhitelist = async () => {
    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    if (!whitelistService) {
      setError("Whitelist service not available");
      return;
    }

    setLoadingCreateWhitelist(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = whitelistService.createWhitelistTransaction();

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            const { capId, whitelistId } =
              await whitelistService.waitForTransactionAndGetCreatedObjects(
                result.digest,
              );

            if (capId && whitelistId) {
              setSuccess(
                `Whitelist created! Cap ID: ${capId.slice(0, 10)}..., Whitelist ID: ${whitelistId.slice(0, 10)}...`,
              );
              setWhitelistObjectId(whitelistId);
              await loadOwnedCaps();
            } else {
              setError("Failed to get created object IDs");
            }
            setLoadingCreateWhitelist(false);
          },
          onError: (err) => {
            setError(
              `Failed to create whitelist: ${
                err instanceof Error ? err.message : "Unknown error"
              }`,
            );
            setLoadingCreateWhitelist(false);
          },
        },
      );
    } catch (err) {
      setError(
        `Failed to create whitelist: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      setLoadingCreateWhitelist(false);
    }
  };

  /**
   * Add address to whitelist
   */
  const handleAddAddress = async () => {
    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    if (!selectedCap) {
      setError("Please select a Cap");
      return;
    }

    if (!addressToAdd.trim()) {
      setError("Please enter an address to add");
      return;
    }

    if (!whitelistService) {
      setError("Whitelist service not available");
      return;
    }

    setLoadingAddAddress(true);
    setError(null);
    setSuccess(null);

    try {
      const cap = await whitelistService.getCap(selectedCap);
      if (!cap) {
        setError("Failed to get Cap information");
        setLoadingAddAddress(false);
        return;
      }

      const tx = whitelistService.addAddressTransaction(
        cap.whitelistId,
        selectedCap,
        addressToAdd.trim(),
      );

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            await whitelistService.waitForTransaction(result.digest);
            setSuccess(
              `Address ${addressToAdd.slice(0, 10)}... added to whitelist!`,
            );
            setAddressToAdd("");
            setLoadingAddAddress(false);
          },
          onError: (err) => {
            setError(
              `Failed to add address: ${
                err instanceof Error ? err.message : "Unknown error"
              }`,
            );
            setLoadingAddAddress(false);
          },
        },
      );
    } catch (err) {
      setError(
        `Failed to add address: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      setLoadingAddAddress(false);
    }
  };

  /**
   * Remove address from whitelist
   */
  const handleRemoveAddress = async () => {
    if (!currentAccount) {
      setError("Please connect your wallet first");
      return;
    }

    if (!selectedCap) {
      setError("Please select a Cap");
      return;
    }

    if (!addressToRemove.trim()) {
      setError("Please enter an address to remove");
      return;
    }

    if (!whitelistService) {
      setError("Whitelist service not available");
      return;
    }

    setLoadingRemoveAddress(true);
    setError(null);
    setSuccess(null);

    try {
      const cap = await whitelistService.getCap(selectedCap);
      if (!cap) {
        setError("Failed to get Cap information");
        setLoadingRemoveAddress(false);
        return;
      }

      const tx = whitelistService.removeAddressTransaction(
        cap.whitelistId,
        selectedCap,
        addressToRemove.trim(),
      );

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            await whitelistService.waitForTransaction(result.digest);
            setSuccess(
              `Address ${addressToRemove.slice(0, 10)}... removed from whitelist!`,
            );
            setAddressToRemove("");
            setLoadingRemoveAddress(false);
          },
          onError: (err) => {
            setError(
              `Failed to remove address: ${
                err instanceof Error ? err.message : "Unknown error"
              }`,
            );
            setLoadingRemoveAddress(false);
          },
        },
      );
    } catch (err) {
      setError(
        `Failed to remove address: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      setLoadingRemoveAddress(false);
    }
  };

  /**
   * Convert hex string to Uint8Array
   */
  const hexToUint8Array = (hex: string): Uint8Array => {
    // Remove 0x prefix if present
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    // Remove spaces and newlines
    const normalizedHex = cleanHex.replace(/\s+/g, "");

    if (normalizedHex.length % 2 !== 0) {
      throw new Error("Invalid hex string: length must be even");
    }

    const bytes = new Uint8Array(normalizedHex.length / 2);
    for (let i = 0; i < normalizedHex.length; i += 2) {
      bytes[i / 2] = parseInt(normalizedHex.substr(i, 2), 16);
    }
    return bytes;
  };

  /**
   * Convert Uint8Array to hex string
   */
  const uint8ArrayToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  /**
   * Convert base64 string to Uint8Array
   */
  const base64ToUint8Array = (base64: string): Uint8Array => {
    // Remove data URL prefix if present
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  /**
   * Handle manual decryption (for decrypting data from another wallet)
   */
  const handleManualDecrypt = async () => {
    if (isSessionKeyExpired()) {
      setError("Session key has expired. Please create a new one.");
      setSessionKey(null);
      setSessionKeyCreatedAt(null);
      return;
    }

    if (!sessionKey) {
      setError("Please create a session key first");
      return;
    }

    if (!sealService) {
      setError("Seal service not available. Please refresh the page.");
      return;
    }

    if (!manualEncryptedBytes.trim()) {
      setError("Please enter encrypted bytes");
      return;
    }

    if (!manualWhitelistId.trim()) {
      setError("Please enter whitelist object ID");
      return;
    }

    if (!manualNonce.trim()) {
      setError("Please enter nonce");
      return;
    }

    setLoadingManualDecrypt(true);
    setError(null);
    setSuccess(null);
    setDecryptedResult(null);

    try {
      // Try to parse as hex first, then base64
      let encryptedBytes: Uint8Array;
      try {
        encryptedBytes = hexToUint8Array(manualEncryptedBytes.trim());
      } catch (hexError) {
        try {
          encryptedBytes = base64ToUint8Array(manualEncryptedBytes.trim());
        } catch (base64Error) {
          throw new Error(
            "Invalid encrypted bytes format. Please provide hex (with or without 0x prefix) or base64 string.",
          );
        }
      }

      // Decrypt using Seal
      const decryptedBytes = await sealService.decrypt(
        encryptedBytes,
        sessionKey,
        manualWhitelistId.trim(),
        manualNonce.trim(),
      );

      // Convert bytes to text
      const decryptedText = new TextDecoder().decode(decryptedBytes);

      // Store for display
      setDecryptedResult(decryptedText);
      setDecryptedBytesHex(uint8ArrayToHex(decryptedBytes));
      setDecryptedBytesArray(Array.from(decryptedBytes));

      // Console logs for debugging
      console.log("=== DECRYPTION RESULTS (Manual) ===");
      console.log("Decrypted String:", decryptedText);
      console.log("Decrypted Bytes (Uint8Array):", Array.from(decryptedBytes));
      console.log(
        "Decrypted Bytes (Hex):",
        `0x${uint8ArrayToHex(decryptedBytes)}`,
      );
      console.log("Decrypted Bytes Length:", decryptedBytes.length);
      console.log("Whitelist ID:", manualWhitelistId.trim());
      console.log("Nonce:", manualNonce.trim());
      console.log("===================================");

      setSuccess("Data decrypted successfully!");
    } catch (err) {
      setError(
        `Decryption failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }. Make sure you are on the whitelist and all inputs are correct.`,
      );
      console.error("Manual decryption error:", err);
    } finally {
      setLoadingManualDecrypt(false);
    }
  };

  /**
   * Decrypt data using Seal
   */
  const handleDecrypt = async (item: EncryptedItem) => {
    if (isSessionKeyExpired()) {
      setError("Session key has expired. Please create a new one.");
      setSessionKey(null);
      setSessionKeyCreatedAt(null);
      return;
    }

    if (!sessionKey) {
      setError("Please create a session key first");
      return;
    }

    if (!sealService) {
      setError("Seal service not available. Please refresh the page.");
      return;
    }

    // Use item timestamp as unique identifier for loading state
    const itemId = `${item.timestamp}-${item.nonce}`;
    setLoadingDecrypt(itemId);
    setError(null);
    setSuccess(null);

    try {
      // Decrypt using Seal
      const decryptedBytes = await sealService.decrypt(
        item.encryptedBytes,
        sessionKey,
        item.whitelistObjectId,
        item.nonce,
      );

      // Convert bytes to text
      const decryptedText = new TextDecoder().decode(decryptedBytes);

      // Store for display (for the item-based decrypt)
      setDecryptedResult(decryptedText);
      setDecryptedBytesHex(uint8ArrayToHex(decryptedBytes));
      setDecryptedBytesArray(Array.from(decryptedBytes));

      // Console logs for debugging
      console.log("=== DECRYPTION RESULTS (Item) ===");
      console.log("Decrypted String:", decryptedText);
      console.log("Decrypted Bytes (Uint8Array):", Array.from(decryptedBytes));
      console.log(
        "Decrypted Bytes (Hex):",
        `0x${uint8ArrayToHex(decryptedBytes)}`,
      );
      console.log("Decrypted Bytes Length:", decryptedBytes.length);
      console.log("Whitelist ID:", item.whitelistObjectId);
      console.log("Nonce:", item.nonce);
      console.log("=================================");

      setSuccess(`Decrypted: ${decryptedText}`);
    } catch (err) {
      setError(
        `Decryption failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }. Make sure you are on the whitelist.`,
      );
      console.error("Decryption error:", err);
    } finally {
      setLoadingDecrypt(null);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-black">
              Seal Whitelist Encryption
            </CardTitle>
            <CardDescription className="text-black">
              Encrypt and decrypt data using Seal with whitelist access control.
              Only addresses on the whitelist can decrypt the data.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Seal Server Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">
              Seal Server Configuration
            </CardTitle>
            <CardDescription className="text-black">
              Select which Seal key server to use for encryption/decryption.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Seal Key Server
              </label>
              <select
                value={selectedSealServer}
                onChange={(e) => {
                  setSelectedSealServer(
                    e.target.value as keyof typeof SEAL_TESTNET_SERVERS,
                  );
                  // Reset session key when server changes
                  setSessionKey(null);
                  setSessionKeyCreatedAt(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
              >
                {Object.keys(SEAL_TESTNET_SERVERS).map((serverName) => (
                  <option key={serverName} value={serverName}>
                    {serverName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Current server:{" "}
                {SEAL_TESTNET_SERVERS[selectedSealServer].slice(0, 20)}...
              </p>
            </div>
          </CardContent>
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

        {/* Whitelist Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Whitelist Management</CardTitle>
            <CardDescription className="text-black">
              Create and manage whitelists. Only addresses on the whitelist can
              decrypt encrypted data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Create Whitelist */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Create New Whitelist
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Creates a new whitelist and returns a Cap object that you
                    can use to manage addresses.
                  </p>
                  <Button
                    onClick={handleCreateWhitelist}
                    disabled={loadingCreateWhitelist || !currentAccount}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loadingCreateWhitelist ? (
                      <>
                        <ClipLoader size={20} color="white" className="mr-2" />
                        Creating...
                      </>
                    ) : (
                      "➕ Create Whitelist"
                    )}
                  </Button>
                </div>
              </div>

              {/* Manage Whitelist Entries */}
              {ownedCaps.length > 0 && (
                <div className="space-y-4 border-t pt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Manage Whitelist Entries
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select a Cap to manage addresses in its whitelist.
                    </p>
                  </div>

                  {/* Select Cap */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Select Cap
                    </label>
                    <select
                      value={selectedCap}
                      onChange={(e) => {
                        setSelectedCap(e.target.value);
                        const cap = ownedCaps.find(
                          (c) => c.objectId === e.target.value,
                        );
                        if (cap) {
                          setWhitelistObjectId(cap.whitelistId);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                    >
                      {ownedCaps.map((cap) => (
                        <option key={cap.objectId} value={cap.objectId}>
                          Cap: {cap.objectId.slice(0, 16)}... (Whitelist:{" "}
                          {cap.whitelistId.slice(0, 16)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Add Address to Whitelist
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={addressToAdd}
                        onChange={(e) => setAddressToAdd(e.target.value)}
                        placeholder="0x... (Sui address)"
                        disabled={loadingAddAddress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <Button
                        onClick={handleAddAddress}
                        disabled={loadingAddAddress || !addressToAdd.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {loadingAddAddress ? (
                          <ClipLoader size={16} color="white" />
                        ) : (
                          "➕ Add"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Remove Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Remove Address from Whitelist
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={addressToRemove}
                        onChange={(e) => setAddressToRemove(e.target.value)}
                        placeholder="0x... (Sui address)"
                        disabled={loadingRemoveAddress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <Button
                        onClick={handleRemoveAddress}
                        disabled={
                          loadingRemoveAddress || !addressToRemove.trim()
                        }
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {loadingRemoveAddress ? (
                          <ClipLoader size={16} color="white" />
                        ) : (
                          "➖ Remove"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Display Whitelist ID */}
                  {selectedCap && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Whitelist ID:</span>{" "}
                        {ownedCaps.find((c) => c.objectId === selectedCap)
                          ?.whitelistId || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* No Caps Message */}
              {ownedCaps.length === 0 && currentAccount && (
                <div className="text-center py-8 text-gray-500">
                  <p>No whitelists found. Create one to get started!</p>
                </div>
              )}

              {/* Not Connected Message */}
              {!currentAccount && (
                <div className="text-center py-8 text-gray-500">
                  <p>Please connect your wallet to manage whitelists.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session Key Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Session Key</CardTitle>
            <CardDescription className="text-black">
              Create a session key to decrypt data. You'll need to sign a
              message with your wallet. The session key is valid for 10 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  {sessionKey && !isSessionKeyExpired() ? (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Session key active (valid for 10 minutes)
                    </div>
                  ) : sessionKey && isSessionKeyExpired() ? (
                    <div className="text-sm text-orange-600 font-medium">
                      ⚠ Session key expired. Please renew.
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      No active session key
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleCreateSessionKey}
                  disabled={
                    loadingSessionKey ||
                    (!isSessionKeyExpired() && !!sessionKey)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loadingSessionKey ? (
                    <>
                      <ClipLoader size={20} color="white" className="mr-2" />
                      Creating...
                    </>
                  ) : isSessionKeyExpired() && sessionKey ? (
                    "Renew Session Key"
                  ) : (
                    "Create Session Key"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Encryption Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Encrypt Data</CardTitle>
            <CardDescription className="text-black">
              Encrypt data that can only be decrypted by addresses on the
              whitelist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Whitelist Object ID
                </label>
                <input
                  type="text"
                  value={whitelistObjectId}
                  onChange={(e) => setWhitelistObjectId(e.target.value)}
                  placeholder="0x... (the whitelist shared object ID)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <p className="text-xs text-gray-600 mt-1">
                  The whitelist object ID created using create_whitelist_entry
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Nonce (optional - random UUID will be generated if empty)
                </label>
                <input
                  type="text"
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  placeholder="Leave empty for random nonce"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Text to Encrypt
                </label>
                <textarea
                  value={textToEncrypt}
                  onChange={(e) => setTextToEncrypt(e.target.value)}
                  placeholder="Enter text to encrypt..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleEncrypt}
                disabled={loadingEncrypt}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {loadingEncrypt ? (
                  <>
                    <ClipLoader size={20} color="white" className="mr-2" />
                    Encrypting...
                  </>
                ) : (
                  "🔒 Encrypt Data"
                )}
              </Button>

              {/* Encryption Results Display */}
              {lastEncryptedBytes && (
                <div className="mt-6 space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900">
                    Encryption Results:
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Original String:
                      </label>
                      <div className="p-2 bg-white border border-blue-300 rounded text-blue-900 font-mono text-sm break-words">
                        {lastOriginalString}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Encrypted Bytes (Hex):
                      </label>
                      <div className="p-2 bg-white border border-blue-300 rounded text-blue-900 font-mono text-xs break-all max-h-40 overflow-y-auto">
                        0x{lastEncryptedBytesHex}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `0x${lastEncryptedBytesHex}`,
                          );
                          setSuccess(
                            "Encrypted bytes (hex) copied to clipboard!",
                          );
                        }}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Copy Hex
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1">
                        Encrypted Bytes (Uint8Array):
                      </label>
                      <div className="p-2 bg-white border border-blue-300 rounded text-blue-900 font-mono text-xs break-all max-h-40 overflow-y-auto">
                        [{lastEncryptedBytesArray?.slice(0, 100).join(", ")}
                        {lastEncryptedBytesArray &&
                        lastEncryptedBytesArray.length > 100
                          ? ", ..."
                          : ""}
                        ]
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Length: {lastEncryptedBytes.length} bytes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Manual Decryption Section (for decrypting data from another wallet) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">
              Decrypt Data (Manual Input)
            </CardTitle>
            <CardDescription className="text-black">
              Decrypt data that was encrypted by another wallet. You need the
              encrypted bytes, whitelist object ID, and nonce. Make sure you are
              on the whitelist and have created a session key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Encrypted Bytes (Hex or Base64)
                </label>
                <textarea
                  value={manualEncryptedBytes}
                  onChange={(e) => setManualEncryptedBytes(e.target.value)}
                  placeholder="Enter encrypted bytes as hex (0x...) or base64 string..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black placeholder:text-gray-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Accepts hex format (with or without 0x prefix) or base64
                  encoded string
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Whitelist Object ID
                </label>
                <input
                  type="text"
                  value={manualWhitelistId}
                  onChange={(e) => setManualWhitelistId(e.target.value)}
                  placeholder="0x... (the whitelist shared object ID)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">
                  The whitelist object ID used during encryption
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Nonce
                </label>
                <input
                  type="text"
                  value={manualNonce}
                  onChange={(e) => setManualNonce(e.target.value)}
                  placeholder="Enter the nonce used during encryption"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <p className="text-xs text-gray-600 mt-1">
                  The nonce that was used when the data was encrypted
                </p>
              </div>
              <Button
                onClick={handleManualDecrypt}
                disabled={
                  loadingManualDecrypt || !sessionKey || isSessionKeyExpired()
                }
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                {loadingManualDecrypt ? (
                  <>
                    <ClipLoader size={20} color="white" className="mr-2" />
                    Decrypting...
                  </>
                ) : (
                  "🔓 Decrypt Data"
                )}
              </Button>
              {!sessionKey && (
                <p className="text-sm text-orange-600">
                  ⚠ Please create a session key first before decrypting
                </p>
              )}
              {sessionKey && isSessionKeyExpired() && (
                <p className="text-sm text-orange-600">
                  ⚠ Session key expired. Please renew it before decrypting
                </p>
              )}
              {decryptedResult && (
                <div className="mt-4 space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-900">
                    Decryption Results:
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-1">
                        Decrypted String:
                      </label>
                      <div className="p-3 bg-white border border-green-300 rounded text-green-900 font-mono text-sm break-words">
                        {decryptedResult}
                      </div>
                    </div>

                    {decryptedBytesHex && (
                      <div>
                        <label className="block text-sm font-medium text-green-900 mb-1">
                          Decrypted Bytes (Hex):
                        </label>
                        <div className="p-2 bg-white border border-green-300 rounded text-green-900 font-mono text-xs break-all max-h-40 overflow-y-auto">
                          0x{decryptedBytesHex}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `0x${decryptedBytesHex}`,
                            );
                            setSuccess(
                              "Decrypted bytes (hex) copied to clipboard!",
                            );
                          }}
                          className="mt-1 text-xs text-green-600 hover:text-green-800 underline"
                        >
                          Copy Hex
                        </button>
                      </div>
                    )}

                    {decryptedBytesArray && (
                      <div>
                        <label className="block text-sm font-medium text-green-900 mb-1">
                          Decrypted Bytes (Uint8Array):
                        </label>
                        <div className="p-2 bg-white border border-green-300 rounded text-green-900 font-mono text-xs break-all max-h-40 overflow-y-auto">
                          [{decryptedBytesArray.slice(0, 100).join(", ")}
                          {decryptedBytesArray.length > 100 ? ", ..." : ""}]
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Length: {decryptedBytesArray.length} bytes
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Encrypted Items History */}
        {encryptedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">
                Encrypted Items ({encryptedItems.length})
              </CardTitle>
              <CardDescription className="text-black">
                Your encrypted data. Only whitelisted addresses can decrypt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {encryptedItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-2">
                      <div className="text-sm text-black">
                        <span className="font-medium">Original:</span>{" "}
                        {item.originalData}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">
                          Whitelist Object ID:
                        </span>{" "}
                        {item.whitelistObjectId.slice(0, 10)}... •{" "}
                        <span className="font-medium">Nonce:</span> {item.nonce}{" "}
                        • <span className="font-medium">Time:</span>{" "}
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Encrypted Size:</span>{" "}
                        {item.encryptedBytes.length} bytes
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Full Whitelist ID:</span>{" "}
                        <span className="font-mono">
                          {item.whitelistObjectId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 break-all">
                        <span className="font-medium">
                          Encrypted Bytes (Hex):
                        </span>{" "}
                        <span className="font-mono">
                          0x{uint8ArrayToHex(item.encryptedBytes).slice(0, 100)}
                          {item.encryptedBytes.length > 50 ? "..." : ""}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const hex = uint8ArrayToHex(item.encryptedBytes);
                          navigator.clipboard.writeText(hex);
                          setSuccess("Encrypted bytes copied to clipboard!");
                        }}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        📋 Copy Encrypted Bytes
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDecrypt(item)}
                        disabled={
                          loadingDecrypt ===
                            `${item.timestamp}-${item.nonce}` ||
                          !sessionKey ||
                          isSessionKeyExpired()
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {loadingDecrypt ===
                        `${item.timestamp}-${item.nonce}` ? (
                          <>
                            <ClipLoader
                              size={16}
                              color="white"
                              className="mr-2"
                            />
                            Decrypting...
                          </>
                        ) : (
                          "🔓 Decrypt"
                        )}
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
              ℹ️ About Seal Whitelist
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p>
              <strong>Seal</strong> uses Identity-Based Encryption (IBE) with
              whitelist access control.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Only addresses on the whitelist can decrypt encrypted data
              </li>
              <li>
                Session keys allow decryption for 10 minutes without repeated
                wallet confirmations
              </li>
              <li>
                The encryption ID format: [packageId][whitelistObjectId][nonce]
              </li>
              <li>
                Access control is enforced on-chain through the whitelist Move
                module
              </li>
            </ul>
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
