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

interface ProjectsTableViewProps {
  projects: Project[];
}

export function ProjectsTableView({ projects }: ProjectsTableViewProps) {
  const [type, setType] = useState("json");

  const {
    data: convertedData,
    isPending: loading,
    mutate: convert,
  } = useMutation({
    mutationKey: ["convertedData"],
    mutationFn: async () => {
      const res = await axios.post(
        "/api/convert",
        { projects, type },
        {
          responseType: "blob", // Ensure the response is a Blob (file)
        },
      );
      return res.data; // This is the file content
    },
    onSuccess: (data: any) => {
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(new Blob([data]));

      // Create an anchor element to trigger the download
      const link = document.createElement("a");

      // Dynamically set the file name based on the response
      const contentDisposition = data.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "file";

      link.href = url;
      link.setAttribute("download", fileName); // Set the file name
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up the URL object after the download
      window.URL.revokeObjectURL(url);

      toast.success("Downloaded file successfully");
    },
    onError: () => {
      toast.error("Failed to download file");
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
      </CardContent>
    </Card>
  );
}
