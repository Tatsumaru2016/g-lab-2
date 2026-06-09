import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, HelpCircle, HardDrive, Info, Cpu, Rocket } from 'lucide-react';

interface EngineStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: string;
  completion: string;
  description: string;
  metric: string;
  details: string[];
}

const ENGINE_STEPS: EngineStep[] = [
  {
    id: 'idea',
    label: 'Idea',
    icon: <HelpCircle className="w-4 h-4" />,
    duration: '01 SEC',
    completion: '100%',
    description: 'The initial conceptual spark pops. Defined as a digital coordinate cluster in the G.Lab network field.',
    metric: 'COGNITIVE RAD_0.81',
    details: ['Brainstorm mapping', 'Creative thresholding', 'Algorithmic filtering']
  },
  {
    id: 'research',
    label: 'Research',
    icon: <Settings className="w-4 h-4" />,
    duration: '14 DAYS',
    completion: '94%',
    description: 'Analyzing physical constraints, structural architecture, user telemetry, and dynamic aesthetic requirements.',
    metric: 'DATA FEEDBACK 220MB/s',
    details: ['Feasibility testing', 'Prior art verification', 'Mathematical modeling']
  },
  {
    id: 'design',
    label: 'Design',
    icon: <HardDrive className="w-4 h-4" />,
    duration: '21 DAYS',
    completion: '89%',
    description: 'Formatting sleek Dieter Rams minimalism, high-contrast layouts, typographic grids, and kinetic physics transitions.',
    metric: 'POLISH GA_4.99',
    details: ['Framer UI mockup', 'Color system indexing', 'Typographic pairing']
  },
  {
    id: 'prototype',
    label: 'Prototype',
    icon: <Info className="w-4 h-4" />,
    duration: '07 DAYS',
    completion: '100%',
    description: 'Baking interactive code components, canvas pipelines, and mechanical simulation rigs inside G.Lab.',
    metric: 'LATENCY INDEX_LOW_0.02ms',
    details: ['Voxel physics sandbox', 'Multilingual morph matrices', 'Haptic feedback tuning']
  },
  {
    id: 'dev',
    label: 'Development',
    icon: <Cpu className="w-4 h-4" />,
    duration: '30 DAYS',
    completion: '78%',
    description: 'Writing compiled TypeScript, integrating modular architectures, optimizing performance structures for deployment.',
    metric: 'VITE BUNDULING: 98%',
    details: ['TypeScript compiling', 'Tailwind layout mapping', 'Performance optimization']
  },
  {
    id: 'launch',
    label: 'Launch',
    icon: <Rocket className="w-4 h-4" />,
    duration: 'INSTANT',
    completion: '100%',
    description: 'Deploying secure static builds, mounting server channels, and releasing G.Lab artifacts to the public.',
    metric: 'LIVE CLOUD RUN SERVICE',
    details: ['Server-side initialization', 'Global telemetry launch', 'Community reception metrics']
  }
];

