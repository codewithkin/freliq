"use client";
import { Loader2, Plus } from "lucide-react";
import { Inbox } from "lucide-react";
import NewChatDialog from "./create/NewChatDialog";

function ChatList({
  isLoading,
  chats,
  setChat,
}: {
  isLoading: boolean;
  setChat: any;
  chats: any;
}) {
  return (
    <article className="md:w-1/4 h-full border-r border-slate-300 pr-4 flex flex-col">
      {/* Sticky header */}
      <article className="w-full flex items-center justify-between">
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
        <h3>Chats here</h3>
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
