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
import FlowContainer from "./components/FlowContainer";
import { useNewProjectData } from "@/stores/useNewProjectData";

export default function NewProjectPage() {
  const router = useRouter();

  // Get the user's data
  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axios.get("/api/user");

      return res.data.fullUser;
    },
  });

  const isFreelancer = user?.type == "Freelancer";

  // Get the necessary update functions
  const setTitle = useNewProjectData((state) => state.setTitle);
  const setDescription = useNewProjectData((state) => state.setDescription);
  const setDeadline = useNewProjectData((state) => state.setDeadline);

  // Get the necessary data
  const title = useNewProjectData((state) => state.data.title);
  const description = useNewProjectData((state) => state.data.description);
  const deadline = useNewProjectData((state) => state.data.deadline);

  return (
    <FlowContainer
      title="New Project"
      description={`Create a new project and invite the ${isFreelancer ? "client" : "freelancer"}`}
    >
      <article className="space-y-6 w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            placeholder="e.g Freliq mobile app"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            className="min-w-full"
            placeholder="This is the mobile app for Freliq, a project owned by me (Kin) and being undertaken by John Doe"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Deadline</Label>
          <Calendar
            mode="single"
            selected={deadline}
            onSelect={setDeadline}
            className="rounded-md border w-full"
          />
          {deadline && (
            <p className="text-sm text-muted-foreground">
              Selected: {format(deadline, "PPP")}
            </p>
          )}
        </div>
      </article>
    </FlowContainer>
  );
}
