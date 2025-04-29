"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"; // optional if you want date picker
import { format } from "date-fns";
import { createProject } from "@/lib/actions/create-project";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

export default function NewProjectPage() {
  const router = useRouter();
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (deadline) {
      formData.set("deadline", deadline.toISOString());
    }
    try {
      await createProject(formData);
      router.push("/projects");
    } catch (err) {
      console.error(err);
    }
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
        <div>
          <Label htmlFor="title">Title</Label>
          <Input name="title" id="title" required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" id="description" />
        </div>

        <div>
          <Label htmlFor="clientId">Client ID</Label>
          <Input name="clientId" id="clientId" required />
        </div>

        <div>
          <Label htmlFor="freelancerId">Freelancer ID (optional)</Label>
          <Input name="freelancerId" id="freelancerId" />
        </div>

        <div>
          <Label>Deadline (optional)</Label>
          <Calendar
            mode="single"
            selected={deadline}
            onSelect={setDeadline}
            className="rounded-md border"
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
