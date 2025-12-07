import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        // --- ENTITY CLASSES ---

        class Star {
            x: number;
            y: number;
            size: number;
            vx: number;
            vy: number;
            alpha: number;
            twinkleSpeed: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.alpha = Math.random();
                this.twinkleSpeed = 0.01 + Math.random() * 0.03;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha += this.twinkleSpeed;

                if (this.alpha > 1 || this.alpha < 0.2) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }

                // Wrap around
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        class ShootingStar {
            x: number;
            y: number;
            length: number;
            vx: number;
            vy: number;
            life: number;
            active: boolean;

            constructor() {
                this.active = true;
                this.x = Math.random() * width;
                this.y = Math.random() * height * 0.5; // Start mostly in top half
                this.length = 50 + Math.random() * 100;
                const speed = 10 + Math.random() * 10;
                const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5; // Diagonal roughly
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.02;
                if (this.life <= 0) this.active = false;
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (!this.active) return;
                const tailX = this.x - this.vx * 2;
                const tailY = this.y - this.vy * 2;

                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.life})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.lineWidth = 2;
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();
            }
        }

        class BlackHole {
            x: number;
            y: number;
            size: number;
            maxSize: number;
            life: number; // 0 to 1 transitions
            state: 'growing' | 'stable' | 'shrinking' | 'dead';
            rotation: number;

            constructor() {
                this.x = Math.random() * (width - 200) + 100;
                this.y = Math.random() * (height - 200) + 100;
                this.size = 0;
                this.maxSize = 30 + Math.random() * 50;
                this.state = 'growing';
                this.life = 0;
                this.rotation = 0;
            }

            update() {
                this.rotation += 0.1;

                switch (this.state) {
                    case 'growing':
                        this.life += 0.01;
                        this.size = this.maxSize * this.easeOutBack(this.life);
                        if (this.life >= 1) {
                            this.life = 1;
                            this.state = 'stable';
                            setTimeout(() => { if (this.state === 'stable') this.state = 'shrinking' }, 3000); // Stay for 3s
                        }
                        break;
                    case 'stable':
                        // Pulsate slightly
                        this.size = this.maxSize + Math.sin(this.rotation) * 2;
                        break;
                    case 'shrinking':
                        this.life -= 0.01;
                        this.size = this.maxSize * this.life;
                        if (this.life <= 0) this.state = 'dead';
                        break;
                }
            }

            easeOutBack(x: number): number {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.state === 'dead') return;

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                // Accretion Disk (Glow)
                const gradient = ctx.createRadialGradient(0, 0, this.size * 0.5, 0, 0, this.size * 2.5);
                gradient.addColorStop(0, 'rgba(0,0,0,1)'); // Event Horizon
                gradient.addColorStop(0.4, 'rgba(100, 0, 100, 1)'); // Purple inner ring
                gradient.addColorStop(0.6, 'rgba(200, 50, 200, 0.5)'); // Pink mid
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade out

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Event Horizon (Black center)
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
                ctx.fill();

                // Swirls
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 4; i++) {
                    ctx.beginPath();
                    ctx.rotate(Math.PI / 2);
                    ctx.moveTo(this.size, 0);
                    ctx.quadraticCurveTo(this.size * 2, this.size, this.size * 2.5, 0);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        // --- MAIN LOOP ---

        const stars: Star[] = Array.from({ length: 200 }, () => new Star());
        let shootingStars: ShootingStar[] = [];
        let blackHole: BlackHole | null = null;
        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Background Gradient
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            gradient.addColorStop(0, 'rgba(10, 20, 40, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Update & Draw Stars
            stars.forEach(star => {
                star.update();
                star.draw(ctx);
            });

            // Spawn Shooting Stars (approx every 1-2 seconds @ 60fps)
            if (Math.random() < 0.015) {
                shootingStars.push(new ShootingStar());
            }

            // Update & Draw Shooting Stars
            shootingStars = shootingStars.filter(s => s.active);
            shootingStars.forEach(s => {
                s.update();
                s.draw(ctx);
            });

            // Spawn Black Hole (Rare event: ~0.1% chance per frame if none exists)
            if (!blackHole && Math.random() < 0.001) {
                blackHole = new BlackHole();
            }

            // Update & Draw Black Hole
            if (blackHole) {
                blackHole.update();
                blackHole.draw(ctx);
                if (blackHole.state === 'dead') {
                    blackHole = null;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
