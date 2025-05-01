"use client";

import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";

type Project = {
  id: string;
  name: string;
  status: string;
};

interface ProjectsStatusPieChartProps {
  projects: Project[];
}

export function ProjectsStatusPieChart({
  projects,
}: ProjectsStatusPieChartProps) {
  // Calculate the count of projects by status
  const statusCounts = useMemo(() => {
    return projects.reduce(
      (acc, project) => {
        const { status } = project;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [projects]);

  const pieData = useMemo(() => {
    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  }, [statusCounts]);

  // Define colors for the pie chart slices
  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8A2BE2", "#D2691E"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <CardDescription>Distribution of project statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing project distribution based on current status
        </div>
      </CardFooter>
    </Card>
  );
}
