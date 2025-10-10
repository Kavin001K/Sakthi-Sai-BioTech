import { useRef, ReactNode, useCallback, useEffect } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  disabled?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  disabled = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current || disabled) return;

    // Cancel previous animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Direct DOM manipulation for performance
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  }, [maxTilt, disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || disabled) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, [disabled]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || disabled) return;

    card.addEventListener('mousemove', handleMouseMove as any);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove as any);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, disabled]);

  // Disable on mobile/touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
