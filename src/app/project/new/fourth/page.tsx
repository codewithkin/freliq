"use client";
import { useState } from "react";
import FlowContainer from "../components/FlowContainer";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Sidebar } from "lucide-react";
import { useNewProjectData } from "@/stores/useNewProjectData";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Link from "next/link";

export default function NewProjectPage() {
  // Get the project's id
  const projectId = useNewProjectData((state) => state.data.id);

  // Get the user's id
  const { data } = authClient.useSession();

  const userId = data?.user?.id;

  const [created, setCreated] = useState<boolean>(false);

  // Track task field values
  const router = useRouter();

  // Get the user's data
  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axios.get("/api/user");

      return res.data.fullUser;
    },
  });

  const isFreelancer = user?.type == "Freelancer";

  // Get the necessary update functions
  const setTitle = useNewProjectData((state) => state.setTitle);
  const setDescription = useNewProjectData((state) => state.setDescription);
  const setDeadline = useNewProjectData((state) => state.setDeadline);

  // Get the necessary data
  const title = useNewProjectData((state) => state.data.title);
  const description = useNewProjectData((state) => state.data.description);
  const deadline = useNewProjectData((state) => state.data.deadline);

  // Get the clear function
  const clear = useNewProjectData((state) => state.clear);

  // Store the project id in state in case it gets cleared after calling the above function
  const [projectID, setProjectID] = useState(projectId);

  // Create task mutation
  const { mutate: createTask, isPending: creatingTask } = useMutation({
    mutationKey: ["createTask"],
    mutationFn: async () => {
      const res = await axios.post("/api/task", {
        title,
        description,
        dueDate: deadline,
        projectId,
      });

      return res.data.newTask;
    },
    onSuccess: () => {
      toast.success(`Task created successfully`);

      setCreated(true);

      // Clear the local project state
      clear();
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
      disabled={!created || creatingTask}
    >
      {created ? (
        <article className="flex flex-col gap-2 items-center justify-center">
          <article className="p-4 rounded-full bg-secondary text-primary">
            <Check size={64} />
          </article>
          <article>
            <h2 className="font-semibold text-xl text-center">
              Project created successfully
            </h2>
            <p className="text-muted-foreground text-center">
              Nice work ! This project has been created and you've <br /> added
              your first task
            </p>
          </article>
          <article className="flex gap-2 items-center">
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <Sidebar /> Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/project/${projectID}`}>View project</Link>
            </Button>
          </article>
        </article>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-6 w-full max-h-[400px] overflow-y-auto"
        >
          <article className="space-y-6 w-full">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                placeholder="e.g Freliq mobile app"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="min-w-1/3"
                placeholder="This is the mobile app for Freliq, a project owned by me (Kin) and being undertaken by John Doe"
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Deadline</Label>
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                className="rounded-md border w-full"
              />
              {deadline && (
                <p className="text-sm text-muted-foreground">
                  Selected: {format(deadline, "PPP")}
                </p>
              )}
            </div>
          </article>

          <Button
            disabled={creatingTask}
            onClick={() => {
              createTask();
            }}
            type="button"
            variant="secondary"
          >
            {creatingTask && <Loader2 className="animate-spin" />}
            {creatingTask ? "Creating Task..." : "Create Task"}
          </Button>
        </form>
      )}
    </FlowContainer>
  );
}
