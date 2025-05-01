"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  className?: string;
}

export function DashboardStatCard({
  title,
  count,
  icon: Icon,
  className = "",
}: DashboardStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`p-8 flex justify-center gap-4 ${className}`}>
        <Icon className="h-8 w-8 text-white" />
        <CardContent className="p-0">
          <p className="text-3xl font-semibold text-white">{count}</p>
          <p className="text-sm text-white capitalize">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
