"use client";
import { CallToAction } from "@/components/landing/cta";
import { FeaturesSection } from "@/components/landing/Features";
import { LandingHeader } from "@/components/landing/header";
import { HowItWorksTimeline } from "@/components/landing/how-it-works";
import { LandingNav } from "@/components/landing/nav";
import { PricingSection } from "@/components/landing/pricing";
import { authClient } from "@/lib/auth-client";

function Home() {
  // Make sure the user is logged in
  const {
    data: session,
    isPending, //loading state
  } = authClient.useSession();

  return (
    <>
      <LandingNav />
      <LandingHeader />
      <FeaturesSection />
      <HowItWorksTimeline />
      <PricingSection />
      <CallToAction />
    </>
  );
}

export default Home;
