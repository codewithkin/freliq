import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

function UpgradePage() {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <article className="flex flex-col items-center justify-center p-4 md:p-8 gap-2 mb-8">
        <h3 className="font-semibold text-3xl text-center">Upgrade Plan</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Upgrade your plan to unlock more features and support on Freliq. It's
          as easy as ABC
        </p>
      </article>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <Tabs defaultValue="monthly" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Plans Grid */}
      <Tabs defaultValue="monthly">
        <article className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Free Tier */}
          <Card className="p-6 flex flex-col">
            <h4 className="font-medium text-lg">Free</h4>
            <p className="text-muted-foreground text-sm mb-4">
              For testing the platform
            </p>

            <div className="my-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <Button variant="outline" className="mt-auto">
              Current Plan
            </Button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">2 Active Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">30 Tasks/Month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">500MB Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">100 Messages/Month</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">❌ Video Calls</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">❌ Kickoff Checklists</span>
              </div>
            </div>
          </Card>

          {/* Basic Tier - Highlighted */}
          <Card className="p-6 flex flex-col border-2 border-primary relative">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-md">
              POPULAR
            </div>
            <h4 className="font-medium text-lg">Basic</h4>
            <p className="text-muted-foreground text-sm mb-4">
              For serious freelancers
            </p>

            <TabsContent value="monthly">
              <div className="my-4">
                <span className="text-3xl font-bold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </TabsContent>
            <TabsContent value="annual">
              <div className="my-4">
                <span className="text-3xl font-bold">$90</span>
                <span className="text-muted-foreground">/year</span>
                <span className="ml-2 text-sm text-green-500">(Save $18)</span>
              </div>
            </TabsContent>

            <Button className="mt-auto bg-primary hover:bg-primary/90">
              Upgrade
            </Button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">10 Active Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">300 Tasks/Month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">5GB Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Unlimited Messages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">1:1 Video Calls (1hr limit)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Kickoff Checklists</span>
              </div>
            </div>
          </Card>

          {/* Pro Tier */}
          <Card className="p-6 flex flex-col">
            <h4 className="font-medium text-lg">Pro</h4>
            <p className="text-muted-foreground text-sm mb-4">
              For power users
            </p>

            <TabsContent value="monthly">
              <div className="my-4">
                <span className="text-3xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </TabsContent>
            <TabsContent value="annual">
              <div className="my-4">
                <span className="text-3xl font-bold">$190</span>
                <span className="text-muted-foreground">/year</span>
                <span className="ml-2 text-sm text-green-500">(Save $38)</span>
              </div>
            </TabsContent>

            <Button variant="outline" className="mt-auto">
              Upgrade
            </Button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Unlimited Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Unlimited Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">50GB Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Unlimited Messages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Unlimited Video Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">AI Checklist Templates</span>
              </div>
            </div>
          </Card>
        </article>
      </Tabs>
    </section>
  );
}

export default UpgradePage;
