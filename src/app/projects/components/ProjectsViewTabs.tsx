"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Table } from "lucide-react";
import { ProjectsTableView } from "./views/ProjectsTableView";
import { ProjectsCardView } from "./views/ProjectsCardView";
import { ProjectsListView } from "./views/ProjectsListView";

interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  // Add any other fields you need
}

interface ProjectsViewTabsProps {
  value: string;
  onChange: (value: string) => void;
  projects: Project[];
}

export function ProjectsViewTabs({
  value,
  onChange,
  projects,
}: ProjectsViewTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="table" className="flex items-center gap-2">
          <Table className="w-4 h-4" />
          Table
        </TabsTrigger>
        <TabsTrigger value="cards" className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          Cards
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-2">
          <List className="w-4 h-4" />
          List
        </TabsTrigger>
      </TabsList>

      <TabsContent value="table">
        <ProjectsTableView projects={projects} />
      </TabsContent>
      <TabsContent value="cards">
        <ProjectsCardView projects={projects} />
      </TabsContent>
      <TabsContent value="list">
        <ProjectsListView projects={projects} />
      </TabsContent>
    </Tabs>
  );
}
