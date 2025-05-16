"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, ArrowUpRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data.fullUser;
    },
  });

  const planFeatures = {
    free: ["2 Active Projects", "30 Tasks/Month", "500MB Storage"],
    basic: ["10 Projects", "500 Tasks/Month", "10GB Storage"],
    pro: ["Unlimited Projects", "Unlimited Tasks", "50GB Storage"],
  };

  const currentPlan = user?.plan?.toLowerCase() || "free";
  const features = planFeatures[currentPlan] || planFeatures.free;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto space-y-6 min-h-screen flex flex-col justify-center items-center">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your Current Plan</h1>
        <p className="text-muted-foreground">
          {currentPlan === "pro"
            ? "You're enjoying our highest tier"
            : "Upgrade anytime to unlock more features"}
        </p>
      </div>

      <Card className="md:min-w-md min-w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="capitalize">{currentPlan} Plan</span>
            <Badge variant="outline" className="text-sm">
              {currentPlan === "pro" ? "Premium" : "Current"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {currentPlan !== "pro" && (
            <div className="pt-6 border-t">
              <Button asChild className="w-full gap-2">
                <Link href="/upgrade">
                  Explore Upgrades
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
