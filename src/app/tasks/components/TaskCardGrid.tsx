"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  dueDate?: string;
  projectTitle?: string;
  proofUploaded?: boolean;
}

interface TaskCardGridProps {
  tasks: Task[];
}

export function TaskCardGrid({ tasks }: TaskCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle className="text-base">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={task.status === "DONE" ? "default" : "outline"}>
                {task.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Project:</span>
              <span>{task.projectTitle ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Due:</span>
              <span>
                {task.dueDate ? format(new Date(task.dueDate), "PPP") : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Proof:</span>
              <span>{task.proofUploaded ? "✅" : "—"}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
