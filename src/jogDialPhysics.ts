import { SCENE_ARC_DEGREES, SCENE_COUNT, chamberToAngle, angleToChamber } from './nav';

/** Detent interval (degrees) — one scene per click */
export const JOG_DETENT_DEG = SCENE_ARC_DEGREES;

/** Viscous friction per 60fps frame (Knowles: moderate friction + inertia feels natural) */
export const JOG_FRICTION = 0.86;

/** Spring pull toward detent when coasting / settling */
export const JOG_SETTLE_SPRING = 0.22;

/** Min |velocity| (deg/frame) to keep coasting after release */
export const JOG_COAST_MIN_VELOCITY = 0.08;

/** Snap complete when within this many degrees of detent */
export const JOG_SETTLE_EPSILON = 0.35;

/** Detent well — resistance peaks between clicks (ratchet torque profile) */
export const JOG_DETENT_RESISTANCE = 2.8;

export function clampAngle(angle: number) {
  return Math.max(chamberToAngle(SCENE_COUNT), Math.min(0, angle));
}

export function snapToDetent(angle: number) {
  return chamberToAngle(angleToChamber(angle));
}

/**
 * Ratchet resistance: easy near detent center, stiff between detents.
 * Models the exponential torque rise described in haptic dial research.
 */
export function applyDetentResistance(angle: number, delta: number) {
  const half = JOG_DETENT_DEG / 2;
  const offset = angle - snapToDetent(angle);
  const distFromCenter = Math.min(1, Math.abs(offset) / half);
  const resistance = 1 + JOG_DETENT_RESISTANCE * distFromCenter ** 3;
  return delta / resistance;
}

/** True when pointer rotation crossed a detent midpoint (scene boundary). */
export function crossedDetentBoundary(prevAngle: number, nextAngle: number) {
  return angleToChamber(prevAngle) !== angleToChamber(nextAngle);
}

export interface CoastState {
  angle: number;
  velocity: number;
}

/** One physics frame after pointer release — inertia + friction + detent spring. */
export function stepCoast(state: CoastState): CoastState {
  let { angle, velocity } = state;

  velocity *= JOG_FRICTION;
  angle = clampAngle(angle + velocity);

  const target = snapToDetent(angle);
  const pull = (target - angle) * JOG_SETTLE_SPRING;
  angle = clampAngle(angle + pull);
  velocity = velocity * 0.88 + pull * 0.15;

  return { angle, velocity };
}

export function isCoastSettled(state: CoastState) {
  const target = snapToDetent(state.angle);
  return (
    Math.abs(state.velocity) < JOG_COAST_MIN_VELOCITY &&
    Math.abs(target - state.angle) < JOG_SETTLE_EPSILON
  );
}
