import { useParallax } from '@/hooks/useScrollAnimation';
import { ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
  direction = 'up',
}: ParallaxSectionProps) {
  const { elementRef, offset } = useParallax(speed);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${-offset}px)`;
      case 'down':
        return `translateY(${offset}px)`;
      case 'left':
        return `translateX(${-offset}px)`;
      case 'right':
        return `translateX(${offset}px)`;
      default:
        return `translateY(${-offset}px)`;
    }
  };

  return (
    <div ref={elementRef} className={className}>
      <div
        style={{
          transform: getTransform(),
          transition: 'transform 0.1s ease-out',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface ParallaxBackgroundProps {
  imageUrl: string;
  className?: string;
  children?: ReactNode;
  speed?: number;
  overlayOpacity?: number;
}

export function ParallaxBackground({
  imageUrl,
  className = '',
  children,
  speed = 0.5,
  overlayOpacity = 0.5,
}: ParallaxBackgroundProps) {
  const { elementRef, offset } = useParallax(speed);

  return (
    <div ref={elementRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s ease-out',
          willChange: 'transform',
          scale: '1.2', // Prevents gaps when scrolling
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
