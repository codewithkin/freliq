"use client";

import { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  muted = true,
}: {
  stream: MediaStream;
  muted?: boolean;
}) {
  return (
    <video
      autoPlay
      muted={muted}
      playsInline
      ref={(video) => {
        if (video && stream) video.srcObject = stream;
      }}
      className="w-full rounded-lg border border-gray-200"
    />
  );
}
