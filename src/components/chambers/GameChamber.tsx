import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Play, RefreshCw, Layers, Shield, Trophy } from 'lucide-react';

interface Block {
  x: number;
  y: number;
  size: number;
  color: string;
  vy: number;
  vx: number;
  rotation: number;
  vRot: number;
  bounces: number;
  isCustomSpawn?: boolean;
}

export default function GameChamber() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [spawnColor, setSpawnColor] = useState<string>('#0057FF');
  const [debugLog, setDebugLog] = useState<string>('SYS_ON: PIPELINE REAL-TIME CONNECTED');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let blocks: Block[] = [];
    const colors = ['#0057FF', '#00C8FF', '#111111', '#FF4455', '#33CC66'];

    const setSize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Initial floating geometric blocks representing levels
    for (let i = 0; i < 15; i++) {
      blocks.push(spawnBlock(true));
    }

    function spawnBlock(randomY = false): Block {
      return {
        x: Math.random() * (canvas?.width || 800),
        y: randomY ? Math.random() * (canvas?.height || 500) : -40,
        size: Math.random() * 20 + 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.05,
        bounces: 0
      };
    }

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn user rigid bodies
      blocks.push({
        x,
        y,
        size: Math.random() * 28 + 16,
        color: spawnColor,
        vy: -5, // Burst up
        vx: (Math.random() - 0.5) * 4,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.1,
        bounces: 0,
        isCustomSpawn: true
      });

      setScore(prev => prev + 100);
      setDebugLog(`RENDERED INTEGRAL_VOXEL AT [${x.toFixed(0)}, ${y.toFixed(0)}]`);

      if (blocks.length > 50) {
        blocks.shift();
      }
    };
    canvas.addEventListener('mousedown', handleCanvasClick);

    // Core loop
    const run = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render wireframe background matrix grid
      ctx.strokeStyle = 'rgba(0, 87, 255, 0.015)';
      ctx.lineWidth = 1;
      const grid = 60;
      for (let x = 0; x < canvas.width; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw active player sandbox floor (dotted neon coordinate index)
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.06)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 80);
      ctx.lineTo(canvas.width, canvas.height - 80);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(17, 17, 17, 0.4)';
      ctx.font = '8px "JetBrains Mono"';
      ctx.fillText('COLLISION INDEX PLANE: Y // 0.88h', 30, canvas.height - 90);

      // Physics calculation & Render
      blocks.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.vRot;

        // Gravity pull
        b.vy += 0.14;

        // Bounce left and right
        if (b.x < b.size || b.x > canvas.width - b.size) {
          b.vx *= -0.7;
          b.x = b.x < b.size ? b.size : canvas.width - b.size;
        }

        // Floor collision
        const floorY = canvas.height - 80;
        if (b.y > floorY - b.size) {
          b.y = floorY - b.size;
          b.vy *= -0.62; // soft kinetic bounce
          b.vx *= 0.95;  // sliding friction
          b.bounces += 1;
        }

        // Draw physical rigid-body block
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);

        if (b.isCustomSpawn) {
          // Glass volumetric block
          ctx.fillStyle = b.color;
          ctx.globalAlpha = 0.85;
          ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#FFFFFF';
          ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size);
        } else {
          // Minimalist frame with center dot
          ctx.strokeStyle = 'rgba(17, 17, 17, 0.12)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size);
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Spawn occasionally from sky to keep it alive
      if (Math.random() < 0.02 && blocks.length < 30) {
        blocks.push(spawnBlock(false));
      }

      animId = requestAnimationFrame(run);
    };

    run();

    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousedown', handleCanvasClick);
      cancelAnimationFrame(animId);
    };
  }, [spawnColor]);

  const clearCanvas = () => {
    setScore(0);
    setDebugLog('SANDBOX RESET: EMITTED VOXEL MEMORY CLEAR');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      
      {/* Background Interactive physics viewport */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block cursor-cell" />
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 04 // pixel architecture
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            G.Game World Foundry
          </h2>
        </div>

        {/* Playable sandbox controls */}
        <div className="flex gap-2 pointer-events-auto">
          {['#0057FF', '#00C8FF', '#FF4455', '#33CC66'].map((color) => (
            <button
              key={color}
              onClick={() => setSpawnColor(color)}
              className="w-5 h-5 rounded-full border border-white hover:scale-110 transition-transform cursor-pointer"
              style={{
                backgroundColor: color,
                boxShadow: spawnColor === color ? `0 0 0 2px #111111` : undefined
              }}
            />
          ))}

          <button 
            onClick={clearCanvas}
            className="flex items-center gap-1 bg-white hover:bg-neutral-100 border border-[#111111]/10 px-2.5 py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> RESET
          </button>
        </div>
      </div>

      {/* Retro Arcade overlay card */}
      <div className="absolute top-28 right-8 z-10 hidden md:flex flex-col bg-white/90 border border-[#111111]/10 rounded-lg p-4 font-mono text-[9px] gap-2 shadow-[0_12px_30px_rgba(0,0,0,0.03)] glass w-60 text-left">
        <div className="flex justify-between items-center pb-2 border-b border-[#111111]/5">
          <span className="text-[#0057FF] font-bold">ARCADE TELEMETRY</span>
          <span className="text-[#33CC66] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#33CC66] animate-pulse" /> ONLINE
          </span>
        </div>
        <div className="flex justify-between text-[#111111]/60">
          <span>SPAWNED VOXELS:</span>
          <span className="font-bold text-[#111111]">{score / 10} units</span>
        </div>
        <div className="flex justify-between text-[#111111]/60">
          <span>SCORE / PHYSICS POINT:</span>
          <span className="font-bold text-[#0057FF]">{score} pts</span>
        </div>
        <p className="text-[8px] text-[#111111]/40 border-t border-[#111111]/5 pt-2 leading-none">
          {debugLog}
        </p>
      </div>

      {/* Main typography & call to action */}
      <div className="relative z-10 max-w-xl text-left pointer-events-none mt-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#0057FF] font-semibold">
          G.Game ecosystem
        </span>
        <h3 className="font-sans text-[44px] md:text-[60px] font-bold leading-none tracking-tight text-[#111111] mt-2 leading-none">
          Creating Worlds Worth Exploring.
        </h3>
        <p className="font-sans text-xs md:text-sm text-[#111111]/60 mt-4 leading-relaxed max-w-md">
          A game development platform and game ecosystem. Floating worlds, pixel fragments, level maps, and character concepts exist in this room.
        </p>

        {/* CTA Launch link */}
        <div className="mt-6 flex items-center gap-4 pointer-events-auto">
          <motion.a 
            href="https://g-game-site-placeholder.example"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#111111] hover:bg-[#0057FF] text-white px-5 py-3 rounded-lg text-xs font-mono tracking-widest uppercase transition-colors shadow-lg shadow-neutral-900/10 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Gamepad2 className="w-4 h-4 text-white group-hover:animate-bounce" />
            <span>Enter G.Game</span>
          </motion.a>
          
          <div className="font-mono text-[8px] text-[#111111]/40 uppercase flex flex-col leading-none">
            <span>PLATFORM: WEBGL / NATIVE</span>
            <span className="mt-1">SYS.BUILD: v0.98_RELEASE</span>
          </div>
        </div>
      </div>

      {/* Bottom status alert */}
      <div className="relative z-10 w-full flex justify-between items-end text-left pointer-events-none mt-4 text-[9px] font-mono text-[#111111]/40 uppercase tracking-widest hidden sm:flex">
        <span>[ ENGAGEMENT SEQUENCER: READY ]</span>
        <span>CLICK ON SCREEN TO GENERATE RIGID VOXELS</span>
      </div>
    </div>
  );
}
