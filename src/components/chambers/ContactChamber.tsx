import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, Github, Twitter, Linkedin, Radio, RefreshCw, Sparkles, Orbit } from 'lucide-react';

interface ContactChamberProps {
  onCollapseTrigger: () => void;
}

export default function ContactChamber({ onCollapseTrigger }: ContactChamberProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('TELEMETRY MESSAGE DISPATCHED SUCCESSFULLY.');
      // clear the form
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      
      {/* Background kinetic radar rings */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full border border-[#111111]/[0.02] flex items-center justify-center animate-slow-spin">
          <div className="w-[600px] h-[600px] rounded-full border border-dashed border-[#111111]/[0.02] flex items-center justify-center animate-reverse-slow-spin">
            <div className="w-[350px] h-[350px] rounded-full border border-[#111111]/[0.03]" />
          </div>
        </div>
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 09 // core core contact
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            Chamber Core Telemetry
          </h2>
        </div>

        <div className="font-mono text-[10px] text-[#111111]/40 flex gap-1.5 items-center">
          <Radio className="w-3.5 h-3.5 text-[#0057FF] animate-pulse" />
          <span>TRANSMITTER LINK: ARMED</span>
        </div>
      </div>

      {/* Main Form & Directory grid */}
      <div className="relative flex-1 w-full my-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-[360px] pointer-events-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl items-stretch">
          
          {/* Left panel: Minimalist Contact Form */}
          <div className="glass bg-white/80 border border-[#111111]/10 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between relative">
            <div>
              <span className="font-mono text-[8px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                CORE_TELEMETRY_COMMS
              </span>
              <h3 className="font-sans text-xl font-bold mt-4 mb-1">Send Cognitive Signal</h3>
              <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-wide">SUBMIT EXPERIMENTAL LOGS</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="CODENAME / NAME"
                    className="w-full bg-[#F6F6F4]/80 border border-[#111111]/10 rounded-lg px-3 py-2 font-mono text-[10px] focus:outline-none focus:border-[#0057FF] transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL TRANSMISSION"
                    className="w-full bg-[#F6F6F4]/80 border border-[#111111]/10 rounded-lg px-3 py-2 font-mono text-[10px] focus:outline-none focus:border-[#0057FF] transition-all"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="DETAILED INQUIRY SIGNAL..."
                    className="w-full bg-[#F6F6F4]/80 border border-[#111111]/10 rounded-lg px-3 py-2 font-mono text-[10px] focus:outline-none focus:border-[#0057FF] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] hover:bg-[#0057FF] disabled:bg-neutral-300 text-white py-2.5 rounded-lg font-mono text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>STREAMING WIRE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>DISPATCH SIGNAL</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="font-mono text-[9px] text-green-700 font-semibold leading-tight">{submitStatus}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel: Social Links & Signature Collapse protocol */}
          <div className="flex flex-col justify-between gap-6">
            
            {/* Social card */}
            <div className="glass bg-white/40 border border-[#111111]/10 rounded-2xl p-6 text-left flex flex-col justify-between h-1/2">
              <div>
                <span className="font-mono text-[8px] border border-[#111111]/15 px-2 py-0.5 rounded text-[#111111]/50 uppercase font-semibold">
                  GLOBAL_NETWORKS
                </span>
                <h3 className="font-sans text-lg font-bold text-neutral-800 mt-4 leading-none">Connect Channels</h3>
                <p className="font-mono text-[8.5px] text-[#111111]/40 uppercase mt-1">DIRECT SYSTEM REPOSITORIES</p>
              </div>

              {/* Grid of interactive minimal vector buttons */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border border-[#111111]/10 rounded-xl py-3 flex flex-col items-center gap-1.5 hover:text-[#0057FF] hover:border-[#0057FF] transition-all shadow-sm"
                >
                  <Github className="w-5 h-5 text-neutral-800 hover:text-[#0057FF] transition-colors" />
                  <span className="font-mono text-[8px] font-bold text-neutral-500 uppercase">GITHUB</span>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border border-[#111111]/10 rounded-xl py-3 flex flex-col items-center gap-1.5 hover:text-[#00C8FF] hover:border-[#00C8FF] transition-all shadow-sm"
                >
                  <Twitter className="w-5 h-5 text-neutral-800 hover:text-[#00C8FF] transition-colors" />
                  <span className="font-mono text-[8px] font-bold text-neutral-500 uppercase">TWITTER</span>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border border-[#111111]/10 rounded-xl py-3 flex flex-col items-center gap-1.5 hover:text-[#0057FF] hover:border-[#0057FF] transition-all shadow-sm"
                >
                  <Linkedin className="w-5 h-5 text-neutral-800 hover:text-[#0057FF] transition-colors" />
                  <span className="font-mono text-[8px] font-bold text-neutral-500 uppercase">LINKEDIN</span>
                </a>
              </div>
            </div>

            {/* Signature collapse panel */}
            <div className="glass bg-white/70 border border-[#111111]/10 rounded-2xl p-6 text-left flex flex-col justify-between h-1/2 relative overflow-hidden group">
              {/* Highlight vector layout */}
              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full border border-[#0057FF]/3 w-40 h-40" />

              <div>
                <span className="font-mono text-[8.5px] bg-[#FF4455]/10 text-[#FF4455] px-2.5 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                  <Orbit className="w-3.5 h-3.5 animate-spin" /> SPACE-TIME DECOMPRESSION
                </span>
                <h3 className="font-sans text-lg font-extrabold text-neutral-800 mt-4 leading-none">Collapse Chamber Core</h3>
                <p className="font-mono text-[8.5px] text-[#111111]/45 uppercase mt-1 leading-relaxed">
                  Triggers structural collapse of G.Lab into a single coordinate quantum singularity, returning you safely to Entry.
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={onCollapseTrigger}
                  className="w-full bg-red-50 hover:bg-red-500 hover:text-white text-red-600 py-3 rounded-lg border border-red-200 hover:border-red-500 font-mono text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>INITIAL_COLLAPSE_SEQUENCE</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom info row */}
      <div className="relative z-10 mt-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
        <div className="max-w-md pointer-events-none">
          <p className="font-sans text-sm text-[#111111]/70 leading-relaxed">
            Thank you for exploring Chambers L-01 to L-09. All conceptual rigs and product structures remained aligned. We launch new experimental lines continuously.
          </p>
        </div>
        <div className="font-mono text-[10px] text-[#111111]/40 text-right uppercase tracking-wider leading-none">
          <span>COOPERATIVE NET_CORE: COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
