import { useParallax } from '@/hooks/useScrollAnimation';
import { ReactNode, memo } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  disabled?: boolean;
}

const ParallaxSection = memo(function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
  direction = 'up',
  disabled = false,
}: ParallaxSectionProps) {
  const { elementRef, offset } = useParallax(speed);

  // Disable on mobile for performance
  if (disabled || (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches)) {
    return <div className={className}>{children}</div>;
  }

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return `translate3d(0, ${-offset}px, 0)`;
      case 'down':
        return `translate3d(0, ${offset}px, 0)`;
      case 'left':
        return `translate3d(${-offset}px, 0, 0)`;
      case 'right':
        return `translate3d(${offset}px, 0, 0)`;
      default:
        return `translate3d(0, ${-offset}px, 0)`;
    }
  };

  return (
    <div ref={elementRef} className={className}>
      <div
        style={{
          transform: getTransform(),
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default ParallaxSection;

interface ParallaxBackgroundProps {
  imageUrl: string;
  className?: string;
  children?: ReactNode;
  speed?: number;
  overlayOpacity?: number;
}

export const ParallaxBackground = memo(function ParallaxBackground({
  imageUrl,
  className = '',
  children,
  speed = 0.5,
  overlayOpacity = 0.5,
}: ParallaxBackgroundProps) {
  const { elementRef, offset } = useParallax(speed);

  // Disable on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />
        <div className="relative z-20">{children}</div>
      </div>
    );
  }

  return (
    <div ref={elementRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate3d(0, ${offset}px, 0)`,
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
});
