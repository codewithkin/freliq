"use client";
import { Loader2, Plus } from "lucide-react";
import { Inbox } from "lucide-react";
import NewChatDialog from "./create/NewChatDialog";
import { ChatRoom } from "@/generated/prisma";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

function ChatList({
  isLoading,
  chats,
  setChat,
  selectedChat,
}: {
  isLoading: boolean;
  setChat: any;
  chats: any;
  selectedChat?: any | null;
}) {
  return (
    <article className="md:w-1/4 h-full border-r border-slate-300 flex flex-col">
      {/* Sticky header */}
      <article className="w-full flex items-center justify-between p-4">
        <h3 className="text-xl font-semibold">Your messages</h3>

        {/* Actions */}
        <article className="flex gap-2 items-center">
          <NewChatDialog setChat={setChat} sm={true} />
        </article>
      </article>
      {isLoading ? (
        <article className="w-full h-full flex flex-col justify-center items-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </article>
      ) : chats && chats.length > 0 ? (
        <article className="flex flex-col gap-4 justify-center mt-4">
          <Label className="text-muted-foreground px-4">Chats</Label>
          {chats.map((chat: ChatRoom, index: number) => (
            <article
              onClick={() => setChat(chat)}
              key={index}
              className={` ${chat && chat == selectedChat && "bg-slate-300"} flex items-center justify-between hover:bg-slate-200 hover:cursor-pointer transition duration-300 p-4`}
            >
              <article className="flex gap-2 items-center">
                <Avatar className="w-12 h-12 bg-slate-200 border border-primary">
                  <AvatarImage src={chat?.project?.image} />
                  <AvatarFallback className="w-12 h-12 bg-slate-200 border border-primary">
                    P
                  </AvatarFallback>
                </Avatar>

                <article className="flex flex-col">
                  <h3 className="text-lg font-medium">
                    {chat?.project?.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Created {formatDistanceToNow(chat?.createdAt)} ago
                  </p>
                </article>
              </article>
            </article>
          ))}
        </article>
      ) : (
        <article className="flex-1 flex flex-col justify-center items-center gap-2 text-center">
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
            <NewChatDialog setChat={setChat} />
          </article>
        </article>
      )}
    </article>
  );
}

export default ChatList;
