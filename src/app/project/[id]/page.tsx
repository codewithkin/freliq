"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import DashboardShell from "@/app/dashboard/components/DashboardShell";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { File, KickoffChecklist, Task } from "@/generated/prisma";

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    image?: string | null;
  };
  members: {
    user: {
      id: string;
      name: string;
      image?: string | null;
    };
  }[];
  tasks: {
    id: string;
    title: string;
    status: string;
    dueDate?: string | null;
  }[];
  files: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  checklists: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  chatRoom: {
    id: string;
  } | null;
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [feedback, setFeedback] = useState<string>("");

  const { data, isLoading, isPending } = useQuery({
    queryKey: ["project-with-user", id],
    queryFn: async () => {
      const [projectRes, userRes] = await Promise.all([
        axios.get(`/api/project/${id}`),
        axios.get(`/api/user`),
      ]);

      return {
        project: projectRes.data,
        user: userRes.data.fullUser,
      };
    },
    enabled: !!id,
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({
      taskId,
      status,
      feedback = "",
    }: {
      taskId: string;
      status: string;
      feedback?: string | null;
    }) => {
      await axios.patch(`/api/task/${taskId}/status`, { status, feedback });
    },
    onSuccess: () => {
      toast.success("Task status updated!");
      queryClient.invalidateQueries({ queryKey: ["project-with-user", id] });
    },
    onError: () => {
      toast.error("Failed to update task status");
    },
  });

  if (isLoading || isPending || !data?.project) {
    return <ProjectSkeleton />;
  }

  const project = data.project;
  const user = data.user;

  const isOwner = session?.user?.id === project.owner.id;
  const isFreelancer = user?.type === "freelancer";

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* Project Header */}
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <Badge variant="outline">{project.status}</Badge>
            {project.deadline && (
              <span>Deadline: {format(new Date(project.deadline), "PPP")}</span>
            )}
            <span>
              Last updated: {format(new Date(project.updatedAt), "PPP")}
            </span>
          </div>
        </div>
        <Separator />
        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle>Project Members</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[project.owner, ...project.members.map((m: any) => m.user)].map(
              (user) => (
                <div
                  key={user.id}
                  className="border rounded-md p-4 shadow-sm bg-muted/50 flex items-center gap-4"
                >
                  <Avatar className="bg-slate-500 w-8 h-8">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback className="text-primary">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.id === project.owner.id ? "Freelancer" : "Client"}
                    </p>
                  </div>
                </div>
              ),
            )}
          </CardContent>
        </Card>

        {/* Kickoff Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Kickoff Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.checklists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No checklist items yet.
              </p>
            ) : (
              project.checklists.map((item: KickoffChecklist) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-md p-3 bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn("h-4 w-4 rounded-full", {
                        "bg-green-500": item.completed,
                        "bg-red-500": !item.completed,
                      })}
                    />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <Badge
                    variant={item.completed ? "default" : "outline"}
                    className={cn({
                      "text-green-600": item.completed,
                      "text-red-600": !item.completed,
                    })}
                  >
                    {item.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {project.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tasks added yet.
              </p>
            ) : (
              [
                "TODO",
                "IN_PROGRESS",
                "AWAITING_REVIEW",
                "REJECTED",
                "DONE",
              ].map((status) => {
                const tasks = project.tasks.filter(
                  (task: Task) => task.status === status,
                );
                if (tasks.length === 0) return null;

                return (
                  <div key={status} className="space-y-4">
                    <Label className="text-base uppercase tracking-wider text-muted-foreground">
                      {status.replace("_", " ")}
                    </Label>

                    {tasks.map((task: Task) => (
                      <div
                        key={task.id}
                        className="border p-4 rounded-md bg-white hover:bg-muted/50"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Due:{" "}
                              {task.dueDate
                                ? format(new Date(task.dueDate), "PPP")
                                : "—"}
                            </p>
                          </div>
                          <Badge
                            className={cn({
                              "bg-green-100 text-green-700":
                                task.status === "DONE",
                              "bg-yellow-100 text-yellow-800":
                                task.status === "IN_PROGRESS",
                              "bg-red-100 text-red-700":
                                task.status === "REJECTED",
                              "bg-blue-100 text-blue-700":
                                task.status === "AWAITING_REVIEW",
                              "bg-gray-100 text-gray-800":
                                task.status === "TODO",
                            })}
                          >
                            {task.status}
                          </Badge>
                        </div>

                        {/* If not DONE and user is a client, show actions */}
                        {!isFreelancer && task.status !== "DONE" && (
                          <div className="mt-3 flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/tasks/${task.id}`)}
                            >
                              <Eye />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTaskStatus.mutate({
                                  taskId: task.id,
                                  status: "DONE",
                                });
                              }}
                            >
                              Approve
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  Disapprove
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <div className="space-y-4">
                                  <DialogTitle className="text-lg font-semibold">
                                    Please provide some feedback
                                  </DialogTitle>
                                  <DialogDescription className="text-sm text-muted-foreground">
                                    This will help the freelancer improve their
                                    work
                                  </DialogDescription>

                                  <article>
                                    <Textarea
                                      name="feedback"
                                      placeholder="I think you should..."
                                      value={feedback}
                                      onChange={(e) =>
                                        setFeedback(e.target.value)
                                      }
                                      className="resize-none"
                                    />
                                    <Button
                                      className="mt-2"
                                      variant="secondary"
                                      disabled={
                                        updateTaskStatus.isPending ||
                                        feedback.length === 0
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateTaskStatus.mutate({
                                          taskId: task.id,
                                          status: "REJECTED",
                                          feedback,
                                        });
                                      }}
                                    >
                                      {updateTaskStatus.isPending && (
                                        <Loader2 className="animate-spin" />
                                      )}
                                      {updateTaskStatus.isPending
                                        ? "Submitting..."
                                        : "Reject and Send Feedback"}
                                    </Button>
                                  </article>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
        {/* Files + Chat Link */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.files.map((file: File) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border p-3 rounded hover:bg-muted"
              >
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{file.type}</p>
              </a>
            ))}

            {/* Chat Room Link */}
            {project.chatRoom && (
              <a
                href={`/chat/${project.chatRoom.id}`}
                className="inline-block text-blue-600 hover:underline text-sm mt-2"
              >
                Go to Chat
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function ProjectSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
      <Separator />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
