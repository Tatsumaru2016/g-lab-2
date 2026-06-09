import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { Clock } from 'lucide-react';

import EntryChamber from './components/chambers/EntryChamber';
import ThinkingChamber from './components/chambers/ThinkingChamber';
import EcosystemChamber from './components/chambers/EcosystemChamber';
import GameChamber from './components/chambers/GameChamber';
import TransChamber from './components/chambers/TransChamber';
import EngineChamber from './components/chambers/EngineChamber';
import ShowcaseChamber from './components/chambers/ShowcaseChamber';
import FutureChamber from './components/chambers/FutureChamber';
import ContactChamber from './components/chambers/ContactChamber';

import JogDial from './components/JogDial';
import {
  SCENE_PIVOT_ORIGIN,
  SCENE_CLIP_LEFT,
  MAIN_PADDING_LEFT,
  chamberToAngle,
  angleToChamber,
  sceneRotateOffset,
  sceneLayerOpacity,
  sceneSlotAngle,
  shouldRenderSceneLayer,
  SCENE_COUNT,
} from './nav';
import { clampAngle } from './jogDialPhysics';
import {
  isWheelCoastSettled,
  nextDetentTarget,
  stepWheelCoast,
  WHEEL_NOTCH_THRESHOLD,
  wheelImpulseToward,
} from './scrollPhysics';
import { isSceneFollowSettled, stepSceneFollow } from './sceneFollowPhysics';
import { playGearEngage, playGearLock } from './mechanicalSound';

