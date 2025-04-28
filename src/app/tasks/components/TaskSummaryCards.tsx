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
  const stats = [
    { label: "Total Tasks", value: total },
    { label: "Completed", value: completed },
    { label: "In Progress", value: inProgress },
    { label: "Overdue", value: overdue },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
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
