"use client";

import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/generated/prisma";
import { Maximize, Minimize } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
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

      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 p-2 bg-black/40 text-white rounded-md hover:bg-black/60 transition"
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4" />
        ) : (
          <Maximize className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
