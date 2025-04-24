"use client";

import {
  ClipboardList,
  FileText,
  ListChecks,
  Notebook,
  PieChart,
} from "lucide-react";
import TasksKanban from "./TasksKanban";
import { ProjectsList } from "./ProjectsList";

interface Props {
  user: any;
}

export default function ClientDashboard({ user }: Props) {
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
    <section className="my-8 max-w-screen">
      <TasksKanban />
      <ProjectsList />
    </section>
  );
}
