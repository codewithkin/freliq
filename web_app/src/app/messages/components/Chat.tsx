import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import socket from "@/lib/socket";
import { queryClient } from "@/providers/QueryClientProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Ghost,
  Loader,
  LoaderCircle,
  MessageCircleDashed,
  MoreHorizontal,
  PlusCircle,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";

function Chat({ chat, setChat }: Readonly<{ chat: any | null; setChat: any }>) {
  // Track the value of the message'
  const [message, setMessage] = useState("");

  // Track the messages
  const [messages, setMessages] = useState<[] | any[]>([]);

  // Delete chat mutation
  const { mutate: deleteChat, isPending: deletingChat } = useMutation({
    mutationKey: ["deleteChat"],
    mutationFn: async (chatId: string) => {
      const response = await axios.delete(`/api/chats/?id=${chat?.id}`);

      return response.data;
    },
    onSuccess: () => {
      // Invalidate the query to refetch the chats
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      toast.success("Chat deleted successfully");

      setChat(null);
    },
  });

  const sendingMessage = false;

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chat message", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessages((prev) => [...prev, message]);
      setMessage("");
    }
  };

  return (
    <article className="md:w-3/4 h-full bg-muted">
      {chat ? (
        <article className="w-full h-full">
          {/* Chat page */}

          {/* Header */}
          <article className="flex justify-between items-center border-b border-slate-300 p-4 h-1/10">
            <article className="flex gap-2 items-center">
              {/* Avatar */}
              <Avatar className="bg-primary text-white h-12 w-12">
                <AvatarImage src={chat?.project?.image} />
                <AvatarFallback className="bg-primary text-white h-12 w-12">
                  P
                </AvatarFallback>
              </Avatar>

              {/* Project and chat details */}
              <article className="flex flex-col">
                <h3 className="text-xl font-medium">
                  Chat for{" "}
                  <span className="font-semibold">{chat?.project?.title}</span>
                </h3>
                <article className="flex gap-8 items-center text-sm text-muted-foreground">
                  {/* Members */}
                  <span>
                    {chat?.users?.length} member{chat?.users?.length > 1 && "s"}
                  </span>
                </article>
              </article>
            </article>

            {/* Actions */}
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="secondary">
                  <MoreHorizontal />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Button className="w-full" variant="ghost" asChild>
                  <Link href={`/project/${chat?.project?.id}/invite`}>
                    Invite
                    <PlusCircle />
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    deleteChat(chat?.id);
                  }}
                  disabled={deletingChat}
                  className="w-full"
                  variant="destructive"
                >
                  {deletingChat ? "Deleting chat" : "Delete Chat"}
                  {deletingChat ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <Trash />
                  )}
                </Button>
              </PopoverContent>
            </Popover>
          </article>

          {/* Messages */}
          <article className="flex flex-col w-full h-8/10">
            {chat?.messages?.length > 0 ? (
              <h2>Show messages here</h2>
            ) : (
              <article className="flex flex-col gap-2 items-center justify-center h-full">
                <MessageCircleDashed
                  className="text-muted-foreground"
                  size={58}
                  strokeWidth={1.5}
                />

                <article className="flex flex-col justify-center text-center items-center">
                  <h2 className="text-xl font-semibold">A barren wasteland</h2>
                  <p className="text-muted-foreground">
                    No messages yet, write one to get the conversation rolling
                  </p>
                </article>
              </article>
            )}
          </article>

          {/* Controls */}
          <article className="flex items-end justify-center gap-2 w-full h-1/10 p-4">
            {/* Message input */}
            <Input
              className="p-6 bg-white"
              multiple
              placeholder="Say something about the project"
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              disabled={sendingMessage || message.length < 1}
              className="text-white p-6"
            >
              {sendingMessage ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
            </Button>
          </article>
        </article>
      ) : (
        <article className="flex flex-col gap-2 items-center justify-center h-full">
          <Ghost
            className="text-muted-foreground"
            size={58}
            strokeWidth={1.5}
          />

          <article className="flex flex-col justify-center text-center items-center">
            <h2 className="text-xl font-semibold">It's a bit lonely here</h2>
            <p className="text-muted-foreground">
              Select a chat to begin, it's as easy as that !
            </p>
          </article>
        </article>
      )}
    </article>
  );
}

export default Chat;
