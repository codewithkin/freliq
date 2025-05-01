"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFiltersProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export function TaskFilters({ status, onStatusChange }: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="inprogress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
