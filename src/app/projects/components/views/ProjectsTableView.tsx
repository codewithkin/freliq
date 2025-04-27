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
  Download,
  Brackets,
  Braces,
  Eye,
  Trash,
  Loader2,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFileExcel } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface ProjectsTableViewProps {
  projects: Project[];
  deleteFn: any;
  deletingProject: boolean;
}

export function ProjectsTableView({
  projects,
  deleteFn,
  deletingProject,
}: ProjectsTableViewProps) {
  return (
    <Card className="w-full overflow-x-auto">
      <CardContent>
        <CardHeader className="px-0 py-4 flex items-center justify-between">
          <CardTitle className="text-lg text-slate-800">
            Projects Table
          </CardTitle>
        </CardHeader>
        <Table className="">
          <TableCaption>A list of your projects.</TableCaption>
          <TableHeader className="bg-gray-200 p-4 rounded-full mb-8">
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
                  <TableCell className="font-semibold">
                    {project.title}
                  </TableCell>
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
                  <TableCell className="text-right flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="outline" asChild>
                            <Link href={`/project/${project.id}`}>
                              <Eye />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View project details</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={deletingProject}
                            size="icon"
                            variant="destructive"
                            onClick={() => {
                              deleteFn({ id: project.id });
                            }}
                          >
                            {deletingProject ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Trash />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-red-500 text-white">
                          <p>Delete project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
      </CardContent>
    </Card>
  );
}
