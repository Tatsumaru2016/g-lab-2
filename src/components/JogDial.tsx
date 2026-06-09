import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CHAMBERS } from '../types';
import {
  SCENE_ARC_DEGREES,
  DIAL_SIZE,
  DIAL_CENTER_OFFSET,
  DIAL_VISIBLE_WIDTH,
  SCENE_SNAP_EASE_CSS,
} from '../nav';
import { crossedDetentBoundary } from '../jogDialPhysics';
import { playDetentTick } from '../mechanicalSound';

interface JogDialProps {
  settledChamberId: number;
  previewChamberId: number;
  syncedAngle: number;
  isNavInMotion: boolean;
  onDialDragStart: () => void;
  onDialDragMove: (pointerDelta: number, frameTime: number) => void;
  onDialDragEnd: () => void;
  isCollapsing: boolean;
}

const CENTER = DIAL_SIZE / 2;
const OUTER_R = DIAL_SIZE / 2 - 2;
const BEZEL_R = OUTER_R + 2;
const RING_OUTER = OUTER_R - 4;
const RING_INNER = OUTER_R - 58;
const FACE_R = RING_INNER - 10;
const GEAR_OUTER = RING_INNER - 2;
const GEAR_INNER = FACE_R + 6;
const STAR_R = 34;
const CAP_R = 16;
const RING_BAND = RING_OUTER - RING_INNER;
const LABEL_R = RING_INNER + RING_BAND * 0.24;
const TICK_OUTER = RING_OUTER - 3;
const TICK_INNER_SCENE = LABEL_R + 12;
const TICK_INNER_MID = LABEL_R + 18;
const TICK_INNER_MINOR = LABEL_R + 22;
const SCOUT_SPAN = SCENE_ARC_DEGREES / 2;
const TICK_STEP = 3;
const BEZEL_SEGMENTS = 12;
const STAR_RAYS = 24;
const GEAR_TEETH = 56;

const toRad = (deg: number) => (deg * Math.PI) / 180;

