"use client";

import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import "../../../globals.css"; // Ensure your Tailwind CSS is loaded
import { Skeleton } from "@/components/ui/skeleton";

// Fetch tasks from the backend using React Query
const fetchTasks = async () => {
  const response = await fetch("/api/tasks");
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

const TasksKanban = () => {
  // Fetch tasks using the useQuery hook
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Card template with custom Tailwind styles
  const cardTemplate = (props: any) => {
    return (
      <div className="bg-white border-l-4 border-yellow-500 p-3 rounded shadow-sm hover:shadow-md transition duration-200">
        <h5 className="text-primary font-semibold">#{props.id}</h5>
        <p className="text-gray-700 mt-1">{props.title}</p>
        <div className="text-xs text-gray-500 mt-2 flex justify-between">
          <span>{props.status}</span>
          <span>{props.assignee?.name}</span>
        </div>
      </div>
    );
  };

  // Organize tasks by their status
  const tasksByStatus = {
    TODO: tasks?.filter((task: any) => task.status === "TODO") || [],
    IN_PROGRESS:
      tasks?.filter((task: any) => task.status === "IN_PROGRESS") || [],
    TESTING: tasks?.filter((task: any) => task.status === "TESTING") || [],
    DONE: tasks?.filter((task: any) => task.status === "DONE") || [],
    VALIDATE: tasks?.filter((task: any) => task.status === "VALIDATE") || [],
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-4">
        <KanbanComponent id="kanban" keyField="status" dataSource={[]}>
          <ColumnsDirective>
            <ColumnDirective headerText="To Do" keyField="TODO" />
            <ColumnDirective headerText="In Progress" keyField="IN_PROGRESS" />
            <ColumnDirective headerText="Testing" keyField="TESTING" />
            <ColumnDirective headerText="Done" keyField="DONE" />
            <ColumnDirective headerText="Validate" keyField="VALIDATE" />
          </ColumnsDirective>
        </KanbanComponent>

        {/* Skeleton loaders for each column */}
        <div className="flex gap-4 p-4">
          {["TODO", "IN_PROGRESS", "TESTING", "DONE", "VALIDATE"].map(
            (status) => (
              <div key={status} className="w-1/5">
                <Skeleton className="w-full h-40 mb-4" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6 mt-2" />
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading tasks.</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <KanbanComponent
        id="kanban"
        keyField="status"
        dataSource={tasks}
        cardSettings={{
          contentField: "title",
          headerField: "id",
          template: cardTemplate,
        }}
      >
        <ColumnsDirective>
          <ColumnDirective headerText="To Do" keyField="TODO" />
          <ColumnDirective headerText="In Progress" keyField="IN_PROGRESS" />
          <ColumnDirective headerText="Testing" keyField="TESTING" />
          <ColumnDirective headerText="Done" keyField="DONE" />
          <ColumnDirective headerText="Validate" keyField="VALIDATE" />
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

export default TasksKanban;
