"use client";
import { useQuery } from "@tanstack/react-query";
import DashboardShell from "../dashboard/components/DashboardShell";
import { ProjectsLineChart } from "./components/charts/ProjectsLineChart";
import axios from "axios";
import { ProjectsStatusPieChart } from "./components/charts/ProjectsStatusPieChart";

function ProjectsPage() {
  const { data: projects, isLoading: loading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects/list");
      if (!res.data) throw new Error("Failed to fetch projects");
      return res.data;
    },
  });

  console.log("Projects: ", projects);

  return (
    <DashboardShell>
      <h2 className="font-semibold text-2xl">Your Projects</h2>

      <article className="grid gap-4">
        {!loading && <ProjectsLineChart projects={projects || []} />}
        {!loading && <ProjectsStatusPieChart projects={projects || []} />}
      </article>
    </DashboardShell>
  );
}

export default ProjectsPage;
