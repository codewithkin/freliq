"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateTaskButton() {
  const router = useRouter();

  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0"
      onClick={() => router.push("/tasks/new")}
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
