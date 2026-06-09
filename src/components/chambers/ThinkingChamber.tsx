import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Cpu, Layers, GitBranch, Terminal } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  connections: number[];
  phase: 'idea' | 'sketch' | 'concept' | 'blueprint' | 'product';
  birthTime: number;
  label: string;
}

const CONCEPTS = [
  'Raytracer', 'Neural Node', 'Hologram', 'Audio Synth', 'Router', 
  'L-System', 'Voxel Engine', 'Grid', 'Dyson Sphere', 'FPU Unit'
];

export default function ThinkingChamber() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePhase, setActivePhase] = useState<'all' | 'idea' | 'sketch' | 'concept' | 'blueprint' | 'product'>('all');
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<string | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const maxParticles = 60;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(canvas.width, canvas.height, true));
    }

    function createParticle(w: number, h: number, initial = false): Particle {
      const phases: Particle['phase'][] = ['idea', 'sketch', 'concept', 'blueprint', 'product'];
      const chosenPhase = phases[Math.floor(Math.random() * phases.length)];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        connections: [],
        phase: chosenPhase,
        birthTime: Date.now(),
        label: CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)]
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn 5 grouped particles of matching dynamic phase
      const spawnPhase: Particle['phase'][] = ['idea', 'sketch', 'concept', 'blueprint', 'product'];
      const clickPhase = activePhase === 'all' ? spawnPhase[Math.floor(Math.random() * 5)] : activePhase as Particle['phase'];

      for (let i = 0; i < 5; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 4 + 2,
          alpha: 1.0,
          pulseSpeed: 0.04,
          connections: [],
          phase: clickPhase,
          birthTime: Date.now(),
          label: CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)]
        });
      }

      if (particles.length > 100) {
        particles.splice(0, particles.length - 100);
      }
    };
    canvas.addEventListener('click', handleCanvasClick);

    // Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle tech reference grids
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSpacing = 40;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse gravity pull
        const dx = mousePos.current.x - p.x;
        const dy = mousePos.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.vx += (dx / dist) * 0.02;
          p.vy += (dy / dist) * 0.02;
          // cap speed
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 2) {
            p.vx = (p.vx / speed) * 2;
            p.vy = (p.vy / speed) * 2;
          }
        }

        // Pulse alpha
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.9) p.alpha = 0.9;

        // Filter phase
        const matchesFilter = activePhase === 'all' || p.phase === activePhase;
        const finalAlpha = matchesFilter ? p.alpha : p.alpha * 0.15;

        // Draw particle based on its complexity phase
        ctx.fillStyle = getPhaseColor(p.phase, finalAlpha);

        if (p.phase === 'idea') {
          // Simplest glowing circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.phase === 'sketch') {
          // Tiny diamond shape
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.radius - 2);
          ctx.lineTo(p.x + p.radius + 2, p.y);
          ctx.lineTo(p.x, p.y + p.radius + 2);
          ctx.lineTo(p.x - p.radius - 2, p.y);
          ctx.closePath();
          ctx.fill();
        } else if (p.phase === 'concept') {
          // Circle with crosshairs
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(17, 17, 17, ${finalAlpha * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(p.x - 6, p.y); ctx.lineTo(p.x + 6, p.y);
          ctx.moveTo(p.x, p.y - 6); ctx.lineTo(p.x, p.y + 6);
          ctx.stroke();
        } else if (p.phase === 'blueprint') {
          // Multi-ring circle with metric text
          ctx.strokeStyle = getPhaseColor('blueprint', finalAlpha * 0.8);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(0, 87, 255, ${finalAlpha})`;
          ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
        } else if (p.phase === 'product') {
          // Solid square with volumetric borders
          ctx.strokeStyle = getPhaseColor('product', finalAlpha);
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x - 5, p.y - 5, 10, 10);
          ctx.fillStyle = getPhaseColor('product', finalAlpha * 0.3);
          ctx.fillRect(p.x - 5, p.y - 5, 10, 10);
        }

        // Draw dynamic typography labels next to products/blueprints
        if ((p.phase === 'blueprint' || p.phase === 'product' || p.phase === 'concept') && dist < 120 && matchesFilter) {
          ctx.fillStyle = `rgba(17, 17, 17, ${0.4 + finalAlpha * 0.6})`;
          ctx.font = '8px "JetBrains Mono"';
          ctx.fillText(`${p.label}.${p.phase.toUpperCase()}`, p.x + 10, p.y + 3);
          
          // Hover status feedback
          if (dist < 30) {
            setHoveredNodeInfo(`NODE // PHASE: ${p.phase.toUpperCase()} [ID: ${p.label}] COORDINATES: [${p.x.toFixed(0)}, ${p.y.toFixed(0)}]`);
          }
        }
      });

      // Connect particles matching phases
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const isFilterMatch = activePhase === 'all' || (p1.phase === activePhase && p2.phase === activePhase);

          if (!isFilterMatch) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            // Lines representing physical connections
            const maxDist = 100;
            const lineAlpha = (1 - dist / maxDist) * 0.25;
            ctx.lineWidth = p1.phase === 'blueprint' ? 0.75 : 0.5;

            if (p1.phase === 'idea') {
              ctx.strokeStyle = `rgba(170, 170, 170, ${lineAlpha})`;
            } else if (p1.phase === 'sketch') {
              ctx.strokeStyle = `rgba(17, 17, 17, ${lineAlpha})`;
              // Draw dashed
              ctx.setLineDash([2, 2]);
            } else if (p1.phase === 'concept') {
              ctx.strokeStyle = `rgba(0, 200, 255, ${lineAlpha})`;
              ctx.setLineDash([]);
            } else if (p1.phase === 'blueprint') {
              ctx.strokeStyle = `rgba(0, 87, 255, ${lineAlpha * 1.5})`;
              ctx.setLineDash([]);
            } else if (p1.phase === 'product') {
              ctx.strokeStyle = `rgba(0, 87, 255, ${lineAlpha * 2.0})`;
              ctx.setLineDash([]);
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.setLineDash([]); // Reset
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationId);
    };
  }, [activePhase]);

  function getPhaseColor(phase: Particle['phase'], alpha: number) {
    switch (phase) {
      case 'idea': return `rgba(170, 170, 170, ${alpha})`;
      case 'sketch': return `rgba(110, 110, 110, ${alpha})`;
      case 'concept': return `rgba(0, 200, 255, ${alpha})`;
      case 'blueprint': return `rgba(0, 87, 255, ${alpha})`;
      case 'product': return `rgba(0, 87, 255, ${alpha})`;
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      {/* Background canvas for interactive code nodes */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 02 // cognitive synthesis
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            Visualizing Idea Morphing
          </h2>
        </div>

        {/* Phase Selectors */}
        <div className="glass border border-[#111111]/10 rounded-lg p-1 flex gap-1 font-mono text-[9px] pointer-events-auto">
          {(['all', 'idea', 'sketch', 'concept', 'blueprint', 'product'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActivePhase(p)}
              className={`px-2.5 py-1 rounded transition-all uppercase tracking-wider font-semibold cursor-pointer ${
                activePhase === p
                  ? 'bg-[#0057FF] text-white'
                  : 'text-[#111111]/60 hover:text-[#111111] hover:bg-[#111111]/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Right Column details */}
      <div className="absolute bottom-32 right-12 text-right hidden lg:block z-10 pointer-events-none max-w-xs font-mono text-[10px] text-[#111111]/50 bg-[#F6F6F4]/90 p-4 rounded-lg border border-[#111111]/5">
        <p className="font-semibold text-[#0057FF] mb-1">// TELEMETRY FEED</p>
        <p className="line-clamp-2 h-10">{hoveredNodeInfo || 'HOVER CLOSE TO NODES To STREAM SPECIFICATIONS'}</p>
        <div className="mt-2 text-[9px] text-[#111111]/40 flex justify-between">
          <span>SPAWNED: 60 NODES</span>
          <span>CYCLE: REAL-TIME</span>
        </div>
      </div>

      {/* Description & Interactive Callouts */}
      <div className="relative z-10 mt-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-5xl">
        <div className="max-w-md text-left">
          <p className="font-sans text-sm md:text-base text-[#111111]/75 leading-relaxed">
            Ideas populate our neural field as sparse points. Click anywhere to inject cognitive seeds. 
            Watch them automatically seek connectivity, draft geometric blueprints, and emerge as pristine physical mockups before your eyes.
          </p>
        </div>

        {/* Dynamic Progression Flowchart (Dieter Rams Style) */}
        <div className="flex items-center gap-1.5 md:gap-3 bg-white p-2.5 rounded-lg border border-[#111111]/5 shadow-sm text-center font-mono text-[9px] font-medium pointer-events-none">
          <div className="flex flex-col items-center px-1">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]/40" />
            <span className="mt-1 text-[#111111]/60">IDEA</span>
          </div>
          <span className="text-[#111111]/30">→</span>
          <div className="flex flex-col items-center px-1">
            <GitBranch className="w-3.5 h-3.5 text-[#111111]/60" />
            <span className="mt-1 text-[#111111]/80">SKETCH</span>
          </div>
          <span className="text-[#111111]/30">→</span>
          <div className="flex flex-col items-center px-1">
            <Layers className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span className="mt-1 text-[#00C8FF]">CONCEPT</span>
          </div>
          <span className="text-[#111111]/30">→</span>
          <div className="flex flex-col items-center px-1">
            <Terminal className="w-3.5 h-3.5 text-[#0057FF]" />
            <span className="mt-1 text-[#0057FF] font-bold">BLUEPRINT</span>
          </div>
          <span className="text-[#111111]/30">→</span>
          <div className="flex flex-col items-center px-1">
            <Cpu className="w-3.5 h-3.5 text-[#0057FF]" />
            <span className="mt-1 text-[#0057FF] font-bold">PRODUCT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
