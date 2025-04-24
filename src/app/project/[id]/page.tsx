"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import DashboardShell from "@/app/dashboard/components/DashboardShell";

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
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await axios.get(`/api/project/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading || !project) {
    return <ProjectSkeleton />;
  }

  const isOwner = session?.user?.id === project.owner.id;

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

        {/* Members Section */}
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            {[project.owner, ...project.members.map((m) => m.user)].map(
              (user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  {user.id === project.owner.id && (
                    <Badge variant="secondary">Owner</Badge>
                  )}
                </div>
              ),
            )}
          </CardContent>
        </Card>

        {/* Checklist Section */}
        <Card>
          <CardHeader>
            <CardTitle>Kickoff Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.checklists.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title}</span>
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
            ))}
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between border p-3 rounded-md"
              >
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Due:{" "}
                    {task.dueDate ? format(new Date(task.dueDate), "PPP") : "—"}
                  </p>
                </div>
                <Badge>{task.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Files Section */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.files.map((file) => (
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
