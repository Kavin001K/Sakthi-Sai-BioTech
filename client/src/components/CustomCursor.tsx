import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
    };

    const animate = () => {
      setPosition(cursorRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Hide custom cursor on mobile devices
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Main cursor dot - instant follow */}
      <div
        className={`fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] transition-opacity duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          willChange: 'transform',
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-100 ${
            isClicking
              ? 'bg-accent scale-50'
              : isPointer
              ? 'bg-primary scale-[2]'
              : 'bg-primary'
          }`}
          style={{ willChange: 'transform, background-color' }}
        />
      </div>

      {/* Cursor ring - smooth follow */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-[9998] transition-all ${
          isVisible ? 'opacity-50' : 'opacity-0'
        } ${
          isPointer
            ? 'border-primary scale-[1.8] duration-200'
            : isClicking
            ? 'border-accent scale-75 duration-100'
            : 'border-primary/60 duration-300'
        }`}
        style={{
          transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0)`,
          willChange: 'transform',
        }}
      />
    </>
  );
}
