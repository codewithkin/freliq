"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import axios from "axios";

type Task = {
  status: string;
};

type Project = {
  id: string;
  title: string;
  createdAt: string;
  deadline: string;
  files: string[];
  tasks: Task[];
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
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-20" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">No projects found.</p>;
  }

  return (
    <Card className="overflow-x-auto">
      <CardContent className="p-0">
        <div className="min-w-full divide-y divide-border">
          {/* Header Row */}
          <div className="grid grid-cols-6 text-xs uppercase text-muted-foreground bg-muted px-4 py-2 font-medium">
            <div>Project</div>
            <div>Created</div>
            <div>Deadline</div>
            <div>Files</div>
            <div>Tasks</div>
            <div>Progress</div>
          </div>

          {/* Data Rows */}
          {data.map((project) => {
            const totalTasks = project.tasks.length;
            const incompleteTasks = project.tasks.filter(
              (t) => t.status !== "done",
            ).length;
            const progress =
              totalTasks > 0 ? (incompleteTasks / totalTasks) * 100 : 0;

            return (
              <div
                key={project.id}
                className="grid grid-cols-6 items-center px-4 py-3 text-sm hover:bg-muted/50 transition"
              >
                <div className="font-medium">{project.title}</div>
                <div>{format(new Date(project.createdAt), "MMM d, yyyy")}</div>
                <div>{format(new Date(project.deadline), "MMM d, yyyy")}</div>
                <div>
                  <Badge variant="secondary">{project.files.length}</Badge>
                </div>
                <div>
                  {incompleteTasks} / {totalTasks}
                </div>
                <div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
