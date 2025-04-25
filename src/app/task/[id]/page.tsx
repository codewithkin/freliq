"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/app/dashboard/components/DashboardShell";
import { authClient } from "@/lib/auth-client";

export default function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [feedback, setFeedback] = useState("");

  const { data: session } = authClient.useSession();

  const { data: user } = useQuery({
    queryKey: ["full-user"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data.fullUser;
    },
  });

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axios.get(`/api/task/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({
      status,
      feedback = "",
    }: {
      status: string;
      feedback?: string;
    }) => {
      await axios.patch(`/api/task/${id}/status`, { status, feedback });
    },
    onSuccess: () => {
      toast.success("Task status updated!");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
    onError: () => {
      toast.error("Failed to update task status.");
    },
  });

  if (isLoading || !task || !user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10">
            <Loader2 className="animate-spin w-6 h-6 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFreelancer = user.type === "freelancer";
  const isClient = user.type === "client";

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          {task.description && (
            <p className="text-muted-foreground mt-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Badge variant="outline">{task.status}</Badge>
            {task.dueDate && (
              <span className="text-sm text-muted-foreground">
                Due: {format(new Date(task.dueDate), "PPP")}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              Created: {format(new Date(task.createdAt), "PPP")}
            </span>
          </div>

          <div className="text-sm text-muted-foreground mt-1">
            Project: <span className="font-medium">{task.project?.title}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Created by:{" "}
            <span className="font-medium">
              {task.creator?.email || "Unknown"}
            </span>
          </div>
        </div>

        <Separator />

        {/* Proof */}
        {task.proof && (
          <Card>
            <CardHeader>
              <CardTitle>Proof of Work</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={task.proof}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Proof
              </a>
            </CardContent>
          </Card>
        )}

        {/* Feedback */}
        {task.feedback && (
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.feedback}</p>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        {task.comments && task.comments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {task.comments.map((comment: any) => (
                <div key={comment.id}>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), "PPP p")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {isClient && task.status !== "DONE" && (
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                updateTaskStatus.mutate({ status: "DONE", feedback: "" })
              }
            >
              Approve
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Reject</Button>
              </DialogTrigger>
              <DialogContent>
                <h2 className="font-semibold text-lg mb-2">Provide feedback</h2>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="I think you should improve..."
                  className="resize-none"
                />
                <Button
                  className="mt-2"
                  disabled={updateTaskStatus.isPending || feedback.length === 0}
                  onClick={() =>
                    updateTaskStatus.mutate({
                      status: "REJECTED",
                      feedback,
                    })
                  }
                >
                  {updateTaskStatus.isPending && (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  )}
                  Reject & Send Feedback
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Freelancer view to submit proof (if not done yet) */}
        {isFreelancer && task.status === "TODO" && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Start working and submit your work when done.
              </p>
              <Button
                onClick={() =>
                  updateTaskStatus.mutate({ status: "IN_PROGRESS" })
                }
              >
                Start Task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
