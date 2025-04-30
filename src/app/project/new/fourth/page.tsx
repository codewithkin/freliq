"use client";
import { useState } from "react";
import FlowContainer from "../components/FlowContainer";
import Task from "./components/Task";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNewProjectData } from "@/stores/useNewProjectData";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function NewProjectPage() {
  // Get the project's id
  const projectId = useNewProjectData((state) => state.data.id);

  // Get the user's id
  const { data } = authClient.useSession();

  const userId = data?.user?.id;

  const [created, setCreated] = useState<boolean>(false);
  const [tasks, setTasks] = useState([
    {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      projectId,
      project: {
        connect: {
          id: projectId,
        },
      },
      creator: {
        connect: {
          id: userId,
        },
      },
    },
  ]);

  const updateTask = (index: number, field: string, value: string) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  console.log("Tasks: ", tasks);

  // Create task mutation
  const { mutate: createTasks, isPending: creatingTasks } = useMutation({
    mutationKey: ["createTask"],
    mutationFn: async () => {
      const res = await axios.post("/api/tasks", { tasks });

      return res.data.newTask;
    },
    onSuccess: () => {
      toast.success(
        `${tasks.length > 0 ? "Tasks" : "Task"} created successfully`,
      );
    },
    onError: () => {
      toast.error(
        "An error occured while creating task...please try again later",
      );
    },
  });

  return (
    <FlowContainer
      title="Add your first task to the project"
      description="Add a task to kickstart this project..."
      disabled={!created || creatingTasks}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(tasks); // send to backend here
        }}
        className="space-y-6 w-full max-h-[400px] overflow-y-auto"
      >
        {tasks.map((task, index) => (
          <Task key={index} index={index} task={task} updateTask={updateTask} />
        ))}

        <div className="flex gap-2 items-center">
          <Button
            type="button"
            onClick={() =>
              setTasks([
                ...tasks,
                {
                  title: "",
                  description: "",
                  dueDate: new Date().toISOString().split("T")[0],
      projectId,
                  project: {
                    connect: {
                      id: projectId,
                    },
                  },
                  creator: {
                    connect: {
                      id: userId,
                    },
                  },
                },
              ])
            }
            variant="outline"
          >
            New Task <Plus />
          </Button>
          <Button
            disabled={creatingTasks}
            onClick={() => {
              createTasks();
            }}
            type="button"
            variant="secondary"
          >
            {creatingTasks && <Loader2 className="animate-spin" />}
            {creatingTasks ? "Creating Tasks..." : "Create Tasks"}
          </Button>
        </div>
      </form>
    </FlowContainer>
  );
}
