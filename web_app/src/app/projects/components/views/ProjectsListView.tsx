import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Project } from "@/generated/prisma";

interface ProjectsListViewProps {
  projects: Project[];
}

export function ProjectsListView({ projects }: ProjectsListViewProps) {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-sm md:text-base">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Created {format(new Date(project.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <Badge
              variant={
                project.status === "TODO"
                  ? "default"
                  : project.status === "ACTIVE"
                    ? "secondary"
                    : project.status === "DONE"
                      ? "outline"
                      : "destructive"
              }
              className="text-xs capitalize"
            >
              {project.status.toLowerCase()}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
