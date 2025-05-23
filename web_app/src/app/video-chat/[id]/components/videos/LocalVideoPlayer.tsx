"use client";

import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneCall,
  Maximize,
  Minimize,
  MonitorX,
  MonitorUp,
} from "lucide-react";
import { User } from "@/generated/prisma";

interface Props {
  stream: MediaStream;
  user: User;
  hangUp: () => void;
  muted: boolean;
  setMuted: () => void;
  toggleVideo: () => void;
  videoDisabled: boolean;
  shareScreen: any;
  sharingScreen: any;
  setSharingScreen: any;
}

export default function VideoPlayer({
  stream,
  user,
  hangUp,
  muted,
  setMuted,
  toggleVideo,
  videoDisabled,
  shareScreen,
  sharingScreen,
  setSharingScreen,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [screenShareSupported, setScreenShareSupported] = useState(true);

  useEffect(() => {
    // Check if device is mobile
    const checkIfMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsMobile(isMobileDevice);
    };

    // Check if screen sharing is supported
    const checkScreenShareSupport = () => {
      const isSupported =
        navigator.mediaDevices &&
        "getDisplayMedia" in navigator.mediaDevices &&
        !!navigator.mediaDevices.getDisplayMedia;
      setScreenShareSupported(isSupported);
    };

    checkIfMobile();
    checkScreenShareSupport();
  }, []);

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

  const showScreenShareButton = !isMobile && screenShareSupported;

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
          <h3 className="text-lg font-semibold">You</h3>
        </article>
      </Badge>

      {sharingScreen && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs">
          Screen Sharing
        </div>
      )}

      {!videoDisabled ? (
        <video
          autoPlay
          muted={muted}
          playsInline
          ref={(video) => {
            if (video) video.srcObject = stream;
          }}
          className="w-full h-full rounded-lg border border-gray-200"
        />
      ) : (
        <article
          style={{
            backgroundImage: `url(${user?.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-full h-full min-h-[400px] md:min-h-[600px] rounded-lg border border-gray-200 bg-slate-900 flex justify-center items-center"
        >
          {!user?.image && (
            <Avatar className="w-48 h-48">
              <AvatarFallback className="text-5xl">
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          )}
        </article>
      )}

      <button
        onClick={toggleFullscreen}
        className="absolute bottom-24 right-4 p-2 bg-black/40 text-white rounded-md hover:bg-black/60 transition"
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4" />
        ) : (
          <Maximize className="w-4 h-4" />
        )}
      </button>

      <div className="absolute bottom-5 w-full flex justify-center items-center">
        <div className="rounded-full bg-transparent backdrop-blur-xl p-4 gap-2 flex items-center shadow-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleVideo}
                  size="lg"
                  variant="secondary"
                  className="rounded-full"
                >
                  {videoDisabled ? <CameraOff /> : <Camera />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{videoDisabled ? "Turn on" : "Turn off"} Camera</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={hangUp}
                  size="lg"
                  variant="destructive"
                  className="rounded-full"
                >
                  <PhoneCall />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hang up</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={setMuted}
                  size="lg"
                  variant="secondary"
                  className="rounded-full"
                >
                  {muted ? <MicOff /> : <Mic />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{muted ? "Unmute" : "Mute"} Microphone</p>
              </TooltipContent>
            </Tooltip>

            {showScreenShareButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      await shareScreen();
                    }}
                    size="lg"
                    variant="secondary"
                    className="rounded-full"
                  >
                    {sharingScreen ? <MonitorX /> : <MonitorUp />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sharingScreen ? "Stop Sharing" : "Share"} Screen</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
