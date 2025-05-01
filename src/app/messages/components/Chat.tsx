import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ghost, MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

function Chat({ chat }: Readonly<{ chat: any | null }>) {
  return (
    <article className="md:w-3/4">
      {chat ? (
        <article>
          {/* Chat page */}

          {/* Header */}
          <article className="flex justify-between items-center border-b border-slate-300 p-4">
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
                <Button asChild>
                  <Link href={`/project/invite/${chat?.project?.id}`}>
                    Invite
                    <PlusCircle />
                  </Link>
                </Button>
              </PopoverContent>
            </Popover>
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