export default function App() {
  const [currentChamberId, setCurrentChamberId] = useState(1);
  const [scrollAngle, setScrollAngle] = useState(0);
  const scrollAngleMv = useMotionValue(0);
  const [currentTime, setCurrentTime] = useState('');
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [explosionActive, setExplosionActive] = useState(false);
  const [isDialWheelActive, setIsDialWheelActive] = useState(false);
  const [isSceneFollowActive, setIsSceneFollowActive] = useState(false);
  const [dialDisplayAngle, setDialDisplayAngle] = useState(0);
  const dialDisplayMv = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chamberIdRef = useRef(1);
  const dialAngleRef = useRef(0);
  const dialLeadAngleRef = useRef(0);
  const dialWheelVelocity = useRef(0);
  const dialWheelTargetRef = useRef(0);
  const scrollAngleRef = useRef(0);
  const sceneFollowVelocity = useRef(0);
  const dialWheelRafRef = useRef<number | null>(null);
  const sceneFollowRafRef = useRef<number | null>(null);
  const sceneFollowLastFrame = useRef(0);
  const isDialWheelBusyRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const gearEngagePlayed = useRef(false);

  const sceneAnchoredChamber = useMemo(() => angleToChamber(scrollAngle), [scrollAngle]);
  const dialLiveChamber = useMemo(() => angleToChamber(dialDisplayAngle), [dialDisplayAngle]);
  const sceneDrift = useMemo(
    () => sceneRotateOffset(scrollAngle, sceneAnchoredChamber),
    [scrollAngle, sceneAnchoredChamber],
  );
  const forcedPreviewId =
    dialLiveChamber !== sceneAnchoredChamber ? dialLiveChamber : undefined;

  const isNavInMotion = isDialWheelActive || isSceneFollowActive;
  const isSceneMotionActive =
    isNavInMotion || Math.abs(sceneDrift) > 0.05 || dialLiveChamber !== sceneAnchoredChamber;

  useEffect(() => {
    isDialWheelBusyRef.current = isDialWheelActive;
  }, [isDialWheelActive]);

  const sceneRing = useMemo(
    () =>
      Array.from({ length: SCENE_COUNT }, (_, i) => {
        const id = i + 1;
        return {
          id,
          visible: shouldRenderSceneLayer(
            scrollAngle,
            id,
            sceneAnchoredChamber,
            isSceneMotionActive,
            forcedPreviewId,
          ),
          opacity: sceneLayerOpacity(
            scrollAngle,
            id,
            sceneAnchoredChamber,
            isSceneMotionActive,
            forcedPreviewId,
          ),
          slotAngle: sceneSlotAngle(id),
        };
      }),
    [scrollAngle, sceneAnchoredChamber, isSceneMotionActive, forcedPreviewId],
  );

  const stopDialWheel = useCallback(() => {
    if (dialWheelRafRef.current !== null) {
      cancelAnimationFrame(dialWheelRafRef.current);
      dialWheelRafRef.current = null;
    }
    wheelAccumulatorRef.current = 0;
    setIsDialWheelActive(false);
  }, []);

  const stopSceneFollow = useCallback(() => {
    if (sceneFollowRafRef.current !== null) {
      cancelAnimationFrame(sceneFollowRafRef.current);
      sceneFollowRafRef.current = null;
    }
    setIsSceneFollowActive(false);
  }, []);

  const applySceneAngle = useCallback(
    (angle: number) => {
      const clamped = clampAngle(angle);
      scrollAngleRef.current = clamped;
      scrollAngleMv.set(clamped);
      setScrollAngle(clamped);
    },
    [scrollAngleMv],
  );

  const applyDialLead = useCallback(
    (angle: number) => {
      const clamped = clampAngle(angle);
      dialAngleRef.current = clamped;
      dialLeadAngleRef.current = clamped;
      dialDisplayMv.set(clamped);
      setDialDisplayAngle(clamped);
    },
    [dialDisplayMv],
  );

  const tickSceneFollow = useCallback(
    (now: number) => {
      const dt = Math.min(now - sceneFollowLastFrame.current, 40);
      sceneFollowLastFrame.current = now;
      const target = dialLeadAngleRef.current;
      const state = stepSceneFollow(
        { angle: scrollAngleRef.current, velocity: sceneFollowVelocity.current },
        target,
        dt,
      );

      if (isSceneFollowSettled(state, target)) {
        applySceneAngle(target);
        sceneFollowVelocity.current = 0;
        sceneFollowRafRef.current = null;
        setIsSceneFollowActive(false);
        return;
      }

      sceneFollowVelocity.current = state.velocity;
      applySceneAngle(state.angle);
      sceneFollowRafRef.current = requestAnimationFrame(tickSceneFollow);
    },
    [applySceneAngle],
  );

  const ensureSceneFollow = useCallback(() => {
    if (Math.abs(scrollAngleRef.current - dialLeadAngleRef.current) < 0.35) {
      applySceneAngle(dialLeadAngleRef.current);
      return;
    }
    if (sceneFollowRafRef.current !== null) return;
    setIsSceneFollowActive(true);
    sceneFollowLastFrame.current = performance.now();
    sceneFollowRafRef.current = requestAnimationFrame(tickSceneFollow);
  }, [applySceneAngle, tickSceneFollow]);

  const stopAllNav = useCallback(() => {
    stopDialWheel();
    stopSceneFollow();
  }, [stopDialWheel, stopSceneFollow]);

  const settleDialWheel = useCallback(() => {
    const id = angleToChamber(dialWheelTargetRef.current);
    const snapped = chamberToAngle(id);
    dialWheelTargetRef.current = snapped;
    applyDialLead(snapped);
    dialWheelVelocity.current = 0;
    chamberIdRef.current = id;
    setCurrentChamberId(id);
    stopDialWheel();
    playGearLock();
    ensureSceneFollow();
  }, [applyDialLead, ensureSceneFollow, stopDialWheel]);

  const handleChamberChange = useCallback(
    (id: number) => {
      const snapped = chamberToAngle(id);
      stopDialWheel();
      chamberIdRef.current = id;
      setCurrentChamberId(id);
      applyDialLead(snapped);
      ensureSceneFollow();
    },
    [applyDialLead, ensureSceneFollow, stopDialWheel],
  );

  const handleDialAngleChange = useCallback(
    (angle: number) => {
      const clamped = clampAngle(angle);
      dialLeadAngleRef.current = clamped;
      setDialDisplayAngle(clamped);
      ensureSceneFollow();
    },
    [ensureSceneFollow],
  );

  const handleDialInteractionStart = useCallback(() => {
    stopDialWheel();
  }, [stopDialWheel]);

  const startWheelStep = useCallback(
    (direction: 1 | -1) => {
      if (isCollapsing) return;

      const angle = dialAngleRef.current;
      const target = nextDetentTarget(chamberIdRef.current, direction);
      if (Math.abs(target - angle) < 0.5) return;

      stopDialWheel();
      dialWheelTargetRef.current = target;
      dialWheelVelocity.current = wheelImpulseToward(angle, target);
      setIsDialWheelActive(true);
      gearEngagePlayed.current = false;
      let lastWheelFrame = performance.now();

      const tick = (now: number) => {
        const dt = Math.min(now - lastWheelFrame, 40);
        lastWheelFrame = now;
        const state = stepWheelCoast(
          {
            angle: dialAngleRef.current,
            velocity: dialWheelVelocity.current,
            target: dialWheelTargetRef.current,
          },
          dt,
        );
        dialWheelVelocity.current = state.velocity;
        applyDialLead(state.angle);
        ensureSceneFollow();

        if (state.engaging && !gearEngagePlayed.current) {
          gearEngagePlayed.current = true;
          playGearEngage();
        }

        if (isWheelCoastSettled(state)) {
          dialWheelRafRef.current = null;
          settleDialWheel();
          return;
        }

        dialWheelRafRef.current = requestAnimationFrame(tick);
      };

      dialWheelRafRef.current = requestAnimationFrame(tick);
    },
    [applyDialLead, ensureSceneFollow, isCollapsing, settleDialWheel, stopDialWheel],
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => stopAllNav(), [stopAllNav]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      if (isCollapsing || isDialWheelBusyRef.current) return;

      wheelAccumulatorRef.current += e.deltaY;
      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_NOTCH_THRESHOLD) return;

      const direction: 1 | -1 = wheelAccumulatorRef.current > 0 ? 1 : -1;
      wheelAccumulatorRef.current = 0;
      startWheelStep(direction);
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNative);
  }, [isCollapsing, startWheelStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCollapsing || isDialWheelBusyRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (chamberIdRef.current < 9) startWheelStep(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (chamberIdRef.current > 1) startWheelStep(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsing, startWheelStep]);

  const touchStart = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isCollapsing || isDialWheelBusyRef.current) return;
    const dx = touchStart.current.x - e.changedTouches[0].clientX;
    const dy = touchStart.current.y - e.changedTouches[0].clientY;
    const arcDelta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
    if (Math.abs(arcDelta) < 40) return;

    const direction: 1 | -1 = arcDelta > 0 ? 1 : -1;
    startWheelStep(direction);
  };

  const triggerCollapseProtocol = () => {
    stopAllNav();
    setIsCollapsing(true);
    setTimeout(() => setExplosionActive(true), 1000);
    setTimeout(() => {
      chamberIdRef.current = 1;
      lastTickChamberRef.current = 1;
      setCurrentChamberId(1);
      scrollAngleRef.current = 0;
      scrollAngleMv.set(0);
      setScrollAngle(0);
      dialDisplayMv.set(0);
      setDialDisplayAngle(0);
      dialAngleRef.current = 0;
      dialLeadAngleRef.current = 0;
      setIsCollapsing(false);
      setExplosionActive(false);
    }, 3200);
  };

  const renderChamber = (id: number) => {
    switch (id) {
      case 1: return <EntryChamber />;
      case 2: return <ThinkingChamber />;
      case 3: return <EcosystemChamber />;
      case 4: return <GameChamber />;
      case 5: return <TransChamber />;
      case 6: return <EngineChamber />;
      case 7: return <ShowcaseChamber />;
      case 8: return <FutureChamber />;
      case 9: return <ContactChamber onCollapseTrigger={triggerCollapseProtocol} />;
      default: return <EntryChamber />;
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen overflow-hidden bg-[#F6F6F4] text-[#111111] flex flex-col font-sans select-none"
    >
      <header
        className="fixed top-0 inset-x-0 h-16 md:h-20 bg-transparent flex items-center justify-between px-8 md:px-12 border-b border-[#111111]/[0.05] z-50 pointer-events-auto transition-transform duration-700"
        style={{
          transform: isCollapsing ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#0057FF] rounded-full animate-pulse" />
            <span className="font-sans font-bold text-lg tracking-wider text-[#111111]">G.LAB</span>
            <span className="font-mono text-[7.5px] border border-[#111111]/25 px-1.5 py-0.2 rounded text-neutral-400 font-bold tracking-widest leading-none hidden sm:inline">
              V0.9_ALPHA
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 font-mono text-[9px] text-[#111111]/45 uppercase">
            <span>[ ACTIVE FLOOR: L-0{dialLiveChamber} ]</span>
            <span>SYSTEM_ONLINE // DEPLOY_SSL</span>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-[9px] text-[#111111]/60">
          <div className="hidden sm:flex items-center gap-2">
            <Clock className="w-3 h-3 text-[#0057FF]" />
            <span>{currentTime || 'SYNCHRONIZING TIME...'}</span>
          </div>

          <div className="bg-white border border-[#111111]/10 px-2.5 py-1 rounded-md shadow-sm font-semibold flex items-center gap-1.5 hidden md:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#33CC66] animate-pulse" />
            <span className="text-neutral-700 font-semibold text-[8px]">CORE TELEMETRY: OPTIMAL</span>
          </div>
        </div>
      </header>

      <main
        className="flex-1 w-full h-full bg-[#F6F6F4] relative overflow-hidden transition-all duration-[1200ms]"
        style={{
          transform: isCollapsing ? 'scale(0) rotate(180deg)' : 'scale(1) rotate(0deg)',
          opacity: isCollapsing ? 0 : 1,
          borderRadius: isCollapsing ? '100%' : '0',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${SCENE_CLIP_LEFT}px)` }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              transformOrigin: SCENE_PIVOT_ORIGIN,
              rotate: scrollAngleMv,
              willChange: isNavInMotion ? 'transform' : 'auto',
            }}
          >
            {sceneRing.map(({ id, visible, opacity, slotAngle }) =>
              visible ? (
                <motion.div
                  key={id}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transformOrigin: SCENE_PIVOT_ORIGIN,
                    rotate: slotAngle,
                    opacity,
                    pointerEvents: opacity < 0.5 ? 'none' : 'auto',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="w-full h-full" style={{ paddingLeft: SCENE_CLIP_LEFT }}>
                    {renderChamber(id)}
                  </div>
                </motion.div>
              ) : null,
            )}
          </motion.div>
        </div>
      </main>

      {isCollapsing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#F6F6F4] z-[100] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{
              scale: explosionActive ? [1, 20, 0] : 1,
              opacity: [0, 1, 1],
              backgroundColor: explosionActive ? ['#0057FF', '#00C8FF', '#FFFFFF'] : '#0057FF',
            }}
            className="w-4 h-4 rounded-full shadow-[0_0_40px_10px_#0057FF] absolute z-[110]"
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {explosionActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 30, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="w-12 h-12 rounded-full border border-[#0057FF] absolute z-[105]"
            />
          )}

          <div className="font-mono text-[9px] text-[#0057FF] tracking-[0.4em] uppercase text-center animate-pulse">
            {explosionActive ? 'RE-INITIALIZING SPACE-TIME FABRIC_V1' : 'COLLAPSING CHAMBERS TO ZERO POINT COORDINATES'}
          </div>

          <div className="font-mono text-[8px] text-[#111111]/30 uppercase text-center mt-2">
            [ COORDINATES SYNCHRONIZED: SUCCESS ]
          </div>
        </motion.div>
      )}

      <div
        className="fixed top-16 md:top-20 bottom-0 w-px bg-[#111111]/[0.06] pointer-events-none z-40 hidden md:block"
        style={{ left: SCENE_CLIP_LEFT }}
      />
      <div
        className="fixed top-16 md:top-20 bottom-0 w-16 pointer-events-none z-[55] hidden md:block"
        style={{
          left: SCENE_CLIP_LEFT - 1,
          background: 'linear-gradient(to right, rgba(246,246,244,0.9), transparent)',
        }}
      />
      <div className="fixed top-20 bottom-8 right-6 w-px bg-[#111111]/[0.04] pointer-events-none hidden md:block" />
      <div
        className="fixed bottom-6 right-8 h-px bg-[#111111]/[0.04] pointer-events-none hidden md:block"
        style={{ left: MAIN_PADDING_LEFT }}
      />

      <JogDial
        settledChamberId={currentChamberId}
        previewChamberId={dialLiveChamber}
        syncedAngle={dialDisplayAngle}
        isWheelDriving={isDialWheelActive}
        onChamberChange={handleChamberChange}
        onAngleChange={handleDialAngleChange}
        onInteractionStart={handleDialInteractionStart}
        isCollapsing={isCollapsing}
      />
    </div>
  );
}
