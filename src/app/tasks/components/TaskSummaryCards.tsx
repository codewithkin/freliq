"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskSummaryCardsProps {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export function TaskSummaryCards({
  total,
  completed,
  inProgress,
  overdue,
}: TaskSummaryCardsProps) {
  const stats: { label: string; value: any; className?: string }[] = [
    {
      label: "Total Tasks",
      value: total,
      className: "bg-gradient-to-tr from-blue-500 to-purple-600 text-white",
    },
    { label: "Completed", value: completed, className: "bg-primary" },
    {
      label: "In Progress",
      value: inProgress,
      className: "bg-orange-500 text-white",
    },
    { label: "Overdue", value: overdue, className: "bg-red-500 text-white" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card className={stat.className} key={stat.label}>
          <CardHeader>
            <CardTitle className="text-sm">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
