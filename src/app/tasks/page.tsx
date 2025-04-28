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

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/tasks/list");
      return res.data.tasks;
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

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t: any) => t.status === "DONE").length,
    inProgress: tasks.filter((t: any) => t.status === "IN_PROGRESS").length,
    overdue: tasks.filter(
      (t: any) => t.dueDate && new Date(t.dueDate) < new Date(),
    ).length,
  };

  return (
    <div className="container py-8">
      <TaskSummaryCards {...stats} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <TaskFilters status={status} onStatusChange={setStatus} />
        <TaskSearch search={search} onSearchChange={setSearch} />
      </div>
      {filteredTasks.length > 0 ? (
        <TaskList tasks={filteredTasks} />
      ) : (
        <TaskEmptyState onCreateTask={() => {}} />
      )}
      <CreateTaskButton />
    </div>
  );
}
