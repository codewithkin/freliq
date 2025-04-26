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
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format, formatDate } from "date-fns";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

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
      toast.success("Tasks status updated");
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
      <Card className="bg-white border-l-4 border-yellow-500 p-2 transition duration-200">
        <CardContent className="p-4">
          <CardTitle className="text-primary text-lg font-semibold">
            {props.title}
          </CardTitle>
          <p className="text-gray-700">{props.description}</p>
          <div className="text-xs text-gray-500 mt-2 flex justify-between">
            <Badge
              className={`text-xs font-regular ${
                props.status === "DONE"
                  ? "bg-green-500 text-white"
                  : props.status === "TODO"
                    ? "bg-slate-400 text-black"
                    : props.status === "IN_PROGRESS"
                      ? "bg-yellow-500 text-black"
                      : props.status === "AWAITING_VALIDATION"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
              }`}
            >
              {props.status}
            </Badge>
            <span>{props.assignee?.name}</span>
          </div>
          <p className="text-slate-500">
            Due {format(new Date(props.dueDate), "MMM d, yyyy")}
          </p>

          {/* Action buttons */}
          <CardFooter className="px-0 flex gap-2">
            {/* View more details */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size={
                      props.status == "AWAITING_VALIDATION" ? "icon" : "default"
                    }
                    asChild
                  >
                    <Link href={`/task/${props.id}`}>
                      <Eye />
                      {props.status !== "AWAITING_VALIDATION" && (
                        <span>View details</span>
                      )}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View task details</p>
                </TooltipContent>
              </Tooltip>

              {/* Approve / Reject btns */}
              {props.status == "AWAITING_VALIDATION" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="text-xs"
                        onClick={() => {
                          mutation.mutateAsync({
                            taskId: props.id,
                            newStatus: "DONE",
                          });
                        }}
                        disabled={mutation.isPending}
                        variant="default"
                      >
                        {mutation.isPending && (
                          <Loader2 className="animate-spin" />
                        )}
                        Approve
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Approve task</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="text-xs"
                        onClick={() => {
                          mutation.mutateAsync({
                            taskId: props.id,
                            newStatus: "REJECTED",
                          });
                        }}
                        disabled={mutation.isPending}
                        variant="destructive"
                      >
                        {mutation.isPending && (
                          <Loader2 className="animate-spin" />
                        )}
                        Reject
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-red-500 text-white">
                      <p>Reject task</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </TooltipProvider>
          </CardFooter>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-4">
        <KanbanComponent id="kanban" keyField="status" dataSource={[]}>
          <ColumnsDirective>
            <ColumnDirective headerText="To Do" keyField="TODO" />
            <ColumnDirective headerText="In Progress" keyField="IN_PROGRESS" />
            <ColumnDirective
              headerText="Testing"
              keyField="AWAITING_VALIDATION"
            />
            <ColumnDirective headerText="Rejected" keyField="REJECTED" />
            <ColumnDirective headerText="Done" keyField="DONE" />
          </ColumnsDirective>
        </KanbanComponent>
        <div className="flex gap-4 p-4">
          {[
            "TODO",
            "IN_PROGRESS",
            "AWAITING_VALIDATION",
            "DONE",
            "REJECTED",
          ].map((status) => (
            <div key={status} className="w-1/5">
              <Skeleton className="w-full h-40 mb-4" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading tasks.</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <div className=" overflow-x-auto no-scrollbar">
        <div className="min-w-[800px] w-fit">
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
              <ColumnDirective
                headerText="In Progress"
                keyField="IN_PROGRESS"
              />
              <ColumnDirective
                headerText="Awaiting Validation"
                keyField="AWAITING_VALIDATION"
              />
              <ColumnDirective headerText="Rejected" keyField="REJECTED" />
              <ColumnDirective headerText="Done" keyField="DONE" />
            </ColumnsDirective>
          </KanbanComponent>
        </div>
      </div>

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
