"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import FlowContainer from "../components/FlowContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useNewProjectData } from "@/stores/useNewProjectData";
import { Loader2 } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();

  const [inviteSent, setInviteSent] = useState<boolean>(false);
  const [email, setEmail] = useState("");

  // Get the user's data
  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axios.get("/api/user");

      return res.data.fullUser;
    },
  });

  const projectId = useNewProjectData((state) => state.data.id);

  // Handle sending an invite
  const { mutate: sendInvite, isPending: sendingInvite } = useMutation({
    mutationKey: ["sendInvite"],
    mutationFn: async () => {
      // Make a request to the backend
      const res = await axios.get(
        `/api/invite/project/?email=${email}&project=${projectId}`,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success(`Invite to ${email} has been sent`);

      setInviteSent(true);
    },
    onError: () => {
      toast.error("An error occured while sending the invite");
    },
  });

  const isFreelancer = user?.type == "Freelancer";

  return (
    <FlowContainer
      title={`Invite ${isFreelancer ? "client" : "freelancer"}`}
      description={`Invite the project's ${isFreelancer ? "client" : "freelancer"}`}
      disabled={!inviteSent}
    >
      <article className="space-y-6 w-full">
        <article className="flex gap-2 items-center">
          <article className="flex flex-col gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              placeholder="kin@freliq.com"
            />
          </article>
          <Button
            disabled={sendingInvite || inviteSent}
            type="button"
            onClick={() => {
              sendInvite();
            }}
          >
            {sendingInvite && <Loader2 className="animate-spin" />}
            {sendingInvite ? "Sending invite..." : "Send invite"}
          </Button>
        </article>
      </article>
    </FlowContainer>
  );
}