export default function EngineChamber() {
  const [activeStepId, setActiveStepId] = useState<string>('idea');

  const activeStep = ENGINE_STEPS.find((s) => s.id === activeStepId) || ENGINE_STEPS[0];

  // Rotate coefficient depending on step index to simulate complex gear system
  const getGearSpeedClass = (stepId: string) => {
    if (activeStepId === stepId) return 'animate-safe-spin';
    const index = ENGINE_STEPS.findIndex((s) => s.id === stepId);
    return index % 2 === 0 ? 'animate-slow-spin' : 'animate-reverse-slow-spin';
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      
      {/* Background gear and telemetry layouts */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
        {/* Giant architectural drawing elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#111111]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-dashed border-[#111111]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-4 h-4 rounded-full bg-[#111111]" />
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 06 // mechanical engine
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            G.Lab Ideation Rig
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#111111]/40 flex gap-4">
          <span>TORQUE: 18.4 NM</span>
          <span>GEAR CLUTCH: AUTO</span>
        </div>
      </div>

      {/* Main Interactive Gears & Timeline */}
      <div className="relative flex-1 w-full my-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-[360px]">
        
        {/* Left Side: Dynamic Gears Layout */}
        <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] flex items-center justify-center pointer-events-auto">
          
          {/* Main Core Center Gear */}
          <div className={`absolute w-[184px] h-[184px] rounded-full border border-[#111111]/10 flex items-center justify-center ${getGearSpeedClass(activeStepId)}`}>
            {/* Gear teeth */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#111111]/15" />
            <div className="absolute inset-4 rounded-full border border-[#111111]/10 flex items-center justify-center">
              <span className="font-sans text-xl font-bold tracking-tighter text-[#111111]/80">CORE_V6</span>
            </div>
            {/* Outer teeth layout */}
            <svg className="absolute inset-0 w-full h-full text-[#111111]/5" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2, 1" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="6, 4" />
            </svg>
          </div>

          {/* Connected Satellite Gears (each node of pipeline represented by smaller gears) */}
          {ENGINE_STEPS.map((step, idx) => {
            const isActive = step.id === activeStepId;
            // Place in a circle
            const angle = (idx * (360 / ENGINE_STEPS.length) * Math.PI) / 180;
            const r = 120; // radius
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            return (
              <div
                key={step.id}
                className="absolute cursor-pointer flex flex-col items-center justify-center z-10"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                onClick={() => setActiveStepId(step.id)}
              >
                <div 
                  className={`w-10 h-10 rounded-full bg-white border border-[#111111]/10 flex items-center justify-center shadow-sm relative transition-all duration-300 ${
                    isActive ? 'scale-110 border-[#0057FF] ring-2 ring-[#0057FF]/10' : 'hover:scale-105'
                  }`}
                >
                  <div className={isActive ? 'text-[#0057FF]' : 'text-[#111111]/50'}>
                    {step.icon}
                  </div>

                  {/* Micro tick labels */}
                  <span className="absolute -top-5 text-[8px] font-mono text-[#111111]/40 uppercase tracking-widest font-semibold">
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Step Technical Specifications Card */}
        <div className="w-full lg:w-96 flex flex-col bg-white border border-[#111111]/10 p-6 rounded-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] text-left z-10 glass pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex justify-between items-start pb-3 border-b border-[#111111]/5">
                <div>
                  <span className="font-mono text-[9px] bg-[#0057FF] text-white px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                    STAGE.{activeStep.id.toUpperCase()}
                  </span>
                  <p className="font-mono text-[8px] text-[#111111]/40 mt-1">ENGINE COMPONENT</p>
                </div>
                <div className="text-right font-mono text-[10px] text-[#111111]/60">
                  <p className="font-bold text-[#111111]">{activeStep.completion} COMPLETED</p>
                  <p className="text-[8px] text-[#111111]/40">LATINDEX: {activeStep.duration}</p>
                </div>
              </div>

              <h3 className="font-sans text-2xl font-bold tracking-tight text-[#111111] mt-4">
                {activeStep.label}
              </h3>
              <p className="font-sans text-xs text-[#111111]/60 leading-relaxed mt-2">
                {activeStep.description}
              </p>

              <div className="mt-4 bg-[#F6F6F4]/50 border border-[#111111]/5 p-3 rounded">
                <span className="font-mono text-[8.5px] text-[#111111]/40 uppercase font-bold tracking-widest">SUB-PROCESS PIPELINE</span>
                <ul className="flex flex-col gap-1.5 mt-2 text-[10px] font-mono text-[#111111]/70">
                  {activeStep.details.map((detail, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#0057FF]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-between items-center font-mono text-[9px] text-[#111111]/40 uppercase">
                <span>METRIC: {activeStep.metric}</span>
                <span>STATE_INDEX: OK</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom info row */}
      <div className="relative z-10 mt-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-md text-left">
          <p className="font-sans text-sm text-[#111111]/70 leading-relaxed">
            The Ideation Engine is not a passive checklist. It works on mechanical rotations of continuous iteration: testing concepts, deploying micro prototypes, and automatically launching production code pipelines.
          </p>
        </div>
        <div className="font-mono text-[10px] text-[#111111]/40 text-right uppercase tracking-wider leading-none">
          <span>DRIVE SYSTEM: COUPLED</span>
        </div>
      </div>
    </div>
  );
}
