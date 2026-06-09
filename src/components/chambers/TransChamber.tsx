import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ArrowRight, CornerDownRight, Languages } from 'lucide-react';

interface TranslationPair {
  lang: string;
  word: string;
  phonetic?: string;
}

const MORPH_WORDS: Record<string, TranslationPair[]> = {
  'Communication': [
    { lang: 'English', word: 'Communication' },
    { lang: 'Japanese', word: 'コミュニケーション', phonetic: 'komyunikēshon' },
    { lang: 'Spanish', word: 'Comunicación' },
    { lang: 'German', word: 'Kommunikation' },
    { lang: 'Chinese', word: '交流', phonetic: 'jiāoliú' },
    { lang: 'French', word: 'Communication' },
    { lang: 'Korean', word: '소통', phonetic: 'sotong' },
    { lang: 'Italian', word: 'Comunicazione' },
  ],
  'Beyond Language': [
    { lang: 'English', word: 'Beyond Language' },
    { lang: 'Japanese', word: '言葉を超えて', phonetic: 'kotoba o koete' },
    { lang: 'Spanish', word: 'Más allá de la lengua' },
    { lang: 'German', word: 'Jenseits der Sprache' },
    { lang: 'Chinese', word: '言语之外', phonetic: 'yányǔ zhī wài' },
    { lang: 'French', word: 'Au-delà de la langue' },
    { lang: 'Korean', word: '언어 너머', phonetic: 'eoneo neomeo' },
    { lang: 'Italian', word: 'Oltre la lingua' },
  ],
  'Infinite Laboratory': [
    { lang: 'English', word: 'Infinite Laboratory' },
    { lang: 'Japanese', word: '無限の実験室', phonetic: 'mugen no jikkenshitsu' },
    { lang: 'Spanish', word: 'Laboratorio Infinito' },
    { lang: 'German', word: 'Unendliches Laboratorium' },
    { lang: 'Chinese', word: '无限实验室', phonetic: 'wúxiàn shíyànshì' },
    { lang: 'French', word: 'Laboratoire Infini' },
    { lang: 'Korean', word: '무한의 실험실', phonetic: 'muhan-ui silheomsil' },
    { lang: 'Italian', word: 'Laboratorio Infinito' },
  ]
};

