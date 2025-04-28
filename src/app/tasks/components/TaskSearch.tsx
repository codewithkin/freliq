"use client";

import { Input } from "@/components/ui/input";

interface TaskSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function TaskSearch({ search, onSearchChange }: TaskSearchProps) {
  return (
    <div className="w-full max-w-sm mb-6">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
      />
    </div>
  );
}
