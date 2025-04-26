"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

// Define the props
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  proof?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  creatorId: string;
  feedback?: string;
}

interface TaskPieChartProps {
  tasks: Task[];
}

// Define colors for each status
const STATUS_COLORS: Record<string, string> = {
  TODO: "hsl(var(--chart-1))",
  IN_PROGRESS: "hsl(var(--chart-2))",
  AWAITING_VALIDATION: "hsl(var(--chart-3))",
  DONE: "hsl(var(--chart-4))",
  REJECTED: "hsl(var(--chart-5))",
};

function getChartIndex(status: string) {
    const indexMap: Record<string, number> = {
      TODO: 1,
      IN_PROGRESS: 2,
      AWAITING_VALIDATION: 3,
      DONE: 4,
      REJECTED: 5,
    }
    return indexMap[status] || 0
  }

export function TaskPieChart({ tasks }: TaskPieChartProps) {
  // Process tasks into chart data
  const chartData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {};

    tasks.forEach((task) => {
      const status = task.status.toUpperCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: STATUS_COLORS[status] || "hsl(var(--muted))",
    }));
  }, [tasks]);

  console.log("Task data: ", chartData);

  const totalTasks = React.useMemo(() => {
    return tasks.length;
  }, [tasks]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tasks Distribution</CardTitle>
        <CardDescription>By Status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}} // Not using custom config for now
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              isAnimationActive={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData.map((entry) => (
          <div key={entry.status} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                backgroundColor: `var(--chart-${getChartIndex(entry.status)})`,
              }}
            />
            <span>{entry.status}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
