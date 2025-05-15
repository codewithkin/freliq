"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react"; // Import icons
import { cn } from "@/lib/utils"; // Utility for combining class names

function UpgradeConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const subscriptionId = searchParams.get("subscription_id");
  const status = searchParams.get("status");

  useEffect(() => {
    if (subscriptionId && status === "active") {
      // Payment succeeded, now update the user's plan in the database
      const selectedPlan = window.sessionStorage.getItem("selectedPlan");
      if (selectedPlan) {
        fetch("/api/upgrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: selectedPlan,
            subscriptionId: subscriptionId,
          }),
        })
          .then((response) => {
            if (response.ok) {
              setIsSuccess(true);
              setMessage(
                `You have successfully upgraded to the ${selectedPlan} plan.`,
              );
            } else {
              return response.json().then((data) => {
                // Parse the JSON body to get the error message
                const errorMessage = data?.error || "Failed to upgrade plan.";
                setIsSuccess(false);
                setMessage(errorMessage);
              });
            }
          })
          .catch(() => {
            setIsSuccess(false);
            setMessage("There was a network error during upgrade.");
          })
          .finally(() => {
            window.sessionStorage.removeItem("selectedPlan"); // Clean up session storage
          });
      } else {
        setIsSuccess(false);
        setMessage("Could not determine the selected plan.");
      }
    } else if (subscriptionId && status !== "active") {
      // Payment failed or other status
      setIsSuccess(false);
      setMessage(`Your payment was not successful. Status: ${status}`);
    } else if (!subscriptionId) {
      setIsSuccess(false);
      setMessage("Invalid upgrade confirmation link.");
    }
  }, [subscriptionId, status]);

  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        {isSuccess === null
          ? "Processing..."
          : isSuccess
            ? "Upgrade Successful"
            : "Upgrade Failed"}
      </h2>

      {isSuccess !== null && (
        <div
          className={cn(
            "p-4 rounded-lg border shadow-md w-full max-w-md",
            isSuccess
              ? "bg-green-100 border-green-400 text-green-800"
              : "bg-red-100 border-red-400 text-red-800",
          )}
        >
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-500" />
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      )}

      {isSuccess !== null && (
        <Button
          onClick={() => router.push(isSuccess ? "/dashboard" : "/upgrade")}
          className={cn(
            "w-full max-w-md",
            isSuccess
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600",
            "text-white",
          )}
        >
          {isSuccess ? "Go to Dashboard" : "Back to Upgrade Plans"}
        </Button>
      )}
    </div>
  );
}

export default UpgradeConfirmPage;
