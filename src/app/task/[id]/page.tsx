"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/app/dashboard/components/DashboardShell";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/providers/QueryClientProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Add the CommentForm component
const CommentForm = ({
  taskId,
  onCommentAdded,
}: {
  taskId: string;
  onCommentAdded: () => void;
}) => {
  const [commentContent, setCommentContent] = useState("");
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/task/${taskId}/comment`, {
        content: commentContent,
      });
    },
    onSuccess: () => {
      toast.success("Comment added!");
      setCommentContent(""); // Clear the textarea
      onCommentAdded(); // Refresh the comments list
    },
    onError: () => {
      toast.error("Failed to add comment.");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Add your comment here"
          className="resize-none"
        />
        <Button
          className="mt-2"
          disabled={addCommentMutation.isPending || commentContent.length === 0}
          onClick={() => addCommentMutation.mutate()}
        >
          {addCommentMutation.isPending ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            "Add Comment"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  console.log("Task: ", task);

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

  const updateTaskDetails = useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => {
      await axios.patch(`/api/task/${id}/details`, { title, description });
    },
    onSuccess: () => {
      toast.success("Task details updated!");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      setEditing(false);
    },
    onError: () => {
      toast.error("Failed to update task details.");
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

  const isFreelancer = user.type !== "freelancer";
  const isClient = user.type === "freelancer";

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          {editing ? (
            <div>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-3xl font-bold border-b-2 border-gray-300 focus:outline-none"
              />
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-4 w-full p-2 border-2 border-gray-300"
                placeholder="Edit description..."
              />
              <Button
                variant="outline"
                onClick={() =>
                  updateTaskDetails.mutate({
                    title: newTitle,
                    description: newDescription,
                  })
                }
                className="mt-2"
              >
                Save Changes
                <CheckCircle className="ml-2" />
              </Button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold">{task.title}</h1>
              {task.description && (
                <p className="text-muted-foreground mt-2">{task.description}</p>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(true);
                  setNewTitle(task.title);
                  setNewDescription(task.description || "");
                }}
                className="mt-4"
              >
                <Edit className="mr-2" />
                Edit Task
              </Button>
            </div>
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

        {/* Proof Image */}
        {task.proof && (
          <Card>
            <CardHeader>
              <CardTitle>Proof of Work</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={task.proof}
                alt="Proof of work"
                className="w-full rounded-md"
              />
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
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={comment.author.image}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {comment.author.role} | {comment.author.email}
                    </p>
                    <p className="text-sm mt-1">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(comment.createdAt), "PPP p")}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Add New Comment Form */}
        <CommentForm
          taskId={id}
          onCommentAdded={() =>
            queryClient.invalidateQueries({ queryKey: ["task", id] })
          }
        />

        {/* Actions */}
        {isClient && task.status !== "DONE" && (
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                updateTaskStatus.mutate({ status: "DONE", feedback: "" })
              }
            >
              <CheckCircle className="mr-2" />
              Approve
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <XCircle className="mr-2" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="font-semibold text-lg mb-2">
                  Provide feedback
                </DialogTitle>
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

            {/* New Button for Approving or Updating Status */}
            <Button
              variant="outline"
              onClick={() =>
                updateTaskStatus.mutate({ status: "IN_PROGRESS", feedback: "" })
              }
              disabled={task.status === "DONE"}
            >
              {task.status === "TODO" ? "Start" : "Set to in progress"}
            </Button>
          </div>
        )}

        {/* Freelancer view to submit proof (if not done yet) */}
        {isFreelancer && task.status === "TODO" && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <Button disabled={updateTaskStatus.isPending}>
                <FileText className="mr-2" />
                Submit Proof
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
