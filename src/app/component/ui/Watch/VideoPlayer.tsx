"use client";

import React, { useRef } from "react";

interface CustomVideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: CustomVideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div
      ref={playerRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden"
    >
      <iframe
        ref={iframeRef}
        src={videoUrl}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default VideoPlayer;
