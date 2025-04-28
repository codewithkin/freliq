"use client";

import { Button } from "@/components/ui/button";

interface TaskEmptyStateProps {
  onCreateTask: () => void;
}

export function TaskEmptyState({ onCreateTask }: TaskEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-2">
      <h2 className="text-2xl font-semibold">No tasks yet</h2>
      <p className="text-muted-foreground">
        Start by creating your first task.
      </p>
      <Button onClick={onCreateTask}>Create Task</Button>
    </div>
  );
}
