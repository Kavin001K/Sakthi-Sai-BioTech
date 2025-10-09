import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  src?: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export default function BackgroundVideo({
  src = "/Bg.mp4",
  className = "",
  overlay = true,
  overlayOpacity = 0.6
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Autoplay video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        data-testid="background-video"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}
