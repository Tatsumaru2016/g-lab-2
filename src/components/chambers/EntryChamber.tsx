import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

export default function EntryChamber() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -0.5 to 0.5
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      {/* Background Micro Grid Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #111111 1px, transparent 1px),
            linear-gradient(to right, #111111 1px, transparent 1px),
            linear-gradient(to bottom, #111111 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 120px 120px, 120px 120px',
        }}
      />

      {/* Floating abstract structural references */}
      <div className="absolute top-24 right-24 text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]/40 flex flex-col gap-1 pointer-events-none hidden md:flex">
        <span>[ ENVIRONMENT // ACTIVE ]</span>
        <span>SYS.LATENCY: 0.12ms</span>
        <span>LATITUDE: 35.6762° N</span>
        <span>LONGITUDE: 139.6503° E</span>
      </div>

      {/* Hero Central Kinetic Sculpture (Dieter Rams / Teenage Engineering inspiration) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-0">
        <div 
          className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px) rotateX(${mousePos.y * -15}deg) rotateY(${mousePos.x * 15}deg)`,
            perspective: 1000,
          }}
        >
          {/* Main outer rotating tick ring */}
          <div className="absolute inset-0 rounded-full border border-[#111111]/5 flex items-center justify-center animate-slow-spin">
            <svg className="w-full h-full text-[#111111]/10" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 8" />
            </svg>
          </div>

          {/* Inner offset gear-ring */}
          <div 
            className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-[#111111]/5 animate-reverse-slow-spin"
            style={{ transform: `rotate(${mousePos.x * 40}deg)` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#0057FF]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00C8FF]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#111111]/20" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#111111]/20" />
          </div>

          {/* Dynamic Floating Plates with subtle volumetric shadows */}
          <motion.div 
            className="absolute w-[50%] h-[50%] bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] border border-white flex flex-col justify-between p-6 pointer-events-auto"
            style={{
              x: mousePos.x * -20,
              y: mousePos.y * -20,
              rotate: mousePos.x * 15,
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-[9px] tracking-widest text-[#0057FF] bg-[#0057FF]/5 px-1.5 py-0.5 rounded uppercase font-semibold">CORE.L-01</span>
              <span className="font-mono text-[8px] text-[#111111]/40">KINETIC v1.0</span>
            </div>
            <div className="mt-auto text-left">
              <h3 className="font-sans text-xs font-semibold text-[#111111] uppercase tracking-wide">Analog Interface</h3>
              <p className="text-[10px] text-[#111111]/50 mt-1 font-mono leading-none">REACTION SPEED: INERTIAL</p>
            </div>
          </motion.div>

          {/* Ambient particle floating rings */}
          <div className="absolute w-[110%] h-[110%] rounded-full border border-[#111111]/[0.02]" />
          <div className="absolute w-[120%] h-[120%] rounded-full border border-dashed border-[#111111]/[0.015]" />
        </div>
      </div>

      {/* Floating architectural background card with text metrics */}
      <div className="absolute bottom-24 right-12 text-right hidden lg:block z-10 pointer-events-none font-mono text-[10px] text-[#111111]/40">
        <p className="tracking-wider">// EXP-CORE // STATUS: ACTIVE</p>
        <p className="tracking-wider">ROTATIONAL RESISTANCE INDEX: 0.28 N·m</p>
        <p className="tracking-wider">DRAG ENGAGEMENT: OPTIMAL</p>
      </div>

      {/* Main typography */}
      <div className="relative z-10 mt-12 md:mt-20 flex flex-col max-w-xl text-left pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#0057FF] font-semibold">
            infinite digital laboratory
          </span>
          <h1 className="font-sans text-[72px] md:text-[110px] font-bold leading-none tracking-tighter text-[#111111] mt-2 select-none">
            G.Lab
          </h1>
          <div className="h-0.5 w-16 bg-[#111111] mt-6 mb-6" />
          <p className="font-sans text-base md:text-xl text-[#111111]/60 font-light leading-relaxed max-w-md">
            G.Lab is a living digital laboratory where ideas evolve into products, tools, worlds, and interactive experiences.
          </p>
        </motion.div>
      </div>

      {/* Instruction alert bar at bottom left */}
      <div className="relative z-10 mt-auto flex items-center gap-4 text-left pointer-events-none">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-[#111111]/40 uppercase tracking-widest">
            OPERATING SEQUENCE
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0057FF] animate-pulse" />
            <span className="font-sans text-xs text-[#111111]/80">
              Rotate the jog dial or scroll along the arc to explore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
