import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Gamepad2, Globe, Sparkles, Server, Laptop, ChevronRight } from 'lucide-react';

interface EcosystemNode {
  id: string;
  name: string;
  codename: string;
  description: string;
  details: string[];
  x: number; // Percentages for custom absolute positioning
  y: number;
  icon: React.ReactNode;
  color: string;
  badge: string;
}

const ECO_NODES: EcosystemNode[] = [
  {
    id: 'g-game',
    name: 'G.Game',
    codename: 'ECO.04_SANDBOX',
    description: 'A revolutionary game development engine, ecosystem, and interactive browser sandbox for procedural world construction.',
    details: [
      'Built-in retro spatial rasterizer',
      'Procedural content pipeline',
      'Real-time network multiplayer lobby'
    ],
    x: 20,
    y: 35,
    icon: <Gamepad2 className="w-5 h-5" />,
    color: '#00C8FF',
    badge: 'STABLE RELEASE'
  },
  {
    id: 'g-trans',
    name: 'G.Trans',
    codename: 'ECO.05_TRANSLATE',
    description: 'An intelligent AI-powered multilingual platform bridging the divide across cultures and dynamic digital dialects.',
    details: [
      'Direct system API stream',
      '80+ primary low-latency languages',
      'Dynamic typography glyph transitions'
    ],
    x: 80,
    y: 35,
    icon: <Globe className="w-5 h-5" />,
    color: '#0057FF',
    badge: 'ACTIVE UTILITY'
  },
  {
    id: 'g-future',
    name: 'Future Projects',
    codename: 'ECO.08_FUTURE',
    description: 'Conceptual models exploring volumetric UI, procedural neural synthesizers, and mechanical layout automated generators.',
    details: [
      'Volumetric user layouts',
      'Synthesized sound loops',
      'Multi-agent collaborative engines'
    ],
    x: 50,
    y: 75,
    icon: <Sparkles className="w-5 h-5" />,
    color: '#111111',
    badge: 'UNDER HEAVY RESEARCH'
  }
];

