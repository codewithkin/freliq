"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Project = {
  id: string;
  status: "ACTIVE" | "DONE" | "REJECTED" | string;
};

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects/list");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export function MiniProjectStatsCard() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const total = projects?.length || 0;
  const active = projects?.filter((p) => p.status === "ACTIVE").length || 0;
  const completed =
    projects?.filter((p) => p.status === "COMPLETED").length || 0;
  const rejected = projects?.filter((p) => p.status === "REJECTED").length || 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Project Stats</CardTitle>
        <p className="text-sm text-muted-foreground">Quick overview</p>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <Stat label="Total" value={total} color="text-foreground" />
            <Stat label="Active" value={active} color="text-green-500" />
            <Stat label="Completed" value={completed} color="text-blue-500" />
            <Stat label="Rejected" value={rejected} color="text-red-500" />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
