"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { Inbox } from "lucide-react";

function ChatList() {
  // Fetch the user's chats
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.get("/api/chats");
      return res.data.chats;
    },
  });

  return (
    <article className="md:w-1/4 h-full border-r border-slate-300 pr-4 flex justify-center">
      {isLoading ? (
        <article className="w-full h-full flex flex-col justify-center items-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </article>
      ) : chats && chats.length > 0 ? (
        <h3>Chats here</h3>
      ) : (
        <article className="flex flex-col justify-center items-center gap-2 text-center self-center justify-self-center">
          <Inbox
            size={64}
            strokeWidth={1.4}
            className="text-muted-foreground"
          />
          <article className="flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold">No chats yet</h3>
            <p className="text-muted-foreground mb-1 text-sm">
              Create your first chat using the button below
            </p>
            <Button>
              Create chat <Plus />
            </Button>
          </article>
        </article>
      )}
    </article>
  );
}

export default ChatList;
