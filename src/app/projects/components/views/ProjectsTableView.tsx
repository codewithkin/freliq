import { Badge } from "@/components/ui/badge";
import { Project } from "@/generated/prisma";
import {
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  StopCircle,
} from "lucide-react";

interface ProjectsTableViewProps {
  projects: Project[];
}

export function ProjectsTableView({ projects }: ProjectsTableViewProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Due Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created</th>
          </tr>
        </thead>
        {projects ? (
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-2">{project.title}</td>
                <td className="px-4 py-2">
                  {" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "None"}
                </td>
                <td className="px-4 py-2">
                  <Badge
                    className={`text-xs rounded-full ${
                      project.status === "IN_PROGRESS"
                        ? "bg-blue-500 text-white"
                        : project.status === "DONE"
                          ? "bg-green-500 text-white"
                          : project.status === "REJECTED"
                            ? "bg-red-500 text-white"
                            : project.status === "TODO"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-500 text-white"
                    }`}
                  >
                    {/* Icon based on status */}
                    {project.status === "IN_PROGRESS" && (
                      <PlayCircle />
                    )}
                    {project.status === "DONE" && (
                      <CheckCircle />
                    )}
                    {project.status === "REJECTED" && (
                      <XCircle />
                    )}
                    {project.status === "TODO" && <Clock />}
                    {project.status !== "IN_PROGRESS" &&
                      project.status !== "DONE" &&
                      project.status !== "REJECTED" &&
                      project.status !== "TODO" && (
                        <StopCircle />
                      )}

                    {project.status}
                  </Badge>
                </td>

                <td className="px-4 py-2">{project.title}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <h2 className="text-xl font-semibold text-slate-500">
            No projects yet
          </h2>
        )}
      </table>
    </div>
  );
}
