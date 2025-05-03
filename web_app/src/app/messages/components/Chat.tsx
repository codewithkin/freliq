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
import { useMutation, useQuery } from "@tanstack/react-query";
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
  // Track the value of the message
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Track the messages
  const [messages, setMessages] = useState<any[]>([]);

  // Delete chat mutation
  const { mutate: deleteChat, isPending: deletingChat } = useMutation({
    mutationKey: ["deleteChat"],
    mutationFn: async (chatId: string) => {
      const response = await axios.delete(`/api/chats/?id=${chat?.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.success("Chat deleted successfully");
      setChat(null);
    },
  });

  const { data: user, isPending } = useQuery({
    queryKey: ["full-user"],
    queryFn: async () => {
      const res = await axios.get(`/api/user`);
      return res.data.fullUser;
    },
  });

  useEffect(() => {
    if (chat) {
      // Join the chat room when chat is selected
      socket.emit("join chat", { chat });
      
      // Reset messages when changing chats
      setMessages([]);
    }
  }, [chat]);

  useEffect(() => {
    // Listen for user joining the chat
    socket.on("user joined", (data) => {
      toast.info(`Someone joined the chat`);
    });

    // Listen for incoming messages
    socket.on("received message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for user leaving
    socket.on("user left", (userId) => {
      toast.info(`Someone left the chat`);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("user joined");
      socket.off("received message");
      socket.off("user left");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setSendingMessage(true);
    socket.emit("sent message", { chat, user, message });
    setMessage("");
    setSendingMessage(false);
  };

  return (
    <article className="md:w-3/4 h-full bg-muted">
      {chat ? (
        <article className="w-full h-full">
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
          <article className="flex flex-col w-full h-8/10 overflow-y-auto p-4">
            {messages.length > 0 ? (
              <article className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <article
                    key={msg.id}
                    className={`flex ${
                      msg.sender.id === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <article
                      className={`flex gap-2 max-w-[80%] ${
                        msg.sender.id === user?.id
                          ? "bg-primary text-white"
                          : "bg-white"
                      } rounded-lg p-3`}
                    >
                      {msg.sender.id !== user?.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.sender.image} />
                          <AvatarFallback>
                            {msg.sender.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <article className="flex flex-col">
                        {msg.sender.id !== user?.id && (
                          <span className="text-xs font-medium">
                            {msg.sender.name}
                          </span>
                        )}
                        <p className="break-words">{msg.content}</p>
                        <span className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </article>
                    </article>
                  </article>
                ))}
              </article>
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

          {/* Message input */}
          <article className="flex items-end justify-center gap-2 w-full h-1/10 p-4">
            <Input
              className="p-6 bg-white"
              placeholder="Say something about the project"
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              disabled={sendingMessage || message.length < 1}
              onClick={sendMessage}
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
          <Ghost className="text-muted-foreground" size={58} strokeWidth={1.5} />
          <article className="flex flex-col justify-center text-center items-center">
            <h2 className="text-xl font-semibold">No chat selected</h2>
            <p className="text-muted-foreground">
              Select a chat from the sidebar to start messaging
            </p>
          </article>
        </article>
      )}
    </article>
  );
}

export default Chat;
