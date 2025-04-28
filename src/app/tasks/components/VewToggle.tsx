"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Grid3X3 } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "card";
  onViewChange: (view: "list" | "card") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => {
        if (value) onViewChange(value as "list" | "card");
      }}
      className="bg-muted rounded-md p-1"
    >
      <ToggleGroupItem value="list" aria-label="List View">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="card" aria-label="Card View">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
