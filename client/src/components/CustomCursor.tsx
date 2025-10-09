import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const isPointerRef = useRef(false);
  const isClickingRef = useRef(false);

  useEffect(() => {
    // Hide custom cursor on mobile
    if (window.matchMedia('(max-width: 768px)').matches) {
      return;
    }

    let rafId: number;

    const updateCursor = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const isInteractive =
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null;

      if (isInteractive !== isPointerRef.current) {
        isPointerRef.current = isInteractive;
        updateStyles();
      }
    };

    const updateStyles = () => {
      if (!dotRef.current || !ringRef.current) return;

      const dot = dotRef.current;
      const ring = ringRef.current;

      // Update dot classes
      if (isClickingRef.current) {
        dot.style.transform = 'scale(0.5)';
        dot.style.backgroundColor = 'hsl(20, 90%, 55%)'; // accent
      } else if (isPointerRef.current) {
        dot.style.transform = 'scale(2)';
        dot.style.backgroundColor = 'hsl(145, 63%, 42%)'; // primary
      } else {
        dot.style.transform = 'scale(1)';
        dot.style.backgroundColor = 'hsl(145, 63%, 42%)'; // primary
      }

      // Update ring classes
      if (isPointerRef.current) {
        ring.style.transform = 'scale(1.8)';
        ring.style.borderColor = 'hsl(145, 63%, 42%)';
        ring.style.opacity = '0.5';
      } else if (isClickingRef.current) {
        ring.style.transform = 'scale(0.75)';
        ring.style.borderColor = 'hsl(20, 90%, 55%)';
        ring.style.opacity = '0.5';
      } else {
        ring.style.transform = 'scale(1)';
        ring.style.borderColor = 'hsl(145, 63%, 42%)';
        ring.style.opacity = '0.5';
      }
    };

    const animate = () => {
      if (dotRef.current && ringRef.current) {
        const { x, y } = positionRef.current;

        // Direct style manipulation for maximum performance
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
        ringRef.current.style.left = `${x}px`;
        ringRef.current.style.top = `${y}px`;
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseDown = () => {
      isClickingRef.current = true;
      updateStyles();
    };

    const handleMouseUp = () => {
      isClickingRef.current = false;
      updateStyles();
    };

    // Start animation loop
    rafId = requestAnimationFrame(animate);

    // Add event listeners
    window.addEventListener('mousemove', updateCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Hide on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }

        .custom-cursor-dot {
          position: fixed;
          width: 8px;
          height: 8px;
          margin: -4px 0 0 -4px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
          transition: transform 0.15s cubic-bezier(0.33, 1, 0.68, 1),
                      background-color 0.15s ease;
        }

        .custom-cursor-ring {
          position: fixed;
          width: 32px;
          height: 32px;
          margin: -16px 0 0 -16px;
          border: 2px solid;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          will-change: transform;
          transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1),
                      border-color 0.2s ease,
                      opacity 0.2s ease;
        }
      `}</style>

      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          backgroundColor: 'hsl(145, 63%, 42%)',
          transform: 'scale(1)',
        }}
      />

      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          borderColor: 'hsl(145, 63%, 42%)',
          opacity: '0.5',
          transform: 'scale(1)',
        }}
      />
    </>
  );
}
