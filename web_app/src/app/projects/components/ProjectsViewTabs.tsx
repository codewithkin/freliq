"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Braces, LayoutGrid, List, Table } from "lucide-react";
import { ProjectsTableView } from "./views/ProjectsTableView";
import { ProjectsCardView } from "./views/ProjectsCardView";
import { ProjectsListView } from "./views/ProjectsListView";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaFileExcel } from "react-icons/fa";
import { queryClient } from "@/providers/QueryClientProvider";

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
  const [type, setType] = useState("json");

  const { isPending: converting, mutate: convert } = useMutation({
    mutationKey: ["convertedData"],
    mutationFn: async () => {
      const res = await axios.post(
        "/api/convert",
        { projects, type },
        {
          headers: {
            type: "json", // or "csv" depending on what you need
          },
          responseType: "blob", // Ensure we're receiving binary data
        },
      );

      return res.data;
    },
    onSuccess: (data) => {
      // Log the response to verify
      console.log("Downloaded data:", data);

      // Determine file name and type (based on the response type or header info)
      const fileType = data.type; // Assuming the type is correctly set
      const fileName =
        fileType === "application/json" ? "projects.json" : "projects.csv";

      // Create a blob from the response data
      const blob = new Blob([data], { type: fileType });

      // Create a temporary download link and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Set the file name dynamically
      link.click();

      toast.success("Downloaded file successfully");
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
      toast.error("Failed to download file");
    },
  });

  const { isPending: deletingProject, mutate: deleteProject } = useMutation({
    mutationKey: ["deleteProject"],
    mutationFn: async ({ id }: { id: any }) => {
      // Make a request to the delete endpoint
      const res = await axios.delete(`/api/project/${id}`);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    onError: (e) => {
      console.log("An error occured while deleting project: ", e);
      toast.error("Failed to delete project");
    },
  });

  console.log("Deleting project: ", deletingProject);

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

      <article className="w-full flex md:flex-row flex-col md:justify-between items-center mt-8 mb-4 gap-2 md:gap-0">
        <h2 className="text-slate-800 text-xl md:text-2xl font-semibold">
          Your projects views
        </h2>

        <article className="flex md:flex-row flex-col items-center gap-2 md:gap-4 w-full">
          <Button
            onClick={() => {
              setType("csv");
              convert();
            }}
            disabled={converting}
            size="sm"
            variant="default"
            className="w-full md:w-auto"
          >
            <FaFileExcel />
            <p>Download as CSV</p>
          </Button>
          <Button
            onClick={() => {
              setType("json");
              convert();
            }}
            disabled={converting}
            size="sm"
            variant="secondary"
            className="w-full md:w-auto"
          >
            <Braces />
            <p>Download as JSON</p>
          </Button>
        </article>
      </article>

      <TabsContent value="table">
        <ProjectsTableView
          deleteFn={deleteProject}
          deletingProject={deletingProject}
          projects={projects}
        />
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
