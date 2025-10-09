import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Hide custom cursor on mobile devices
  if (window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Main cursor dot */}
      <div
        className={`fixed top-0 left-0 w-3 h-3 pointer-events-none z-[9999] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate(${position.x - 6}px, ${position.y - 6}px)`,
          transition: 'transform 0.05s ease-out',
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-150 ${
            isClicking
              ? 'bg-accent scale-75'
              : isPointer
              ? 'bg-primary scale-150'
              : 'bg-primary'
          }`}
        />
      </div>

      {/* Cursor ring */}
      <div
        className={`fixed top-0 left-0 w-10 h-10 border-2 rounded-full pointer-events-none z-[9998] transition-all duration-200 ${
          isVisible ? 'opacity-60' : 'opacity-0'
        } ${
          isPointer
            ? 'border-primary scale-150'
            : isClicking
            ? 'border-accent scale-75'
            : 'border-primary/50'
        }`}
        style={{
          transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
          transition: 'transform 0.15s ease-out, opacity 0.3s, border-color 0.2s, scale 0.2s',
        }}
      />

      {/* Trail effect */}
      <div
        className={`fixed top-0 left-0 w-32 h-32 pointer-events-none z-[9997] transition-opacity duration-300 ${
          isVisible ? 'opacity-20' : 'opacity-0'
        }`}
        style={{
          transform: `translate(${position.x - 64}px, ${position.y - 64}px)`,
          transition: 'transform 0.3s ease-out',
          background: `radial-gradient(circle, ${
            isPointer ? 'hsl(var(--primary))' : 'hsl(var(--accent))'
          } 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
    </>
  );
}