export default function EcosystemChamber() {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<EcosystemNode | null>(null);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      {/* Background grids and abstract connections */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="50%" y1="20%" x2="20%" y2="35%" stroke="#111111" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="50%" y1="20%" x2="80%" y2="35%" stroke="#111111" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="50%" y1="20%" x2="50%" y2="75%" stroke="#111111" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="20%" y1="35%" x2="50%" y2="75%" stroke="#111111" strokeWidth="0.5" strokeDasharray="8 8" />
          <line x1="80%" y1="35%" x2="50%" y2="75%" stroke="#111111" strokeWidth="0.5" strokeDasharray="8 8" />
        </svg>
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 03 // network topology
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            G.Lab Neural Constellation
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#111111]/40 flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0057FF]" /> G.TRANS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00C8FF]" /> G.GAME
          </span>
        </div>
      </div>

      {/* Main Interactive Diagram Space */}
      <div className="relative flex-1 w-full my-6 flex items-center justify-center min-h-[340px]">
        
        {/* Core Center Node (G.Lab Engine) */}
        <div 
          className="absolute z-20 top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
          onClick={() => setSelectedNode(null)}
        >
          <motion.div 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-2 border-[#111111] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative"
            animate={{
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Network className="w-7 h-7 md:w-9 md:h-9 text-[#111111]" />
            {/* Pulsating peripheral rays */}
            <span className="absolute inset-0 rounded-full border border-[#0057FF]/30 scale-125 animate-ping opacity-30" />
            <span className="absolute inset-0 rounded-full border border-[#00C8FF]/20 scale-150 animate-pulse opacity-40" />
          </motion.div>
          <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-[#111111] mt-3">
            Core G.Lab
          </span>
          <span className="font-mono text-[8px] text-[#111111]/40 mt-1 uppercase">
            HOST SYSTEM_ON
          </span>
        </div>

        {/* Floating Peripheral Nodes */}
        {ECO_NODES.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode?.id === node.id;

          return (
            <motion.div
              key={node.id}
              className="absolute z-10 cursor-pointer flex flex-col items-center text-center p-2 rounded-xl group"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setSelectedNode(isSelected ? null : node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-[#111111]/10 shadow-[0_15px_40px_rgba(0,0,0,0.05)] flex items-center justify-center transition-all duration-300 relative"
                style={{
                  borderColor: isSelected || isHovered ? node.color : 'rgba(17,17,17,0.1)',
                  boxShadow: isSelected || isHovered ? `0 10px 30px rgba(${node.id === 'g-trans' ? '0,87,255' : '0,200,255'},0.15)` : undefined
                }}
              >
                {/* Embedded dynamic node specific colors */}
                <div 
                  className="transition-colors duration-300"
                  style={{
                    color: isSelected || isHovered ? node.color : '#111111'
                  }}
                >
                  {node.icon}
                </div>

                {/* Micro metrics count ring around node when hovering */}
                {(isHovered || isSelected) && (
                  <motion.div 
                    className="absolute inset--3 rounded-full border border-dashed border-[#111111]/10 animate-slow-spin w-[130%] h-[130%] -left-[15%] -top-[15%]" 
                  />
                )}
              </div>
              <span className="font-mono text-[10px] font-semibold text-[#111111] mt-2 group-hover:text-[#0057FF] transition-colors">
                {node.name}
              </span>
              <span className="font-mono text-[8px] text-[#111111]/30 uppercase font-thin">
                {node.codename}
              </span>
            </motion.div>
          );
        })}

        {/* Constellation Side Console / Node Detail Modal */}
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 bottom-0 md:bottom-auto md:top-24 w-full md:w-80 bg-white border border-[#111111]/10 p-5 rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.055)] glass z-30 flex flex-col pointer-events-auto text-left"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] px-2 py-0.5 rounded tracking-wider bg-[#111111]/5 text-[#111111] font-semibold">
                  {selectedNode.badge}
                </span>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-[10px] font-mono hover:text-[#0057FF] cursor-pointer text-[#111111]/40 uppercase font-bold"
                >
                  [ COLLAPSE ]
                </button>
              </div>

              <h3 className="font-sans text-xl font-semibold text-[#111111] mt-3" style={{ color: selectedNode.color }}>
                {selectedNode.name}
              </h3>
              <p className="font-mono text-[8px] text-[#111111]/40 uppercase tracking-widest">{selectedNode.codename}</p>
              
              <p className="font-sans text-xs text-[#111111]/70 leading-relaxed mt-2">
                {selectedNode.description}
              </p>

              <div className="mt-4 border-t border-[#111111]/5 pt-3">
                <h4 className="font-sans text-[10px] font-bold text-[#111111] tracking-wider uppercase mb-1.5">INTEGRATION TELEMETRY</h4>
                <ul className="flex flex-col gap-1 text-[10px] font-mono text-[#111111]/60">
                  {selectedNode.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <ChevronRight className="w-2.5 h-2.5 text-[#0057FF]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute left-6 bottom-4 text-left pointer-events-none max-w-xs text-[#111111]/40 font-mono text-[9px] uppercase hidden md:block"
            >
              <p className="font-bold text-[#0057FF]">// INSTRUCTION PANEL</p>
              <p className="mt-1">Click on the constellations nodes to deploy diagnostic reports. Hover nodes to illuminate spatial bridges.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lower Summary Row */}
      <div className="relative z-10 mt-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-md text-left">
          <p className="font-sans text-sm text-[#111111]/70 leading-relaxed">
            The G.Lab Ecosystem behaves as an organic neural field. Rather than siloed websites, everything feeds into core algorithms, ensuring seamless data flow, game mechanics, and communication nodes.
          </p>
        </div>
        <div className="font-mono text-[10px] text-[#111111]/40 text-right uppercase tracking-wider leading-none">
          <span>COOPERATIVE ROUTING ENGINE: COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
