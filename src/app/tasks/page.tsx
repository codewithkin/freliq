"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TaskSummaryCards } from "./components/TaskSummaryCards";
import { TaskFilters } from "./components/TaskFilters";
import { TaskSearch } from "./components/TaskSearch";
import { TaskList } from "./components/TaskList";
import { TaskEmptyState } from "./components/TaskEmptyState";
import { CreateTaskButton } from "./components/CreateTaskButton";
import { Pagination } from "@/components/ui/pagination"; // Shadcn Pagination
import DashboardShell from "../dashboard/components/DashboardShell";
import { ViewToggle } from "./components/VewToggle";
import { TaskCardGrid } from "./components/TaskCardGrid";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/tasks");
      return res.data;
    },
  });

  const filteredTasks = tasks.filter((task: any) => {
    const matchesStatus =
      status === "all" ||
      (status === "todo" && task.status === "TODO") ||
      (status === "inprogress" && task.status === "IN_PROGRESS") ||
      (status === "done" && task.status === "DONE");
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t: any) => t.status === "DONE").length,
    inProgress: tasks.filter((t: any) => t.status === "IN_PROGRESS").length,
    overdue: tasks.filter(
      (t: any) => t.dueDate && new Date(t.dueDate) < new Date(),
    ).length,
  };

  const pageCount = Math.ceil(filteredTasks.length / itemsPerPage);

  return (
    <DashboardShell>
      <TaskSummaryCards {...stats} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-4">
          <TaskFilters
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1); // Reset to page 1 when filter changes
            }}
          />
          <ViewToggle view={viewMode} onViewChange={setViewMode} />
        </div>
        <TaskSearch
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1); // Reset to page 1 when search changes
          }}
        />
      </div>

      {paginatedTasks.length > 0 ? (
        viewMode === "list" ? (
          <TaskList tasks={paginatedTasks} />
        ) : (
          <TaskCardGrid tasks={paginatedTasks} />
        )
      ) : (
        <TaskEmptyState onCreateTask={() => {}} />
      )}

      {pageCount > 1 && (
        <div className="mt-6">
          <Pagination
            page={page}
            totalPages={pageCount}
            onPageChange={setPage}
          />
        </div>
      )}

      <CreateTaskButton />
    </DashboardShell>
  );
}
