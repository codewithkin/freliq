"use client";

import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import "../../../globals.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Fetch tasks from the backend
const fetchTasks = async () => {
  const response = await fetch("/api/tasks");
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

// Update task status
// Update task status
const updateTaskStatus = async ({
  taskId,
  newStatus,
}: {
  taskId: string;
  newStatus: string;
}) => {
  const response = await fetch("/api/tasks/update-status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ id: taskId, status: newStatus }]),
  });
  if (!response.ok) {
    throw new Error("Failed to update task status");
  }
  return response.json();
};

const TasksKanban = () => {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Mutation for updating task status
  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Show a success toast
      toast.success("Tasks updated successfully");
    },
    onError: () => {
      toast.error("An error occured while updating tasks");
    },
  });

  const [isLoadingChange, setIsLoadingChange] = React.useState(false);
  const [changesMade, setChangesMade] = React.useState(false);
  const [modifiedTasks, setModifiedTasks] = React.useState<Map<string, string>>(
    new Map(),
  );

  // When a task is dragged and dropped to a new column
  const onTaskDragStop = (args: any) => {
    console.log("On task drag stop: ", args);
    const task = args.data[0];
    const targetColumn = args.event?.target?.closest("[data-key]");
    if (!targetColumn) return;

    const targetStatus = targetColumn.getAttribute("data-key");
    console.log("Task: ", task);
    console.log("Target status: ", targetStatus);
    if (task.status === targetStatus) {
      setModifiedTasks((prev) => {
        const newMap = new Map(prev);
        newMap.set(task.id, targetStatus);
        return newMap;
      });
      setChangesMade(true);
    }
  };

  // Save changes by mutating each modified task
  const saveChanges = async () => {
    setIsLoadingChange(true);
    for (const [taskId, newStatus] of modifiedTasks.entries()) {
      await mutation.mutateAsync({ taskId, newStatus });
    }
    setIsLoadingChange(false);
    setChangesMade(false);
    setModifiedTasks(new Map());
  };

  // Card UI
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
        dragStop={onTaskDragStop}
        allowDragAndDrop={true}
      >
        <ColumnsDirective>
          <ColumnDirective headerText="To Do" keyField="TODO" />
          <ColumnDirective headerText="In Progress" keyField="IN_PROGRESS" />
          <ColumnDirective headerText="Testing" keyField="TESTING" />
          <ColumnDirective headerText="Done" keyField="DONE" />
          <ColumnDirective headerText="Validate" keyField="VALIDATE" />
        </ColumnsDirective>
      </KanbanComponent>

      {changesMade && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={saveChanges} size="lg">
            {isLoadingChange ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {/* Spinner */}
      {isLoadingChange && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50 z-10">
          <article className="flex flex-col justify-center items-center text-center gap-2">
            <h2 className="text-center">Updating tasks...</h2>
            <Loader2 className="text-primary animate-spin" size={40} />
          </article>
        </div>
      )}
    </div>
  );
};

export default TasksKanban;
