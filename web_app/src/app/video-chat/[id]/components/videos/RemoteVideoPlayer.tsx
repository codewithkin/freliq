"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/generated/prisma";

interface Props {
  stream: MediaStream;
  muted?: boolean;
  user: User;
}

export default function RemoteVideoPlayer({
  stream,
  muted = false,
  user,
}: Props) {
  return (
    <div className="w-full h-full relative">
      <Badge className="bg-white py-2 gap-2 flex items-center text-slate-600 absolute left-4 top-4">
        <Avatar>
          <AvatarFallback>
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
          <AvatarImage src={user?.image ?? ""} />
        </Avatar>
        <article className="flex flex-col">
          <h3 className="text-xs md:text-sm font-semibold">{user?.email}</h3>
        </article>
      </Badge>

      <video
        autoPlay
        muted={muted}
        playsInline
        ref={(video) => {
          if (video) video.srcObject = stream;
        }}
        className="w-full h-full rounded-lg border border-gray-200"
      />
    </div>
  );
}
