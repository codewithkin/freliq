"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

type Project = {
  id: string;
  name: string;
  createdAt: string;
  totalTasks: number;
  inProgress: number;
  done: number;
  progress: number;
};

export const ProjectsList = () => {
  const { data, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects/list");
      if (!res.data) throw new Error("Failed to fetch projects");

      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-36" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">No projects found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Started {formatDistanceToNow(new Date(project.createdAt))} ago
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm">
              <span className="font-semibold">In Progress:</span>{" "}
              {project.inProgress}
              <br />
              <span className="font-semibold">Done:</span> {project.done}
              <br />
              <span className="font-semibold">Total Tasks:</span>{" "}
              {project.totalTasks}
            </div>
            <Progress value={project.progress} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