export default function TransChamber() {
  const [activeCycleIndex, setActiveCycleIndex] = useState(0);
  const [customInputText, setCustomInputText] = useState('');
  const [customProcessed, setCustomProcessed] = useState('');
  const [selectedWordKey, setSelectedWordKey] = useState<string>('Communication');

  // Cycle languages automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCycleIndex((prev) => (prev + 1) % MORPH_WORDS[selectedWordKey].length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedWordKey]);

  // Handle custom translation mocking (character scramble translation)
  const handleCustomTranslate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    // Elegant text scramble morphing effect simulation
    setCustomProcessed('Scrambling language algorithms...');
    setTimeout(() => {
      // Direct reverse text with dynamic phonetic style
      const morphed = customInputText
        .split('')
        .reverse()
        .map((c, i) => (i % 3 === 0 ? c.toUpperCase() : c))
        .join('');
      setCustomProcessed(`[G.TRANS_RESULT]: ${morphicTranslate(customInputText)}`);
    }, 800);
  };

  const morphicTranslate = (text: string) => {
    // Generate a beautiful faux language morph
    const prefix = ['aet-', 'neo-', 'cy-', 'geo-'];
    const suffix = ['-labs', '-sync', '-core', '-fused'];
    return `${prefix[text.length % 4]}${text.replace(/[aeiou]/gi, 'ø')}${suffix[text.length % 4]}`;
  };

  const currentPair = MORPH_WORDS[selectedWordKey][activeCycleIndex];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 select-none bg-[#F6F6F4] text-[#111111] overflow-hidden">
      
      {/* Background Micro Grid Layer with digital data columns */}
      <div 
        className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.03] flex justify-between px-16"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #111111 1px, transparent 1px)',
          backgroundSize: '100% 40px',
        }}
      >
        <div className="w-px h-full bg-[#111111]" />
        <div className="w-px h-full bg-[#111111] hidden md:block" />
        <div className="w-px h-full bg-[#111111] hidden lg:block" />
        <div className="w-px h-full bg-[#111111]" />
      </div>

      {/* Top Header Metrics bar */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0057FF] font-semibold">
            chamber 05 // semantic engine
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#111111] mt-1">
            G.Trans Linguistic Lattice
          </h2>
        </div>

        {/* Selected target concept picker */}
        <div className="glass border border-[#111111]/10 rounded-lg p-1 flex gap-1 font-mono text-[9px] pointer-events-auto">
          {Object.keys(MORPH_WORDS).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedWordKey(key);
                setActiveCycleIndex(0);
              }}
              className={`px-2.5 py-1 rounded transition-all uppercase tracking-wider font-semibold cursor-pointer ${
                selectedWordKey === key
                  ? 'bg-[#0057FF] text-white'
                  : 'text-[#111111]/60 hover:text-[#111111] hover:bg-[#111111]/5'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive morphing canvas card */}
      <div className="relative flex-1 w-full my-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-center max-w-3xl px-4 flex flex-col items-center justify-center">
          
          {/* Active Target Language Indicator */}
          <div className="mb-4">
            <span className="font-mono text-[9px] bg-[#0057FF] text-white px-2.5 py-1 rounded uppercase tracking-[0.25em] font-bold">
              {currentPair.lang.toUpperCase()} TRANS_CORE
            </span>
          </div>

          {/* Morphing Word Layout */}
          <div className="h-28 md:h-40 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPair.word}
                initial={{ opacity: 0, filter: 'blur(10px)', y: 15 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                <h3 className="font-sans text-4xl md:text-6xl lg:text-7xl font-bold text-[#111111] tracking-tight text-center leading-none">
                  {currentPair.word}
                </h3>
                {currentPair.phonetic && (
                  <span className="font-mono text-xs md:text-sm text-[#0057FF] mt-3">
                    [ phonetic: {currentPair.phonetic} ]
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Connected neural line segments */}
          <div className="flex gap-4 md:gap-8 justify-center items-center font-mono text-[9px] text-[#111111]/40 uppercase mt-4 mb-2">
            <span>SYNTACTIC ACCURACY: 99.98%</span>
            <span>•</span>
            <span>MUTATION LATENCY: 24ms</span>
            <span>•</span>
            <span>CONTEXT: METAMORPHIC</span>
          </div>
        </div>
      </div>

      {/* Interactive Translation Form card */}
      <div className="absolute right-8 bottom-32 z-10 hidden lg:flex flex-col bg-white border border-[#111111]/10 rounded-lg p-5 glass w-72 text-left pointer-events-auto shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
        <span className="font-mono text-[8px] text-[#0057FF] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
          <Languages className="w-3.5 h-3.5" /> G.Trans Instant Sandbox
        </span>
        <form onSubmit={handleCustomTranslate} className="flex flex-col gap-2">
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            placeholder="Type word to scramble morph..."
            className="w-full bg-[#F6F6F4]/80 border border-[#111111]/10 rounded-md px-3 py-1.5 font-mono text-[10px] focus:outline-none focus:border-[#0057FF]"
            maxLength={25}
          />
          <button
            type="submit"
            className="w-full bg-[#111111] hover:bg-[#0057FF] text-white py-1.5 rounded-md font-mono text-[9px] font-bold uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            Translate <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </form>

        {customProcessed && (
          <div className="mt-3 bg-[#F6F6F4]/50 border border-[#111111]/5 rounded p-2.5">
            <p className="font-mono text-[9px] text-[#111111]/80 leading-tight break-all">{customProcessed}</p>
          </div>
        )}
      </div>

      {/* G.Trans Header & Button CTA */}
      <div className="relative z-10 max-w-xl text-left pointer-events-none">
        <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#0057FF] font-semibold">
          AI multidirectional portal
        </span>
        <h3 className="font-sans text-[44px] md:text-[56px] font-bold leading-none tracking-tight text-[#111111] mt-2 leading-none">
          Communication Beyond Language.
        </h3>
        <p className="font-sans text-xs md:text-sm text-[#111111]/60 mt-4 leading-relaxed max-w-sm">
          An AI-powered multilingual communication platform. Continuously translating dynamic concept clusters across English, Japanese, Spanish, German, French, Chinese, and Korean.
        </p>

        {/* CTA Launch link */}
        <div className="mt-6 flex items-center gap-4 pointer-events-auto">
          <motion.a 
            href="https://g-trans-placeholder.example"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#111111] hover:bg-[#0057FF] text-white px-5 py-3 rounded-lg text-xs font-mono tracking-widest uppercase transition-colors shadow-lg shadow-neutral-900/10 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Globe className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-700" />
            <span>Enter G.Trans</span>
          </motion.a>
          
          <div className="font-mono text-[8px] text-[#111111]/40 uppercase flex flex-col leading-none">
            <span>ENGINE STATUS: STABLE</span>
            <span className="mt-1">REPLICATED MODELS: TRANSLATION</span>
          </div>
        </div>
      </div>

      {/* Bottom status line */}
      <div className="relative z-10 w-full flex justify-between items-end text-left pointer-events-none mt-4 text-[9px] font-mono text-[#111111]/40 uppercase tracking-widest hidden sm:flex">
        <span>[ TRANSMISSION ENCRYPTED_SSL ]</span>
        <span>AUTOMATIC ROTATION STREAMS EVERY 4.0 SECONDS</span>
      </div>
    </div>
  );
}
