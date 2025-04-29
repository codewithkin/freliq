// components/Task.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type TaskProps = {
  index: number;
  task: {
    title: string;
    description: string;
    dueDate: string;
  };
  updateTask: (index: number, field: string, value: string) => void;
};

function Task({ index, task, updateTask }: TaskProps) {
  return (
    <article className="mt-8 mb-12 flex flex-col gap-4">
      <article className="flex flex-col gap-2">
        <Label htmlFor={`title-${index}`}>Task Title</Label>
        <Input
          id={`title-${index}`}
          placeholder="Create the login page"
          value={task.title}
          onChange={(e) => updateTask(index, "title", e.target.value)}
        />
      </article>

      <article className="flex flex-col gap-2">
        <Label htmlFor={`description-${index}`}>Task Description</Label>
        <Textarea
          id={`description-${index}`}
          placeholder="Task details..."
          value={task.description}
          onChange={(e) => updateTask(index, "description", e.target.value)}
        />
      </article>

      <article className="flex flex-col gap-2">
        <Label htmlFor={`dueDate-${index}`}>Due Date</Label>
        <Input
          type="date"
          id={`dueDate-${index}`}
          value={task.dueDate}
          onChange={(e) => updateTask(index, "dueDate", e.target.value)}
        />
      </article>
    </article>
  );
}

export default Task;
