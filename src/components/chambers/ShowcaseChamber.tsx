import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Globe, Music, Eye, Layers, ChevronRight, CornerDownRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  metrics: string[];
  icon: React.ReactNode;
  color: string;
}

const PROJECTS: Project[] = [
  {
    id: 'p-game',
    title: 'G.Game Core',
    category: 'GAME SYSTEM',
    description: 'A fully virtualized, modern procedural browser game engine enabling multiplayer worlds, custom physics meshes, and nostalgic voxel tiles.',
    badge: 'RELEASED v1.0',
    metrics: ['ENGINETYPE: CHROME_WEBGL', 'LATENCY: 12ms', 'NODES ACTIVE: 1.4k'],
    icon: <Gamepad2 className="w-5 h-5" />,
    color: '#00C8FF'
  },
  {
    id: 'p-trans',
    title: 'G.Trans Multi',
    category: 'AI TRANSLATOR',
    description: 'An expert-level linguistic translation proxy delivering instant speech, typography, and complex document interpretation with low semantic loss.',
    badge: 'STABLE API',
    metrics: ['ACCURACY RATE: 99.98%', 'LANGUAGES: 82', 'CORE: NEURAL_API'],
    icon: <Globe className="w-5 h-5" />,
    color: '#0057FF'
  },
  {
    id: 'p-audio',
    title: 'G.Audio Synthesizer',
    category: 'SYNTHESIS ENGINE',
    description: 'An interactive physical sound synthesiser producing diaphragmatic ambient tones, audio pulse loops, and custom procedural noise levels.',
    badge: 'BETA RELEASE_v0.4',
    metrics: ['CHANNELS: 16-BIT STEREO', 'LATINDEX: 0.12ms', 'SYNTHS: OSCILLATORS'],
    icon: <Music className="w-5 h-5" />,
    color: '#FF1282'
  }
];

export default function ShowcaseChamber() {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      
      {/* Background architectural framing */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 text-[95px] font-sans font-bold leading-none select-none tracking-tighter">
          SHOWCASE
        </div>
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 07 // physical showcase
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            G.Lab Artifact Assembly
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#111111]/40 flex gap-4 uppercase font-semibold">
          <span>PIPELINE: STRUCTURAL</span>
          <span>SENSORY MODE: ASSEMBLED</span>
        </div>
      </div>

      {/* Main Grid: Staggered entrance animation */}
      <div className="relative flex-1 w-full my-6 flex flex-col lg:flex-row items-center justify-center gap-6 min-h-[360px] pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {PROJECTS.map((proj, idx) => {
            const isHovered = hoveredProjectId === proj.id;
            const isSelected = selectedProject?.id === proj.id;

            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring' }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedProject(isSelected ? null : proj)}
                onMouseEnter={() => setHoveredProjectId(proj.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                className="glass rounded-xl border border-[#111111]/10 bg-white p-6 shadow-[0_12px_45px_rgba(0,0,0,0.02)] relative flex flex-col justify-between min-h-[220px] md:min-h-[260px] cursor-pointer group"
              >
                {/* Visual Accent Corner Highlights */}
                <div 
                  className="absolute top-0 left-0 w-8 h-1 rounded-tl-xl transition-all duration-300"
                  style={{ backgroundColor: isHovered || isSelected ? proj.color : 'transparent' }}
                />

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: isHovered || isSelected ? `${proj.color}15` : 'rgba(17,17,17,0.03)',
                        color: isHovered || isSelected ? proj.color : '#111111'
                      }}
                    >
                      {proj.icon}
                    </div>
                    <div>
                      <span className="font-mono text-[8px] text-[#111111]/40 uppercase leading-none">{proj.category}</span>
                      <h3 className="font-sans text-base font-semibold text-[#111111] leading-tight block group-hover:text-[#0057FF] transition-colors">
                        {proj.title}
                      </h3>
                    </div>
                  </div>
                  <span className="font-mono text-[8px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded tracking-wide font-bold">
                    {proj.badge}
                  </span>
                </div>

                <p className="font-sans text-xs text-[#111111]/60 leading-relaxed my-4 text-left line-clamp-4">
                  {proj.description}
                </p>

                {/* Micro engineering parameters on base of card */}
                <div className="border-t border-[#111111]/5 pt-3 mt-auto">
                  <div className="flex flex-col gap-0.5 text-[8.5px] font-mono text-[#111111]/40 text-left">
                    {proj.metrics.map((m, mIdx) => (
                      <span key={mIdx}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Subtle volumetric focus feedback */}
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5 text-[#0057FF]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Project Full Spec overlay drawer */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white border-l border-[#111111]/10 p-6 shadow-2xl z-20 flex flex-col justify-between text-left glass"
            >
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#111111]/15">
                  <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 rounded font-bold">
                    SYSTEM_DIAGNOSTIC
                  </span>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="font-mono text-[10px] text-[#111111]/40 hover:text-black cursor-pointer uppercase font-bold"
                  >
                    [ close ]
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${selectedProject.color}15`, color: selectedProject.color }}
                  >
                    {selectedProject.icon}
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#111111]/40 uppercase">{selectedProject.category}</span>
                    <h3 className="font-sans text-2xl font-bold text-[#111111]">{selectedProject.title}</h3>
                  </div>
                </div>

                <p className="font-sans text-xs text-[#111111]/70 leading-relaxed mt-4">
                  {selectedProject.description}
                </p>

                <div className="mt-6 bg-[#F6F6F4]/60 border border-[#111111]/10 p-4 rounded-lg">
                  <span className="font-mono text-[9px] text-[#0057FF] font-bold uppercase tracking-widest block mb-2">INTEGRATION VECTORS</span>
                  <ul className="flex flex-col gap-2 font-mono text-[10px] text-neutral-600">
                    {selectedProject.metrics.map((met, metIdx) => (
                      <li key={metIdx} className="flex gap-2 items-start">
                        <ChevronRight className="w-3 h-3 text-[#0057FF] shrink-0 mt-0.5" />
                        <span>{met}</span>
                      </li>
                    ))}
                    <li className="flex gap-2 items-start mt-2 pt-2 border-t border-[#111111]/5">
                      <CornerDownRight className="w-3 h-3 text-[#111111]/40 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-black font-semibold">COOPERATIVE DEPLOY_PORT</p>
                        <p className="text-[9px] text-[#111111]/40 mt-0.5">CONNECTED VIA LOCALHOST:3000 ENGINE</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <a 
                  href="https://placeholder.example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#111111] hover:bg-[#0057FF] text-white py-3 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>LAUNCH SANDBOX DEMO</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom info row */}
      <div className="relative z-10 mt-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
        <div className="max-w-md">
          <p className="font-sans text-sm text-[#111111]/70 leading-relaxed">
            The active artifacts in Chamber 07 represent physically compiled projects. Hovering and selecting can unfold internal vectors and parameters inside the telemetry console.
          </p>
        </div>
        <div className="font-mono text-[10px] text-[#111111]/40 text-right uppercase tracking-wider leading-none">
          <span>ASSEMBLED LAYERS: COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
