"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Table } from "lucide-react";

interface ProjectsViewTabsProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProjectsViewTabs({ value, onChange }: ProjectsViewTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="table" className="flex items-center gap-2">
          <Table className="w-4 h-4" />
          Table
        </TabsTrigger>
        <TabsContent value="table"></TabsContent>
        <TabsTrigger value="cards" className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          Cards
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-2">
          <List className="w-4 h-4" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
