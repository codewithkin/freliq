"use client";
import { LandingHeader } from "@/components/landing/header";
import { LandingNav } from "@/components/landing/nav";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

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
    </>
  );
}

export default Home;
