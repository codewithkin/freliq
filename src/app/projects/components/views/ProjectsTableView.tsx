import { Badge } from "@/components/ui/badge";
import { Project } from "@/generated/prisma";
import {
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  StopCircle,
  FileText,
  Calendar,
  Circle,
  File,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProjectsTableViewProps {
  projects: Project[];
}

export function ProjectsTableView({ projects }: ProjectsTableViewProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>A list of your projects.</TableCaption>
        <TableHeader className="bg-gray-200 p-4 rounded-full">
          <TableRow>
            <TableHead className="w-[200px]">
              <div className="flex items-center text-slate-800 font-semibold">
                <FileText size={18} className="mr-2" />
                Name
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center text-slate-800 font-semibold">
                <Calendar size={18} className="mr-2" />
                Created
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center text-slate-800 font-semibold">
                <Calendar size={18} className="mr-2" />
                Due Date
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center text-slate-800 font-semibold">
                <Circle size={18} className="mr-2" />
                Status
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center text-slate-800 font-semibold">
                <File size={18} className="mr-2" />
                Actions
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        {projects ? (
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-semibold">{project.title}</TableCell>
                <TableCell>
                  {new Date(project.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "None"}
                </TableCell>
                <TableCell>
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
                    {project.status === "IN_PROGRESS" && <PlayCircle />}
                    {project.status === "DONE" && <CheckCircle />}
                    {project.status === "REJECTED" && <XCircle />}
                    {project.status === "TODO" && <Clock />}
                    {project.status !== "IN_PROGRESS" &&
                      project.status !== "DONE" &&
                      project.status !== "REJECTED" &&
                      project.status !== "TODO" && <StopCircle />}

                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {/* Add actions here if needed */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No projects yet
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        <TableFooter>
          {/* Add a footer if needed, like a summary or pagination */}
        </TableFooter>
      </Table>
    </div>
  );
}
