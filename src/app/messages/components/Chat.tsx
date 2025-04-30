import { Ghost } from "lucide-react";

function Chat({ chat }: Readonly<{ chat: any | null }>) {
  return (
    <article className="p-4 md:w-3/4">
      {chat ? (
        <h2>Chat data here</h2>
      ) : (
        <article className="flex flex-col gap-2 items-center justify-center h-full">
          <Ghost className="text-muted-foreground" size={58} strokeWidth={1.5} />

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
