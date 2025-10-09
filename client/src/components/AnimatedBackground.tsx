import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'waves' | 'gradient' | 'mesh';
  className?: string;
}

export default function AnimatedBackground({
  variant = 'gradient',
  className = ''
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (variant !== 'particles' && variant !== 'waves') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(34, 197, 94, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Wave animation
    let waveOffset = 0;
    const drawWaves = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawWave = (amplitude: number, frequency: number, offset: number, opacity: number) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin((x + offset) * frequency) * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `rgba(34, 197, 94, ${opacity})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * 0.3})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      };

      drawWave(60, 0.005, waveOffset, 0.1);
      drawWave(40, 0.007, waveOffset * 1.5, 0.15);
      drawWave(30, 0.009, waveOffset * 2, 0.2);

      waveOffset += 0.5;
    };

    // Initialize particles
    if (variant === 'particles') {
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    }

    // Animation loop
    const animate = () => {
      if (variant === 'particles') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              ctx.strokeStyle = `rgba(34, 197, 94, ${0.2 * (1 - distance / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      } else if (variant === 'waves') {
        drawWaves();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  if (variant === 'gradient') {
    return (
      <div className={`absolute inset-0 bg-gradient-animated ${className}`} />
    );
  }

  if (variant === 'mesh') {
    return (
      <div className={`absolute inset-0 bg-mesh-gradient ${className}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}
