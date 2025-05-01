"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";

type Project = {
  id: string;
  name: string;
  createdAt: string; // ISO string
};

const chartConfig = {
  projects: {
    label: "Projects",
    color: "hsl(var(--color-chart-1))",
  },
} satisfies ChartConfig;

interface ProjectsLineChartProps {
  projects: Project[];
}

export function ProjectsLineChart({ projects }: ProjectsLineChartProps) {
  const chartData = React.useMemo(() => {
    const monthMap: Record<string, number> = {};

    for (const project of projects) {
      const date = new Date(project.createdAt);
      const month = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      monthMap[month] = (monthMap[month] || 0) + 1;
    }

    const sortedMonths = Object.keys(monthMap).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map((month) => ({
      month,
      projects: monthMap[month],
    }));
  }, [projects]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Created</CardTitle>
        <CardDescription>Monthly overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(" ")[0]} // Show only month name
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="projects"
              type="natural"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-primary)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
