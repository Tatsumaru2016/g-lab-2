import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function FutureChamber() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const setSize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', setSize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let frame = 0;

    // Draw futuristic wireframe perspective grid
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // Create synthetic perspective lines converging on horizon
      const horizonY = height * 0.55; 
      ctx.strokeStyle = 'rgba(0, 87, 255, 0.04)';
      ctx.lineWidth = 1;

      // Draw horizontal vanishing lines
      const lineCount = 20;
      for (let i = 0; i < lineCount; i++) {
        const py = horizonY + Math.pow(i / lineCount, 2.5) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }

      // Draw vertical perspective rays
      const rayCount = 18;
      for (let i = 0; i <= rayCount; i++) {
        const px = (i / rayCount) * width;
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        // Map rays outward on bounds
        ctx.lineTo(px, height);
        ctx.stroke();
      }

      // Draw a procedurally morphing technology wave across the grid lines
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      const segments = 120;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        
        // Calculate wave combination based on sin waves + mouse proximity
        const baseSine = Math.sin(i * 0.05 + frame * 0.012) * 20;
        const subSine = Math.cos(i * 0.12 - frame * 0.02) * 8;
        
        // Mouse warp pull multiplier
        const mDist = Math.abs(x - mousePos.current.x);
        const mFactor = Math.max(0, 1 - mDist / 200);
        const warp = Math.sin(frame * 0.1) * 35 * mFactor;

        const y = horizonY + baseSine + subSine + warp;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Additional background glowing elements (pulsating stars/nodes on the horizon)
      ctx.fillStyle = 'rgba(0, 87, 255, 0.3)';
      ctx.shadowColor = '#0057FF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(width / 2, horizonY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      ctx.fillStyle = 'rgba(17, 17, 17, 0.3)';
      ctx.font = '8px "JetBrains Mono"';
      ctx.fillText('HORIZON ANGLE: P_INFINITY', width / 2 - 60, horizonY - 10);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      
      {/* Wave landscape viewport canvas */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 08 // dynamic horizons
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            G.Lab Infinite Vector Field
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#111111]/40 flex gap-1.5 items-center uppercase font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#0057FF]" />
          <span>HORIZON METRICS: REAL-TIME OPTIMIZATION</span>
        </div>
      </div>

      {/* Hero Typography */}
      <div className="relative z-10 text-center my-auto flex flex-col items-center justify-center max-w-4xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, type: 'spring' }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#0057FF] font-black">
            tomorrow is an open protocol
          </span>
          <h2 className="font-sans text-5xl md:text-8xl font-black leading-none tracking-tighter text-[#111111] mt-4 uppercase">
            The Next Experiment <br /> Starts Here.
          </h2>
        </motion.div>
      </div>

      {/* Bottom info row */}
      <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
        <div className="max-w-md pointer-events-none">
          <p className="font-sans text-sm text-[#111111]/70 leading-relaxed">
            The mathematical curves of Chamber 08 reflect a technology horizon. Every product starts as a vibration on this grid before we form its physical contours in negative space.
          </p>
        </div>
        <div className="font-mono text-[10px] text-[#111111]/40 text-right uppercase tracking-wider leading-none">
          <span>VANISHING PLANE_INDEX: COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
