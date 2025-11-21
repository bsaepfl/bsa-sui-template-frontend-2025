import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import ClipLoader from "react-spinners/ClipLoader";
import { useMemo } from "react";
import { createCounterService } from "./services";
import { useNetworkVariable } from "./networkConfig";

export function CreateCounter({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const {
    mutate: signAndExecute,
    isSuccess,
    isPending,
  } = useSignAndExecuteTransaction();

  // Create counter service directly
  const suiClient = useSuiClient();
  const counterPackageId = useNetworkVariable("counterPackageId");
  const counterService = useMemo(
    () => createCounterService(suiClient, counterPackageId),
    [suiClient, counterPackageId]
  );

  function create() {
    console.log('creating tx')
    
    // Use service to create transaction
    const tx = counterService.createCounterTransaction();

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          // Use service to wait for transaction and get created object ID
          const createdObjectId = await counterService.waitForTransactionAndGetCreatedObject(digest);
          
          if (createdObjectId) {
            onCreated(createdObjectId);
          }
        },
      },
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-gray-900">Create New Counter</CardTitle>
        <CardDescription className="text-gray-600">
          Create a new counter that you can increment and reset. You'll be the owner of this counter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          size="lg"
          onClick={() => {
            create();
          }}
          disabled={isSuccess || isPending}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          {isSuccess || isPending ? <ClipLoader size={20} color="white" /> : "Create Counter"}
        </Button>
      </CardContent>
    </Card>
  );
}
