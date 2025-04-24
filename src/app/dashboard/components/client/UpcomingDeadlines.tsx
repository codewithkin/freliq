"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, isBefore, addDays, parseISO } from "date-fns";
import { CalendarDays, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
  id: string;
  title: string;
  deadline: string;
};

type Task = {
  id: string;
  title: string;
  dueDate: string;
  project: { title: string };
};

type Checklist = {
  id: string;
  title: string;
  project: { title: string };
};

type DeadlinesResponse = {
  projects: Project[];
  tasks: Task[];
  checklists: Checklist[];
};

const isUpcoming = (dateString: string) => {
  const date = parseISO(dateString);
  const now = new Date();
  const sevenDaysFromNow = addDays(now, 7);
  return isBefore(date, sevenDaysFromNow) && isBefore(now, date);
};

const SkeletonCard = () => (
  <Card className="animate-pulse space-y-2">
    <CardHeader>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-2/3 mt-2" />
    </CardHeader>
  </Card>
);

export default function UpcomingDeadlines() {
  const { data, isLoading, isError } = useQuery<DeadlinesResponse>({
    queryKey: ["upcoming-deadlines"],
    queryFn: async () => {
      const res = await axios.get("/api/deadlines/upcoming");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <section className="space-y-6 mt-8">
        <h2 className="text-xl font-bold text-gray-800">
          📅 Upcoming Deadlines & Milestones
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-red-600">Failed to load upcoming deadlines. 😢</p>
    );
  }

  const upcomingProjects = data.projects;
  const upcomingTasks = data.tasks;
  return (
    <section className="space-y-6 mt-8">
      <h2 className="text-xl font-bold text-gray-800">
        📅 Upcoming Deadlines & Milestones
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {upcomingProjects.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-blue-500/30 border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <CalendarDays className="h-4 w-4" />
                  {p.title}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Deadline: {format(new Date(p.deadline), "PPP")}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}

        {upcomingTasks.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-green-500/30 border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <ClipboardList className="h-4 w-4" />
                  {t.title}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Due: {format(new Date(t.dueDate), "PPP")} — {t.project.title}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
