"use client";

import {
  ClipboardList,
  FileText,
  ListChecks,
  Notebook,
  PieChart,
} from "lucide-react";
import { DashboardStatCard } from "./DashboardStatCard";

interface Props {
  user: any;
}

export default function DashboardStats({ user }: Props) {
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
    <section className="w-full space-y-4">
      {/* Mobile: horizontal scroll only on the cards container */}
      <article className="block sm:hidden">
        <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
          <div className="flex gap-4 w-max px-4 py-2">
            {cards.map((card, index) => (
              <div key={index} className="min-w-[240px]">
                <DashboardStatCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Desktop: grid layout */}
      <article className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <DashboardStatCard key={index} {...card} />
        ))}
      </article>
    </section>
  );
}