function pointOnCircle(r: number, deg: number) {
  const rad = toRad(deg);
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

/** Radial digits — base toward dial center (combination-lock style) */
function radialTextTransform(deg: number, x: number, y: number) {
  return `rotate(${deg + 90}, ${x}, ${y})`;
}

function arcWedgePath(innerR: number, outerR: number, startDeg: number, endDeg: number) {
  const s1 = pointOnCircle(innerR, startDeg);
  const s2 = pointOnCircle(outerR, startDeg);
  const e2 = pointOnCircle(outerR, endDeg);
  const e1 = pointOnCircle(innerR, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e2.x} ${e2.y}`,
    `L ${e1.x} ${e1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${s1.x} ${s1.y}`,
    'Z',
  ].join(' ');
}

function pieWedgePath(r: number, startDeg: number, endDeg: number) {
  const s = pointOnCircle(r, startDeg);
  const e = pointOnCircle(r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

export default function JogDial({
  settledChamberId,
  previewChamberId,
  syncedAngle,
  isNavInMotion,
  onDialDragStart,
  onDialDragMove,
  onDialDragEnd,
  isCollapsing,
}: JogDialProps) {
  const dialRef = useRef<HTMLDivElement | null>(null);
  const prevSyncedAngle = useRef(syncedAngle);
  const startPointerAngle = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [clickPulse, setClickPulse] = useState(false);

  const displayChamberId =
    isNavInMotion || isDragging ? previewChamberId : settledChamberId;

  const triggerDetentClick = useCallback(() => {
    setClickPulse(true);
    window.setTimeout(() => setClickPulse(false), 200);
    playDetentTick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([10, 18, 6]);
    }
  }, []);

  useEffect(() => {
    if (crossedDetentBoundary(prevSyncedAngle.current, syncedAngle)) {
      triggerDetentClick();
    }
    prevSyncedAngle.current = syncedAngle;
  }, [syncedAngle, triggerDetentClick]);

  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    return (
      Math.atan2(
        clientY - (rect.top + rect.height / 2),
        clientX - (rect.left + rect.width / 2),
      ) *
      (180 / Math.PI)
    );
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    onDialDragStart();
    startPointerAngle.current = getPointerAngle(e.clientX, e.clientY);
    dialRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const pointerDelta = getPointerAngle(e.clientX, e.clientY) - startPointerAngle.current;
    onDialDragMove(pointerDelta, performance.now());
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    onDialDragEnd();
  };

  const rimTicks = [];
  for (let deg = 0; deg < 360; deg += TICK_STEP) {
    const isScene = deg % SCENE_ARC_DEGREES === 0;
    const isMid = !isScene && deg % (SCENE_ARC_DEGREES / 2) === 0;

    let inner: number;
    let outer: number;
    let stroke: string;
    let strokeWidth: number;

    outer = TICK_OUTER;
    if (isScene) {
      const chamberId = deg / SCENE_ARC_DEGREES + 1;
      const isActive = chamberId === displayChamberId;
      inner = TICK_INNER_SCENE;
      stroke = isActive ? '#0057FF' : 'rgba(17,17,17,0.5)';
      strokeWidth = isActive ? 2.2 : 1.8;
    } else if (isMid) {
      inner = TICK_INNER_MID;
      stroke = 'rgba(17,17,17,0.34)';
      strokeWidth = 1.15;
    } else {
      inner = TICK_INNER_MINOR;
      stroke = 'rgba(17,17,17,0.16)';
      strokeWidth = 0.6;
    }

    const p1 = pointOnCircle(inner, deg);
    const p2 = pointOnCircle(outer, deg);
    rimTicks.push(
      <line
        key={`rim-tick-${deg}`}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />,
    );
  }

  const scoutPath = arcWedgePath(RING_INNER, RING_OUTER, -SCOUT_SPAN, SCOUT_SPAN);
  const scoutLabel = pointOnCircle(LABEL_R, 0);

  const bezelSegments = Array.from({ length: BEZEL_SEGMENTS }, (_, i) => {
    const start = (360 / BEZEL_SEGMENTS) * i - 90;
    const end = (360 / BEZEL_SEGMENTS) * (i + 1) - 90;
    const light = i % 2 === 0;
    return (
      <path
        key={`bezel-seg-${i}`}
        d={arcWedgePath(RING_OUTER + 1, BEZEL_R + 3, start, end)}
        fill={light ? '#DEDEDC' : '#9A9A98'}
      />
    );
  });

  const gearTeeth = Array.from({ length: GEAR_TEETH }, (_, i) => {
    if (i % 2 !== 0) return null;
    const deg = (360 / GEAR_TEETH) * i;
    const p1 = pointOnCircle(GEAR_INNER, deg - 2.2);
    const p2 = pointOnCircle(GEAR_OUTER, deg);
    const p3 = pointOnCircle(GEAR_INNER, deg + 2.2);
    return (
      <polygon
        key={`gear-${i}`}
        points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
        fill={i % 4 === 0 ? '#B8B8B6' : '#A0A09E'}
      />
    );
  });

  const starburst = Array.from({ length: STAR_RAYS }, (_, i) => {
    const start = (360 / STAR_RAYS) * i - 90;
    const end = (360 / STAR_RAYS) * (i + 1) - 90;
    return (
      <path
        key={`star-${i}`}
        d={pieWedgePath(STAR_R, start, end)}
        fill={i % 2 === 0 ? '#E4E4E2' : '#A6A6A4'}
      />
    );
  });

  return (
    <div
      className="fixed left-0 top-0 bottom-0 z-[60] select-none pointer-events-none"
      style={{
        width: DIAL_VISIBLE_WIDTH,
        transform: isCollapsing ? 'translateX(-120%)' : 'translateX(0)',
        transition: `transform 0.8s ${SCENE_SNAP_EASE_CSS}`,
      }}
    >
      <div
        className="absolute top-1/2 pointer-events-auto"
        style={{
          left: DIAL_CENTER_OFFSET,
          width: DIAL_SIZE,
          height: DIAL_SIZE,
          transform: 'translate(-50%, -50%)',
          filter: isDragging
            ? 'drop-shadow(24px 10px 42px rgba(17,17,17,0.34)) drop-shadow(8px 4px 16px rgba(80,80,80,0.22)) drop-shadow(2px 1px 3px rgba(0,0,0,0.2))'
            : 'drop-shadow(22px 8px 38px rgba(17,17,17,0.3)) drop-shadow(6px 3px 14px rgba(80,80,80,0.2)) drop-shadow(1px 1px 2px rgba(0,0,0,0.18))',
        }}
      >
        {/* Blue scouter — flush with rim at 3 o'clock */}
        <svg
          className="absolute inset-0 z-20 pointer-events-none"
          viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
        >
          <defs>
            <linearGradient id="scout-fill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,87,255,0.04)" />
              <stop offset="50%" stopColor="rgba(0,87,255,0.14)" />
              <stop offset="100%" stopColor="rgba(0,87,255,0.06)" />
            </linearGradient>
            <filter id="scout-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#0057FF" floodOpacity="0.45" />
            </filter>
          </defs>
          <path
            d={scoutPath}
            fill="url(#scout-fill)"
            stroke="#0057FF"
            strokeWidth={clickPulse ? 2 : 1.5}
            strokeLinejoin="round"
            filter={clickPulse ? 'url(#scout-glow)' : undefined}
          />
          <line
            x1={CENTER + RING_INNER}
            y1={CENTER}
            x2={CENTER + RING_OUTER}
            y2={CENTER}
            stroke="#0057FF"
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.7}
          />
          <text
            x={scoutLabel.x}
            y={scoutLabel.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#0057FF"
            fontSize={clickPulse ? 18 : 16}
            fontFamily="Space Grotesk, sans-serif"
            fontWeight={700}
            letterSpacing="-0.02em"
            transform={radialTextTransform(0, scoutLabel.x, scoutLabel.y)}
            style={{ transition: 'font-size 0.15s ease' }}
          >
            {displayChamberId}
          </text>
        </svg>

        <div
          ref={dialRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 rounded-full cursor-grab active:cursor-grabbing"
          style={{
            transform: `rotate(${syncedAngle}deg)`,
            willChange: isNavInMotion ? 'transform' : 'auto',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
          >
            <defs>
              <radialGradient id="dial-body" cx="35%" cy="28%" r="75%">
                <stop offset="0%" stopColor="#F2F2F0" />
                <stop offset="55%" stopColor="#D8D8D6" />
                <stop offset="100%" stopColor="#A8A8A6" />
              </radialGradient>
              <linearGradient id="dial-rim-metal" x1="8%" y1="4%" x2="92%" y2="96%">
                <stop offset="0%" stopColor="#F8F8F6" />
                <stop offset="22%" stopColor="#D0D0CE" />
                <stop offset="50%" stopColor="#B0B0AE" />
                <stop offset="78%" stopColor="#D4D4D2" />
                <stop offset="100%" stopColor="#90908E" />
              </linearGradient>
              <linearGradient id="dial-rim-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
              </linearGradient>
              <radialGradient id="dial-face-plate" cx="42%" cy="36%" r="58%">
                <stop offset="0%" stopColor="#ECECEA" />
                <stop offset="70%" stopColor="#C8C8C6" />
                <stop offset="100%" stopColor="#A4A4A2" />
              </radialGradient>
              <radialGradient id="dial-cap" cx="38%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#D8D8D6" />
                <stop offset="100%" stopColor="#888886" />
              </radialGradient>
              <linearGradient id="cap-cone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0F0EE" />
                <stop offset="35%" stopColor="#C8C8C6" />
                <stop offset="65%" stopColor="#787876" />
                <stop offset="100%" stopColor="#B8B8B6" />
              </linearGradient>
            </defs>

            {/* Base shadow disc */}
            <circle cx={CENTER + 3} cy={CENTER + 4} r={BEZEL_R + 4} fill="rgba(0,0,0,0.12)" />

            {/* Segmented grip bezel (12 alternating facets) */}
            {bezelSegments}
            <circle cx={CENTER} cy={CENTER} r={BEZEL_R + 3} fill="none" stroke="rgba(17,17,17,0.2)" strokeWidth="1.5" />
            <circle cx={CENTER} cy={CENTER} r={RING_OUTER + 1} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.25" />

            {/* Main metal body */}
            <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="url(#dial-body)" />
            <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="none" stroke="rgba(17,17,17,0.16)" strokeWidth="2" />

            {/* Brushed scale ring */}
            <circle cx={CENTER} cy={CENTER} r={RING_OUTER} fill="url(#dial-rim-metal)" />
            <circle cx={CENTER} cy={CENTER} r={RING_OUTER} fill="url(#dial-rim-shine)" />
            <circle cx={CENTER} cy={CENTER} r={RING_INNER} fill="#B4B4B2" />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RING_INNER}
              fill="none"
              stroke="rgba(17,17,17,0.22)"
              strokeWidth="2"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RING_OUTER}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RING_OUTER}
              fill="none"
              stroke="rgba(17,17,17,0.12)"
              strokeWidth="2.5"
            />

            {rimTicks}

            {/* Recessed face plate */}
            <circle cx={CENTER} cy={CENTER} r={FACE_R + 5} fill="#8E8E8C" />
            <circle cx={CENTER} cy={CENTER} r={FACE_R + 4} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
            <circle cx={CENTER} cy={CENTER} r={FACE_R} fill="url(#dial-face-plate)" />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={FACE_R}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.25"
            />

            {/* Serrated gear ring */}
            <circle cx={CENTER} cy={CENTER} r={GEAR_OUTER} fill="#AEAEAC" />
            {gearTeeth}
            <circle cx={CENTER} cy={CENTER} r={GEAR_INNER} fill="none" stroke="rgba(17,17,17,0.12)" strokeWidth="1" />

            {/* Starburst center cap */}
            <circle cx={CENTER} cy={CENTER} r={STAR_R + 2} fill="#9C9C9A" />
            {starburst}
            <circle cx={CENTER} cy={CENTER} r={STAR_R} fill="none" stroke="rgba(17,17,17,0.1)" strokeWidth="1" />
            <circle cx={CENTER} cy={CENTER} r={CAP_R + 4} fill="url(#dial-cap)" />
            <circle cx={CENTER} cy={CENTER} r={CAP_R} fill="url(#cap-cone)" />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={CAP_R}
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.2"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={CAP_R}
              fill="none"
              stroke="rgba(17,17,17,0.15)"
              strokeWidth="0.75"
            />

            {/* Scene numbers — radial orientation, base toward center */}
            {CHAMBERS.map((chamber) => {
              const deg = (chamber.id - 1) * SCENE_ARC_DEGREES;
              const isActive = chamber.id === displayChamberId;
              const lp = pointOnCircle(LABEL_R, deg);
              const worldAngle = ((deg + syncedAngle) % 360 + 360) % 360;
              const nearIndex = worldAngle < SCOUT_SPAN + 2 || worldAngle > 360 - SCOUT_SPAN - 2;
              const showRingLabel = !nearIndex;

              if (!showRingLabel) return null;

              return (
                <text
                  key={chamber.id}
                  x={lp.x}
                  y={lp.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? '#0057FF' : 'rgba(17,17,17,0.75)'}
                  fontSize={isActive ? 15 : 13}
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight={700}
                  transform={radialTextTransform(deg, lp.x, lp.y)}
                >
                  {chamber.id}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
