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
        <article className="w-screen h-screen flex flex-col gap-2 items-center justify-center text-center">
          <Loader2 className="animate-spin" size={40} />
        </article>
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
