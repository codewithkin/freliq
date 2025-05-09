"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import DashboardShell from "./components/DashboardShell";
import DashboardStats from "./components/DashboardStats";
import FreelancerDashboard from "./components/freelancer/FreelancerDashboard";
import ClientDashboard from "./components/client/ClientDashboard";

function DashboardPage() {
  const { data: user, isPending } = useQuery({
    queryKey: ["full-user"],
    queryFn: async () => {
      const res = await axios.get(`/api/user`);
      return res.data.fullUser;
    },
  });

  return (
    <article className="">
      {isPending ? (
        <section className="w-screen h-screen flex items-center justify-center bg-muted/40 animate-pulse">
          <div className="bg-background p-6 rounded-2xl shadow-xl border w-[320px] flex flex-col items-center gap-4 text-center">
            <Loader2 className="text-primary animate-spin" size={48} />
            <h2 className="text-lg font-semibold text-foreground">
              Just a moment...
            </h2>
            <p className="text-sm text-muted-foreground">
              We're getting your dashboard ready. Hang tight!
            </p>
          </div>
        </section>
      ) : (
        <DashboardShell>
          <DashboardStats user={user} />
          {user?.type === "freelancer" ? (
            <FreelancerDashboard user={user} />
          ) : (
            <ClientDashboard user={user} />
          )}
        </DashboardShell>
      )}
    </article>
  );
}

export default DashboardPage;
