"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  muted = true,
  user,
}: {
  stream: MediaStream;
  muted?: boolean;
  user: any;
}) {
  return (
    <div className="w-full h-full relative">
      {/* User info floating badge */}
      <Badge className="bg-white py-2 gap-2 flex items-center text-slate-600 absolute left-4 top-4">
        {/* User avatar */}
        <Avatar>
          <AvatarFallback>{user?.email?.charAt(0)}</AvatarFallback>
          <AvatarImage src={user?.image} />
        </Avatar>

        {/* User info */}
        <article className="flex flex-col">
          <h3 className="text-md font-semibold">{user?.email}</h3>
          <p className="text-muted-foreground tsxt-sm">{user?.type}</p>
        </article>
      </Badge>

      <video
        autoPlay
        muted={muted}
        playsInline
        ref={(video) => {
          if (video && stream) video.srcObject = stream;
        }}
        className="w-full rounded-lg border border-gray-200"
      />
    </div>
  );
}
