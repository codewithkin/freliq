"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/generated/prisma";
import { format } from "date-fns";
import { Check } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <div>No tasks found.</div>;
  }

  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-5 gap-4 p-4 font-semibold bg-muted text-muted-foreground">
        <div>Task</div>
        <div>Status</div>
        <div>Project</div>
        <div>Due Date</div>
        <div>Proof</div>
      </div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="grid grid-cols-5 gap-4 p-4 border-t items-center hover:bg-muted/50 transition"
        >
          <div>{task.title}</div>
          <div>
            <Badge variant={task.status === "done" ? "default" : "outline"}>
              {task.status}
            </Badge>
          </div>
          <div>{task.project.title ?? "-"}</div>
          <div>
            {task.dueDate ? (
              format(new Date(task.dueDate), "PPP")
            ) : (
              <p>Not Specified</p>
            )}
          </div>
          <div>
            {task.proof ? <Check className="text-primary" /> : <p>None</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
