'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import Hls from 'hls.js';

// Context for Presentation to tell slides whether they're active
export const SlideActiveContext = createContext(true);

interface VideoBackgroundProps {
  src: string;
}

export default function VideoBackground({ src }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const active = useContext(SlideActiveContext);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      // Tear down when slide is not active
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, maxBufferLength: 10, maxMaxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari / iOS native HLS
      video.src = src;
      video.load();
      const onLoaded = () => video.play().catch(() => {});
      video.addEventListener('loadedmetadata', onLoaded);
      return () => {
        video.removeEventListener('loadedmetadata', onLoaded);
        video.removeAttribute('src');
        video.load();
      };
    }
  }, [src, active]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
    />
  );
}
