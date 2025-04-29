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

export default function NewProjectPage() {
  const router = useRouter();
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

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
    <FlowContainer
      title="New Project"
      description={`Create a new project and invite the ${isFreelancer ? "client" : "freelancer"}`}
    >
      <article className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            placeholder="e.g Freliq mobile app"
            name="title"
            id="title"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="This is the mobile app for Freliq, a project owned by me (Kin) and being undertaken by John Doe"
            name="description"
            id="description"
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
