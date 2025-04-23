"use client";
import { authClient } from "@/lib/auth-client";
import { Axis3DIcon, Loader2 } from "lucide-react";
import FreelancerDashboard from "./components/FreelancerDashboard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ClientDashboard from "./components/ClientDashboard";

function DashboardPage() {
  // Get the user's full data
  const { data: user, isPending } = useQuery({
    queryKey: ["full-user"],
    queryFn: async () => {
      const res = await axios.get(`/api/user`);

      return res.data.fullUser;
    },
  });

  return (
    <article className="w-full h-full">
      {isPending ? (
        <article className="w-screen h-screen flex flex-col gap-2 items-center justify-center text-center">
          <Loader2 className="animate-spin" size={40} />
        </article>
      ) : user?.type === "freelancer" ? (
        <FreelancerDashboard />
      ) : (
        <ClientDashboard />
      )}
    </article>
  );
}

export default DashboardPage;
