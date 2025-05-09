import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Trash, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  members: {
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }[];
  files: {
    id: string;
    name: string;
    type: string | null;
  }[];
  tasks: {
    id: string;
    status: string;
  }[];
  checklists: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

interface ProjectsCardViewProps {
  projects: Project[];
  deleteFn: (params: { id: string }) => void;
  deletingProject: boolean;
}

export function ProjectsCardView({
  projects,
  deleteFn,
  deletingProject,
}: ProjectsCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const completedChecklists = project.checklists.filter(
          (c) => c.completed,
        ).length;
        const taskCounts = {
          todo: project.tasks.filter((t) => t.status === "TODO").length,
          inProgress: project.tasks.filter((t) => t.status === "IN_PROGRESS")
            .length,
          done: project.tasks.filter((t) => t.status === "DONE").length,
        };

        return (
          <Card
            key={project.id}
            className="hover:shadow-md transition-shadow flex flex-col"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || "No description provided"}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    project.status === "ACTIVE"
                      ? "default"
                      : project.status === "ON_HOLD"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {project.status || "UNKNOWN"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* Owner info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.owner.image || undefined} />
                  <AvatarFallback>
                    {project.owner.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{project.owner.name}</p>
                  <p className="text-xs text-muted-foreground">Project Owner</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{format(project.createdAt, "MMM d, yyyy")}</p>
                </div>
                {project.deadline && (
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p
                      className={
                        project.deadline < new Date() ? "text-red-500" : ""
                      }
                    >
                      {format(project.deadline, "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress indicators */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Checklists</span>
                  <span>
                    {completedChecklists} / {project.checklists.length}{" "}
                    completed
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(completedChecklists / project.checklists.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm mt-4">
                  <span className="text-muted-foreground">Tasks</span>
                  <span>{project.tasks.length} total</span>
                </div>
                <div className="flex gap-1 h-2">
                  <div
                    className="bg-blue-500 rounded-l-full"
                    style={{
                      width: `${(taskCounts.todo / project.tasks.length) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-yellow-500"
                    style={{
                      width: `${(taskCounts.inProgress / project.tasks.length) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-green-500 rounded-r-full"
                    style={{
                      width: `${(taskCounts.done / project.tasks.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>To Do: {taskCounts.todo}</span>
                  <span>In Progress: {taskCounts.inProgress}</span>
                  <span>Done: {taskCounts.done}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t pt-4 gap-2">
              <div className="flex -space-x-2">
                {project.members.slice(0, 5).map((member) => (
                  <Avatar
                    key={member?.user?.id}
                    className="h-8 w-8 border-2 border-background"
                  >
                    <AvatarImage src={member?.user?.image || undefined} />
                    <AvatarFallback>
                      {member?.user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 5 && (
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      +{project.members.length - 5}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1" asChild>
                  <Link href={`/project/${project.id}`}>
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  disabled={deletingProject}
                  onClick={() => deleteFn({ id: project.id })}
                >
                  {deletingProject ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                  <span>Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
