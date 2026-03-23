import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export function Counter({ id }: { id: string }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const [waitingForTxn, setWaitingForTxn] = useState("");

  const executeMoveCall = (method: "increment" | "reset") => {
    setWaitingForTxn(method);

    const tx = new Transaction();

    if (method === "reset") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(0)],
        target: `${counterPackageId}::counter::set_value`,
      });
    } else {
      tx.moveCall({
        arguments: [tx.object(id)],
        target: `${counterPackageId}::counter::increment`,
      });
    }

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await refetch();
            setWaitingForTxn("");
          });
        },
      },
    );
  };

  if (isPending) return (
    <Alert>
      <AlertDescription className="text-muted-foreground">Loading...</AlertDescription>
    </Alert>
  );

  if (error) return (
    <Alert variant="destructive">
      <AlertDescription>Error: {error.message}</AlertDescription>
    </Alert>
  );

  if (!data.data) return (
    <Alert>
      <AlertDescription className="text-muted-foreground">Not found</AlertDescription>
    </Alert>
  );

  const ownedByCurrentAccount =
    getCounterFields(data.data)?.owner === currentAccount?.address;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900">Counter {id}</CardTitle>
        <CardDescription className="text-gray-600">
          Count: {getCounterFields(data.data)?.value}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-2">
        <Button
          onClick={() => executeMoveCall("increment")}
          disabled={waitingForTxn !== ""}
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-white"
        >
          {waitingForTxn === "increment" ? (
            <ClipLoader size={20} color="white" />
          ) : (
            "Increment"
          )}
        </Button>
        {ownedByCurrentAccount ? (
          <Button
            onClick={() => executeMoveCall("reset")}
            disabled={waitingForTxn !== ""}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-white"
          >
            {waitingForTxn === "reset" ? <ClipLoader size={20} color="white" /> : "Reset"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
function getCounterFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields as { value: number; owner: string };
}
