"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";

export default function NewProjectPage() {
  const router = useRouter();
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
  }

  // Get the user's data
  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axios.get("/api/user");

      return res.data.fullUser;
    },
  });

  const isFreelancer = user?.type == "Freelancer";

  return (
    <div className="max-w-2xl mx-auto py-12">
      <article className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">
          Create a new project and invite the{" "}
          {isFreelancer ? "client" : "freelancer"}
        </p>
      </article>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Project Title</Label>
          <Input placeholder="e.g Freliq mobile app" name="title" id="title" required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea placeholder="This is the mobile app for Freliq, a project owned by me (Kin) and being undertaken by John Doe" name="description" id="description" />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Deadline (optional)</Label>
          <Calendar
            mode="single"
            selected={deadline}
            onSelect={setDeadline}
            className="rounded-md border w-full"
          />
          {deadline && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected: {format(deadline, "PPP")}
            </p>
          )}
        </div>

        <Button type="submit">Create Project</Button>
      </form>
    </div>
  );
}
