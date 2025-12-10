import React, { useEffect, useRef } from 'react';
import { OracleState } from '../types';

interface CrystalBallProps {
  state: OracleState;
}

export const CrystalBall: React.FC<CrystalBallProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const particles: {x: number, y: number, r: number, speed: number, angle: number}[] = [];
    for(let i=0; i<50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.1,
            angle: Math.random() * Math.PI * 2
        });
    }

    const render = () => {
      time += 0.01;
      
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Base gradient based on state
      let centerColor = 'rgba(100, 200, 255, 0.1)';
      let outerColor = 'rgba(20, 0, 50, 0.1)';

      if (state === OracleState.PROCESSING) {
        centerColor = 'rgba(255, 100, 200, 0.2)'; // Pink/Purple for processing
      } else if (state === OracleState.SPEAKING) {
        centerColor = 'rgba(255, 215, 0, 0.2)'; // Gold for speaking
      }

      // Draw mystical swirling mist
      ctx.save();
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(time * 0.2);
      
      const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 120);
      gradient.addColorStop(0, centerColor);
      gradient.addColorStop(0.5, 'rgba(50, 100, 200, 0.05)');
      gradient.addColorStop(1, outerColor);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.fill();

      // Particles
      particles.forEach((p, i) => {
        const radius = 100 + Math.sin(time + i) * 20;
        p.angle += p.speed * (state === OracleState.PROCESSING ? 0.05 : 0.01);
        
        const px = Math.cos(p.angle) * radius;
        const py = Math.sin(p.angle) * radius * 0.8; // Perspective tilt

        ctx.beginPath();
        ctx.fillStyle = state === OracleState.SPEAKING 
            ? `rgba(255, 215, 0, ${Math.random() * 0.8})` 
            : `rgba(100, 255, 255, ${Math.random() * 0.5})`;
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [state]);

  // CSS classes for outer shell effects
  const glowClass = state === OracleState.PROCESSING ? 'shadow-[0_0_80px_rgba(200,50,200,0.6)]' 
                  : state === OracleState.SPEAKING ? 'shadow-[0_0_100px_rgba(255,215,0,0.5)]'
                  : 'shadow-[0_0_50px_rgba(50,150,255,0.4)]';

  const borderClass = state === OracleState.PROCESSING ? 'border-fuchsia-500/30'
                    : state === OracleState.SPEAKING ? 'border-yellow-500/30'
                    : 'border-cyan-500/30';

  return (
    <div className="relative flex items-center justify-center w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px]">
        {/* Outer Rings */}
        <div className={`absolute inset-0 rounded-full border border-opacity-20 animate-spin-slow duration-[20s] ${borderClass}`} style={{ transform: 'rotateX(60deg)'}}></div>
        <div className={`absolute inset-4 rounded-full border border-opacity-20 animate-reverse-spin duration-[15s] ${borderClass}`}></div>
        
        {/* The Crystal Ball Container */}
        <div 
            className={`relative w-60 h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden backdrop-blur-sm transition-all duration-1000 ${glowClass}`}
            style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.8) 80%)',
                boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.8), inset 20px 20px 50px rgba(255,255,255,0.1)'
            }}
        >
            <canvas 
                ref={canvasRef} 
                width={320} 
                height={320} 
                className="w-full h-full opacity-80 mix-blend-screen"
            />
            {/* Reflection Highlight */}
            <div className="absolute top-4 left-6 w-20 h-10 bg-white opacity-20 blur-xl rounded-full transform -rotate-45 pointer-events-none"></div>
        </div>
    </div>
  );
};