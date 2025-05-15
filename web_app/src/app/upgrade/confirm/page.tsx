"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function UpgradeConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subscriptionId = searchParams.get("subscription_id");
  const status = searchParams.get("status");

  useEffect(() => {
    if (subscriptionId && status === "active") {
      const searchPlan = window.sessionStorage.getItem("selectedPlan");
      if (searchPlan) {
        fetch("/api/upgrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan: searchPlan, subscriptionId }),
        })
          .then((response) => {
            if (response.ok) {
              toast("Upgrade Successful!", {
                description: `You have successfully upgraded to the ${searchPlan} plan.`,
              });
            } else {
              toast("Upgrade Failed", {
                description: "There was an error upgrading your plan.",
              });
            }
          })
          .catch(() => {
            toast("Upgrade Failed", {
              description: "There was a network error during upgrade.",
            });
          })
          .finally(() => {
            window.sessionStorage.removeItem("selectedPlan");
          });
      } else {
        toast("Upgrade Error", {
          description: "Could not determine the selected plan.",
        });
      }
    } else if (subscriptionId && status !== "active") {
      toast("Payment Issue", {
        description: `Your payment was not successful. Status: ${status}`,
      });
    } else if (!subscriptionId) {
      toast("Invalid Request", {
        description: "Invalid upgrade confirmation link.",
      });
    }
  }, [subscriptionId, status]);

  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">
        {status === "active" ? "Upgrade Confirmation" : "Payment Status"}
      </h2>
      {status === "active" ? (
        <>
          <p className="text-muted-foreground">
            Your upgrade is being processed.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground">
            There was an issue with your payment. Please try again or contact
            support.
          </p>
          <Button variant="outline" onClick={() => router.push("/upgrade")}>
            Back to Upgrade Plans
          </Button>
        </>
      )}
    </div>
  );
}

export default UpgradeConfirmPage;
