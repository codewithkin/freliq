"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CheckCircle,
  Loader2,
  MessageSquare,
  ProjectorIcon,
  XCircle,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ProjectInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteType = searchParams.get("type") || "project";
  const params = useParams();

  const projectId = params.id;

  // Fetch project details
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await axios.get(`/api/project/${projectId}`);
      return res.data.project;
    },
  });

  // Accept project invitation
  const { mutate: acceptInvite, isPending: accepting } = useMutation({
    mutationKey: ["acceptProjectInvite"],
    mutationFn: async () => {
      const res = await axios.post(`/api/project/${projectId}/join`, {
        type: inviteType,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        inviteType === "chat"
          ? "Successfully joined the chat!"
          : "Successfully joined the project!",
      );
      router.push(
        inviteType === "chat"
          ? `/messages?projectId=${projectId}`
          : `/project/${projectId}`,
      );
    },
    onError: () => {
      toast.error(
        inviteType === "chat"
          ? "Failed to join chat"
          : "Failed to join project",
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <XCircle className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-semibold">Project Not Found</h1>
        <p className="text-muted-foreground">
          This project may have been deleted or you don't have access to it.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {inviteType === "chat" ? (
              <>
                <MessageSquare className="w-5 h-5" />
                Chat Invitation
              </>
            ) : (
              <>
                <ProjectorIcon className="w-5 h-5" />
                Project Invitation
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Project Owner</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {project.owner.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{project.owner.name}</p>
                <p className="text-xs text-muted-foreground">
                  {project.owner.email}
                </p>
              </div>
            </div>
          </div>
          {inviteType === "chat" && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm">
                You've been invited to join the project chat. You'll be able to:
              </p>
              <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                <li>• Participate in project discussions</li>
                <li>• Share files and updates</li>
                <li>• Collaborate with team members</li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            disabled={accepting}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Decline
          </Button>
          <Button onClick={() => acceptInvite()} disabled={accepting}>
            {accepting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {inviteType === "chat" ? "Join Chat" : "Join Project"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
