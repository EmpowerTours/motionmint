'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export default function HLSPlayer({
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) video.play().catch(() => {});
      });
    }
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      controls={controls}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
