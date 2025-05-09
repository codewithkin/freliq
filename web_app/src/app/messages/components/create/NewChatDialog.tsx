import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatRoom, Project } from "@/generated/prisma";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Loader, Plus, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { queryClient } from "@/providers/QueryClientProvider";
import Link from "next/link";

function NewChatDialog({ setChat, sm }: { setChat: any; sm?: boolean | null }) {
  // Fetch all of the user's projects
  const { data: projects, isLoading: loading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      // Make a request to the backend route
      const res = await axios.get("/api/projects/list");

      return res.data;
    },
  });

  const { mutate: createChat, isPending: creatingChat } = useMutation({
    mutationKey: ["createProject"],
    mutationFn: async (projectId: string) => {
      // Make a request to the endpoint
      const res = await axios.post("/api/chats", { projectId });

      return res.data.chatRoom;
    },
    onSuccess: (chatRoom: ChatRoom) => {
      console.log("ChatRoom received after creation: ", chatRoom);

      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });

      // Update the local state to the chatRoom
      setChat(chatRoom);

      toast.success("Chat created successfully");

      // Close the modal
      document.getElementById("close")?.click();
    },
    onError: () => {
      toast.error("Could not create chat");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {sm ? (
          <Button size="icon" variant="outline">
            <Plus />
          </Button>
        ) : (
          <Button>
            Create chat <Plus />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new chat</DialogTitle>
          <DialogDescription>
            Create a new chat for a project then invite someone into the chat
          </DialogDescription>
        </DialogHeader>

        <article>
          {loading ? (
            <Skeleton className="bg-slate-200 w-full h-4" />
          ) : projects.length > 0 ? (
            <article className="flex flex-col gap-4 max-h-[400px] overflow-y-auto my-8">
              {projects.map((project: Project, index: number) => (
                <article
                  key={index}
                  className="flex justify-between items-center"
                >
                  <article className="flex gap-2 items-center">
                    {/* Add an avatar with a "P" for project */}
                    <Avatar className="w-12 h-12 bg-slate-200">
                      {/* Force the Avatar image to show */}
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="h-12 w-12 bg-slate-200">
                        P
                      </AvatarFallback>
                    </Avatar>

                    {/* Project data */}
                    <article className="flex flex-col">
                      <h4 className="text-lg font-medium capitalize">
                        {project.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Created {formatDistanceToNow(project.createdAt)} ago
                      </p>
                    </article>
                  </article>

                  {/* Actions */}
                  <Button
                    onClick={() => {
                      // Call the create chat mutation
                      createChat(project.id);
                    }}
                    disabled={creatingChat}
                    variant="default"
                  >
                    {creatingChat ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <PlusCircle />
                    )}
                  </Button>
                </article>
              ))}
            </article>
          ) : (
            <article className="flex flex-col gap-2 items-center justify-center text-center">
              <h2>No projects yet</h2>
              <p className="text-muted-foreground">
                Please create a project to create a chat
              </p>
              <Button asChild variant="outline">
                <Link href="/project/new">
                  <span>New Project</span>
                </Link>
              </Button>
            </article>
          )}
        </article>

        <DialogFooter>
          <DialogClose id="close">Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatDialog;
