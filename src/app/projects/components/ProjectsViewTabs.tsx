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
}

interface ProjectsViewTabsProps {
  projects: Project[];
}

export function ProjectsViewTabs({ projects }: ProjectsViewTabsProps) {
  return (
    <Tabs defaultValue="table" className="w-full mb-6 mt-8">
      <TabsList className="grid w-full grid-cols-3 rounded-full">
        <TabsTrigger
          value="table"
          className="flex items-center gap-2 rounded-full"
        >
          <Table className="w-4 h-4" />
          Table
        </TabsTrigger>
        <TabsTrigger
          value="cards"
          className="flex items-center gap-2 rounded-full"
        >
          <LayoutGrid className="w-4 h-4" />
          Cards
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="flex items-center gap-2 rounded-full"
        >
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
