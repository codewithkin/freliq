import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/providers/QueryClientProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import axios from "axios";
import {
  FolderKanban,
  Ghost,
  Loader,
  LoaderCircle,
  MessageCircleDashed,
  MoreVertical,
  Paperclip,
  PlusCircle,
  SquareCheckBig,
  Trash,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RealtimeContext } from "@/providers/RealtimeProvider";

function Chat({ chat, setChat }: Readonly<{ chat: any | null; setChat: any }>) {
  // Track the value of the message
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const [showTaskSelect, setShowTaskSelect] = useState(false);

  const useRealtime = () => useContext(RealtimeContext);

  const parentRef = useRef<HTMLDivElement>(null);

  // Track the messages
  const [messages, setMessages] = useState<any[]>([]);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  // Get the socket
  const { socket } = useRealtime();

  const { mutate: inviteUser, isPending: inviting } = useMutation({
    mutationKey: ["inviteUser"],
    mutationFn: async (email: string) => {
      const response = await axios.post(
        `/api/project/${chat?.project?.id}/invite`,
        {
          email,
          type: "chat",
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.error || "Could not invite user");
    },
  });

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

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects/list");
      return res.data;
    },
  });

  // Fetch tasks
  const { data: tasks } = useQuery({
    queryKey: ["tasks", selectedProject?.id],
    queryFn: async () => {
      if (!selectedProject?.id) return [];
      const res = await axios.get(`/api/projects/${selectedProject.id}/tasks`);
      return res.data.tasks;
    },
    enabled: !!selectedProject?.id,
  });

  useEffect(() => {
    if (!socket) return;

    if (chat) {
      // Join the chat room when chat is selected
      socket.emit("join chat", { chat });

      // Reset messages when changing chats
      setMessages([]);
    }
  }, [chat]);

  useEffect(() => {
    if (!socket) return;

    const handleReceivedMessage = (data: any) => {
      console.log("Received message: ", data);
      setMessages((prev) =>
        [...prev, data].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ),
      );
    };

    socket.on("user joined", () => {
      toast.info("Someone joined the chat");
    });

    socket.on("received message", handleReceivedMessage);

    socket.on("user left", () => {
      toast.info("Someone left the chat");
    });

    // CLEANUP: Remove listeners when effect re-runs or unmounts
    return () => {
      socket.off("user joined");
      socket.off("received message", handleReceivedMessage);
      socket.off("user left");
    };
  }, [chat, socket, user?.id]);

  const sendAttachment = (type: "project" | "task", data: any) => {
    setSendingMessage(true);

    const attachment = { type, data };

    if (!socket) return;

    socket.emit("sent message", {
      chat,
      user,
      message: `Shared a ${type}`,
      attachment,
    });

    setSelectedProject(null);
    setSelectedTask(null);
    setSendingMessage(false);
  };

  const sendMessage = () => {
    if (!socket) return;

    setSendingMessage(true);
    socket.emit("sent message", { chat, user, message });
    setMessage("");
    setSendingMessage(false);
  };

  return (
    <article className="md:w-3/4 h-full max-h-screen bg-muted">
      {chat ? (
        <article className="w-full h-full max-h-full">
          {/* Header */}
          <article className="flex justify-between items-center border-b border-slate-300 p-4 h-1/10 md:max-h-1/10">
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
                <h3 className="text-md md:text-xl font-medium">
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

            <article className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button asChild variant="secondary">
                      <Link href={`/video-chat/${chat?.id}`}>
                        <Video />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start a video meeting</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Actions */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="outline">
                    <MoreVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex flex-col gap-1">
                      <Input
                        placeholder="Enter email to invite"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        disabled={inviting || !inviteEmail}
                        onClick={() => {
                          inviteUser(inviteEmail);
                          setInviteEmail("");
                        }}
                      >
                        {inviting ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Sending invite...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Invite to Chat
                          </>
                        )}
                      </Button>
                    </div>
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
                  </div>
                </PopoverContent>
              </Popover>
            </article>
          </article>

          {/* Messages */}
          <article
            className="flex flex-col w-full h-8/10 max-h-8/10 overflow-y-auto p-4"
            ref={parentRef}
          >
            {messages.length > 0 ? (
              <article
                className="flex flex-col h-full gap-4"
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const msg = messages[virtualRow.index];
                  return (
                    <article
                      key={msg.id}
                      ref={(el) =>
                        virtualizer.measureElement(el, virtualRow.index)
                      }
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className={`flex ${
                        msg.sender.id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <article
                        className={`flex gap-2 max-w-[80%] ${
                          msg.sender.id === user?.id && "bg-blue-500 text-white"
                        } rounded-lg p-3`}
                      >
                        {msg.sender.id !== user?.id && (
                          <div className="flex flex-col items-center gap-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.sender.image} />
                              <AvatarFallback className="bg-blue-500 text-white">
                                {msg.sender.name?.[0]?.toUpperCase() ||
                                  msg.sender.email?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        <article
                          className={`flex flex-col ${msg.sender.id !== user?.id && "bg-slate-800 p-4 text-white rounded-xl"}`}
                        >
                          {msg.sender.id !== user?.id ? (
                            <div className="flex flex-col mb-1">
                              <span className="text-xs font-medium">
                                {msg.sender.name ||
                                  msg.sender.email ||
                                  "Unknown"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col mb-1">
                              <span className="text-xs font-medium">You</span>
                            </div>
                          )}
                          {msg.attachment ? (
                            <article className="bg-white rounded-lg border shadow-sm">
                              <div className="flex items-start space-x-4 p-4">
                                {msg.attachment.type === "project" ? (
                                  <FolderKanban className="h-8 w-8 text-primary shrink-0" />
                                ) : (
                                  <SquareCheckBig className="h-8 w-8 text-primary shrink-0" />
                                )}
                                <div className="flex-1 space-y-1">
                                  <h4 className="font-semibold text-foreground">
                                    {msg.attachment.data.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {msg.attachment.data.description ||
                                      "No description"}
                                  </p>
                                  <div className="flex items-center pt-2">
                                    <Button
                                      asChild
                                      variant="outline"
                                      size="sm"
                                      className=" text-slate-900"
                                    >
                                      <Link
                                        href={
                                          msg.attachment.type === "project"
                                            ? `/projects/${msg.attachment.data.id}`
                                            : `/projects/${msg.attachment.data.projectId}/tasks/${msg.attachment.data.id}`
                                        }
                                      >
                                        View{" "}
                                        {msg.attachment.type === "project"
                                          ? "Project"
                                          : "Task"}
                                      </Link>
                                    </Button>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      Created{" "}
                                      {new Date(
                                        msg.attachment.data.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </article>
                          ) : (
                            <article className="flex flex-col">
                              <p className="break-words mb-1">{msg.content} </p>{" "}
                              <span
                                className={` ${msg.sender.id !== user?.id ? "text-muted-foreground" : "text-white"} text-[10px] whitespace-nowrap self-end justify-self-end`}
                              >
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </article>
                          )}
                        </article>
                      </article>
                    </article>
                  );
                })}
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
          {socket && (
            <article className="flex items-end justify-center gap-2 w-full h-1/10 max-h-1/10 p-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="p-6" variant="outline">
                    <Paperclip />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <Label>Send</Label>
                  <article className="flex mt-4 flex-col gap-2 justify-center">
                    {/* Task */}
                    <Button
                      className="p-6 hover:cursor-pointer w-full"
                      variant="outline"
                      onClick={() => {
                        setShowTaskSelect(true);
                        setShowProjectSelect(false);
                      }}
                    >
                      <SquareCheckBig className="text-blue-500 mr-2" />
                      {selectedTask ? selectedTask.title : "Select Task"}
                    </Button>

                    {/* Project */}
                    <Button
                      className="p-6 hover:cursor-pointer w-full"
                      variant="outline"
                      onClick={() => {
                        setShowProjectSelect(true);
                        setShowTaskSelect(false);
                      }}
                    >
                      <FolderKanban className="text-green-500 mr-2" />
                      {selectedProject
                        ? selectedProject.title
                        : "Select Project"}
                    </Button>

                    {showProjectSelect && (
                      <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Search projects..." />
                        <CommandList>
                          <CommandEmpty>No projects found.</CommandEmpty>
                          <CommandGroup heading="Projects">
                            {projects?.map((project: any) => (
                              <CommandItem
                                key={project.id}
                                onSelect={() => {
                                  sendAttachment("project", project);
                                  setShowProjectSelect(false);
                                }}
                              >
                                <FolderKanban className="mr-2 h-4 w-4" />
                                {project.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    )}

                    {showTaskSelect && (
                      <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Search tasks..." />
                        <CommandList>
                          <CommandEmpty>No tasks found.</CommandEmpty>
                          <CommandGroup heading="Tasks">
                            {tasks?.map((task: any) => (
                              <CommandItem
                                key={task.id}
                                onSelect={() => {
                                  sendAttachment("task", task);
                                  setShowTaskSelect(false);
                                }}
                              >
                                <SquareCheckBig className="mr-2 h-4 w-4" />
                                {task.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    )}
                  </article>
                </PopoverContent>
              </Popover>
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
          )}
        </article>
      ) : (
        <article className="flex flex-col gap-2 items-center justify-center h-full">
          <Ghost
            className="text-muted-foreground"
            size={58}
            strokeWidth={1.5}
          />
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
