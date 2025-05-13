"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import { User } from "@/generated/prisma";

export default function ParticipantsCard({
  currentUser,
  remoteUser,
  peerId,
}: {
  currentUser: User;
  remoteUser?: User;
  peerId: string;
}) {
  const [open, setOpen] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  const handleInvite = async () => {
    if (!remoteUser?.email) return;
    setInviting(true);
    try {
      await axios.post("/api/video/invite", {
        email: remoteUser.email,
        peerId,
        senderName: currentUser.name,
      });
      toast.success("Invitation sent!");
      setInvited(true);
    } catch (err) {
      console.error("Invite failed", err);
      toast.error("Failed to send invite.");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-neutral-900 shadow-lg rounded-md w-64 border z-50 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer border-b"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h4 className="text-sm font-medium">Participants</h4>
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>

      {open && (
        <ul className="p-3 space-y-2 text-sm">
          <li className="flex justify-between items-center">
            <span>{currentUser.name}</span>
            <Badge variant="secondary">You</Badge>
          </li>

          {remoteUser && (
            <li className="flex justify-between items-center">
              <span>{remoteUser.name}</span>
              {invited ? (
                <Badge variant="outline">Invited</Badge>
              ) : (
                <Button
                  onClick={handleInvite}
                  size="sm"
                  variant="ghost"
                  disabled={inviting}
                >
                  <MailPlus className="mr-1 h-4 w-4" />
                  Invite
                </Button>
              )}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
