"use client";

import {
  ClipboardList,
  FileText,
  ListChecks,
  Notebook,
  PieChart,
} from "lucide-react";
import { DashboardStatCard } from "../DashboardStatCard";

interface Props {
  user: any; // Ideally, type this properly
}

export default function FreelancerDashboard({ user }: Props) {
  const cards = [
    {
      title: "projects",
      count: user?.projects?.length ?? 0,
      icon: Notebook,
      className: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
    {
      title: "polls",
      count: user?.polls?.length ?? 0,
      icon: PieChart,
      className: "bg-blue-600",
    },
    {
      title: "tasks",
      count: user?.tasks?.length ?? 0,
      icon: ClipboardList,
      className: "bg-green-600",
    },
    {
      title: "files",
      count: user?.files?.length ?? 0,
      icon: FileText,
      className: "bg-yellow-500",
    },
    {
      title: "checklists",
      count: user?.checklists?.length ?? 0,
      icon: ListChecks,
      className: "bg-neutral-800",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <h2>freelancer dash</h2>
    </section>
  );
}
