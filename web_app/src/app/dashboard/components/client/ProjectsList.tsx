"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Task = {
  status: string;
};

type Project = {
  id: string;
  title: string;
  createdAt: string;
  deadline: string;
  files: string[];
  tasks: Task[];
};

const ITEMS_PER_PAGE = 10;

export const ProjectsList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects/list");
      if (!res.data) throw new Error("Failed to fetch projects");
      return res.data;
    },
  });

  const paginatedData = data?.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const totalPages = data ? Math.ceil(data.length / ITEMS_PER_PAGE) : 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-20" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">No projects found.</p>;
  }

  return (
    <Card className="overflow-x-auto w-full">
      <CardContent>
        <CardTitle>Projects</CardTitle>
        <Table>
          <TableCaption>A list of your current projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-hidden">
            {paginatedData?.map((project) => {
              const totalTasks = project.tasks.length;
              const incompleteTasks = project.tasks.filter(
                (t) => t.status !== "DONE",
              ).length;
              const progress =
                totalTasks > 0
                  ? ((totalTasks - incompleteTasks) / totalTasks) * 100
                  : 0;

              return (
                <TableRow
                  onClick={() => {
                    router.push(`/project/${project.id}`);
                  }}
                  className="p-4 hover:cursor-pointer"
                  key={project.id}
                >
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    {format(new Date(project.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(project.deadline), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{project.files.length}</Badge>
                  </TableCell>
                  <TableCell>
                    {totalTasks - incompleteTasks} / {totalTasks}
                  </TableCell>
                  <TableCell>
                    <Progress value={progress} className="h-2" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="py-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(page - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};
