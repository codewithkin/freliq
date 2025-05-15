"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  ZapIcon,
  StarIcon,
  CheckCheck,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const DODO_PAYMENTS_TEST_URL = "https://test.checkout.dodopayments.com/buy/";

function UpgradePage() {
  const router = useRouter();

  const monthlyPlans = [
    {
      name: "Free",
      price: 0,
      description:
        "Get started and see the magic happen. Perfect for trying things out.",
      features: [
        "2 Active Projects",
        "30 Tasks/Month",
        "500MB Storage",
        "100 Messages",
        "❌ Video Calls",
        "❌ Checklists",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline",
      buttonClassName: "border-muted-foreground/30",
    },
    {
      name: "Basic",
      price: 15,
      description:
        "Unlock essential tools to streamline your workflow and boost your productivity.",
      features: [
        "10 Active Projects",
        "500 Tasks/Month",
        "10GB Storage",
        "Unlimited Messages",
        "1:1 Video Calls (2hr limit)",
        "Kickoff Checklists",
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "default",
      buttonClassName: "bg-primary hover:bg-primary/90 shadow-md",
      highlighted: true,
      highlightLabel: "Best Value",
      highlightIcon: (
        <StarIcon className="w-7 h-7 text-blue-700 fill-blue-700" />
      ),
      productId: "pdt_SJtB93eSf3ZbvOwo3elq2", // Monthly Basic Product ID
    },
    {
      name: "Pro",
      price: 30,
      description:
        "Supercharge your solo performance with unlimited power and advanced features.",
      features: [
        "Unlimited Projects",
        "Unlimited Tasks",
        "50GB Storage",
        "Unlimited Messages",
        "Unlimited Video Calls",
        "AI Checklist Templates",
      ],
      buttonText: "Go Pro",
      buttonVariant: "outline",
      buttonClassName: "border-primary/50 text-primary hover:bg-primary/5",
      productId: "pdt_hwEWNQB5mbTSelZJoMD47", // Monthly Pro Product ID
    },
  ];

  const annualPlans = [
    {
      name: "Free",
      price: 0,
      description:
        "Dip your toes in and experience the core features. No commitment needed.",
      features: [
        "2 Active Projects",
        "30 Tasks/Month",
        "500MB Storage",
        "100 Messages",
        "❌ Video Calls",
        "❌ Checklists",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline",
      buttonClassName: "border-muted-foreground/30",
    },
    {
      name: "Basic",
      price: 126, // $15 * 12 * (1 - 0.3)
      discountPercentage: 30,
      description:
        "Smart investment for serious freelancers. Get all the essentials and save big!",
      features: [
        "10 Active Projects",
        "500 Tasks/Month",
        "10GB Storage",
        "Unlimited Messages",
        "1:1 Video Calls (2hr limit)",
        "Kickoff Checklists",
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "default",
      buttonClassName: "bg-primary hover:bg-primary/90 shadow-md",
      highlighted: true,
      highlightLabel: "BEST VALUE",
      highlightIcon: (
        <StarIcon className="w-5 h-5 text-primary, fill-primary" />
      ),
      monthlyPrice: 15,
      productId: "pdt_gaKZJsk8YZOfR5nJd3e7h", // Annual Basic Product ID
    },
    {
      name: "Pro",
      price: 180, // $30 * 12 * (1 - 0.5)
      discountPercentage: 50,
      description:
        "Maximize your potential and dominate your projects. The ultimate toolkit for peak performance.",
      features: [
        "Unlimited Projects",
        "Unlimited Tasks",
        "50GB Storage",
        "Unlimited Messages",
        "Unlimited Video Calls",
        "AI Checklist Templates",
      ],
      buttonText: "Go Pro",
      buttonVariant: "outline",
      buttonClassName: "border-primary/50 text-primary hover:bg-primary/5",
      monthlyPrice: 30,
      productId: "pdt_hqUsbqoyac4cA3aWIsiyE", // Annual Pro Product ID
    },
  ];

  const createPaymentLink = (productId: string) => {
    if (productId) {
      const redirectUrl = encodeURIComponent(
        `${NEXT_PUBLIC_APP_URL}/upgrade/confirm`,
      );
      return `${DODO_PAYMENTS_TEST_URL}${productId}?quantity=1&redirect_url=${redirectUrl}`;
    }
    return "#"; // Or handle the case where productId is missing
  };

  const handleUpgradeClick = (
    planName: string,
    productId: string | undefined,
  ) => {
    if (productId) {
      window.sessionStorage.setItem("selectedPlan", planName.toLowerCase());
      window.location.href = createPaymentLink(productId);
    } else if (planName !== "Free") {
      toast({
        title: "Error",
        description: "Could not initiate payment for this plan.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="container mx-auto px-4 py-12 bg-gradient-to-b from-muted/10 to-background">
      {/* Header */}
      <article className="flex flex-col items-center justify-center gap-3 mb-12 text-center">
        <h3 className="font-bold text-4xl tracking-tight">
          Upgrade Your Workflow
        </h3>
        <p className="text-muted-foreground max-w-lg">
          Choose the plan that fits your freelance business.{" "}
          <span className="text-primary font-medium">
            Annual plans offer significant savings
          </span>
          .
        </p>
      </article>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-10">
        <Tabs defaultValue="monthly" className="w-fit">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 h-12">
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <span className="font-medium">Monthly</span>
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm relative"
            >
              <span className="font-medium">Annual</span>
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                Save up to 50%
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            className="grid md:grid-cols-3 md:gap-8 gap-4 md:p-8 p-4"
            value="monthly"
          >
            {/* Map the monthly plans */}
            {monthlyPlans.map((plan, index: number) => (
              <Card
                className={`relative ${plan.highlighted ? "shadow-lg border-2 border-blue-700" : ""}`}
                key={index}
              >
                {/* Highlighted badge */}
                {plan.highlighted && (
                  <Badge
                    className="flex font-medium items-center absolute top-4 right-4 rounded-full border text-blue-700 border-blue-700"
                    variant="outline"
                  >
                    {plan?.highlightIcon}
                    {plan.highlightLabel}
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Prices and CTA */}
                  <article className="flex flex-col gap-8">
                    <h4 className="text-5xl font-semibold">
                      ${plan.price}{" "}
                      <span className="text-muted-foreground text-sm">
                        /month
                      </span>
                    </h4>
                    <Button
                      className={plan.buttonClassName}
                      variant={plan.buttonVariant}
                      onClick={() =>
                        handleUpgradeClick(plan.name, plan.productId)
                      }
                      disabled={plan.name === "Free"}
                    >
                      {plan.buttonText}
                    </Button>
                  </article>

                  <Separator className="text-slate-400 w-full h-1 my-8" />

                  {/* W's for the user */}
                  <article className="flex flex-col gap-4">
                    {plan.features.map((feature: string, index: number) => (
                      <article
                        className={`flex gap-2 items-center text-sm`}
                        key={index}
                      >
                        {!feature.includes("❌") && (
                          <CheckCircle strokeWidth={1.5} size={20} />
                        )}
                        {feature}
                      </article>
                    ))}
                  </article>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent
            className="grid md:grid-cols-3 md:gap-8 gap-4 md:p-8 p-4"
            value="annual"
          >
            {/* Map the annual plans */}
            {annualPlans.map((plan, index: number) => (
              <Card
                className={`relative ${plan.highlighted ? "shadow-lg border-2 border-blue-700" : ""}`}
                key={index}
              >
                {/* Highlighted badge */}
                {plan.highlighted && (
                  <Badge
                    className="flex font-medium items-center absolute top-4 right-4 rounded-full border text-blue-700 border-blue-700"
                    variant="outline"
                  >
                    {plan?.highlightIcon}
                    {plan.highlightLabel}
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Prices and CTA */}
                  <article className="flex flex-col gap-8">
                    <h4 className="text-5xl font-semibold">
                      ${plan.price}{" "}
                      <span className="text-muted-foreground text-sm">
                        /year
                      </span>
                      {plan.discountPercentage > 0 && plan.monthlyPrice && (
                        <Badge className="ml-2 text-xs bg-green-500 rounded-full font-medium">
                          Save $
                          {Math.round(plan.monthlyPrice * 12 - plan.price)} (
                          {plan.discountPercentage}%)
                        </Badge>
                      )}
                    </h4>
                    <Button
                      className={plan.buttonClassName}
                      variant={plan.buttonVariant}
                      onClick={() =>
                        handleUpgradeClick(plan.name, plan.productId)
                      }
                      disabled={plan.name === "Free"}
                    >
                      {plan.buttonText}
                    </Button>
                  </article>

                  <Separator className="text-slate-400 w-full h-1 my-8" />

                  {/* W's for the user */}
                  <article className="flex flex-col gap-4">
                    {plan.features.map((feature: string, index: number) => (
                      <article
                        className={`flex gap-2 items-center text-sm font-semibold`}
                        key={index}
                      >
                        {!feature.includes("❌") && (
                          <CheckCircle strokeWidth={1.5} size={20} />
                        )}
                        {feature}
                      </article>
                    ))}
                  </article>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default UpgradePage;
