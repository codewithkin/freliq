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
}

export function ProjectsTableView({ projects }: ProjectsTableViewProps) {
  const [type, setType] = useState("json");

  const { isPending: loading, mutate: convert } = useMutation({
    mutationKey: ["convertedData"],
    mutationFn: async () => {
      const res = await axios.post(
        "/api/convert",
        { projects, type },
        {
          headers: {
            type: "json", // or "csv" depending on what you need
          },
          responseType: "blob", // Ensure we're receiving binary data
        },
      );

      return res.data;
    },
    onSuccess: (data) => {
      // Log the response to verify
      console.log("Downloaded data:", data);

      // Determine file name and type (based on the response type or header info)
      const fileType = data.type; // Assuming the type is correctly set
      const fileName =
        fileType === "application/json" ? "projects.json" : "projects.csv";

      // Create a blob from the response data
      const blob = new Blob([data], { type: fileType });

      // Create a temporary download link and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Set the file name dynamically
      link.click();

      toast.success("Downloaded file successfully");
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
      toast.error("Failed to download file");
    },
  });

  const { isPending: deletingProject, mutate: deleteProject } = useMutation({
    mutationKey: ["deleteProject"],
    mutationFn: async ({ id }: { id: any }) => {
      // Make a request to the delete endpoint
      const res = await axios.delete(`/api/project/${id}`);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
    },
    onError: (e) => {
      console.log("An error occured while deleting project: ", e);
      toast.error("Failed to delete project");
    },
  });

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent>
        <CardHeader className="px-0 py-4 flex items-center justify-between">
          <CardTitle className="text-lg text-slate-800">Projects</CardTitle>

          <article className="flex items-center gap-4">
            <Button
              onClick={() => {
                setType("csv");
                convert();
              }}
              disabled={loading}
              size="sm"
              variant="default"
            >
              <FaFileExcel />
              <p>Download as CSV</p>
            </Button>
            <Button
              onClick={() => {
                setType("json");
                convert();
              }}
              disabled={loading}
              size="sm"
              variant="secondary"
            >
              <Braces />
              <p>Download as JSON</p>
            </Button>
          </article>
        </CardHeader>
        <Table>
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
                        <TooltipTrigger>
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
                        <TooltipTrigger>
                          <Button
                            disabled={deletingProject}
                            size="icon"
                            variant="destructive"
                            onClick={() => {
                              deleteProject({ id: project.id });
                            }}
                            asChild
                          >
                            <Link href={`/project/${project.id}`}>
                              {deletingProject ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Trash />
                              )}
                            </Link>
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
