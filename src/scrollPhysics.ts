import { SCENE_ARC_DEGREES, SCENE_COUNT, chamberToAngle } from './nav';
import {
  clampAngle,
  crossedDetentBoundary,
  snapToDetent,
  type CoastState,
} from './jogDialPhysics';

/** Swipe delta → angle */
export const SCROLL_SWIPE_GAIN = 0.14;

/** Accumulated |deltaY| needed to register one mechanical notch */
export const WHEEL_NOTCH_THRESHOLD = 45;

/** Initial kick toward target detent (deg / frame @60fps) */
export const WHEEL_STEP_IMPULSE = 1.05;

/** Peak coast speed — lower = easier to follow visually */
export const SCROLL_MAX_VELOCITY = 1.15;

/** Coast friction — higher = longer, slower glide */
export const SCROLL_FRICTION = 0.985;

/** Light guidance toward step target during glide */
export const SCROLL_GUIDE_SPRING = 0.028;

/** Final gear teeth engagement pull */
export const SCROLL_GEAR_SPRING = 0.4;

export const SCROLL_GEAR_ENGAGE_SPEED = 0.42;
export const SCROLL_GEAR_ENGAGE_DIST = SCENE_ARC_DEGREES * 0.35;

export const SCROLL_SETTLE_EPSILON = 0.12;
export const SCROLL_COAST_MIN_VELOCITY = 0.025;

export interface WheelCoastState extends CoastState {
  engaging: boolean;
  target: number;
}

/** Next detent from settled chamber — one step per wheel notch */
export function nextDetentTarget(chamberId: number, direction: 1 | -1) {
  const nextId = Math.max(1, Math.min(SCENE_COUNT, chamberId + direction));
  return chamberToAngle(nextId);
}

export function wheelImpulseToward(angle: number, target: number) {
  const remaining = target - angle;
  if (Math.abs(remaining) < 0.5) return 0;
  const sign = Math.sign(remaining);
  return sign * Math.min(Math.abs(remaining) * 0.07, WHEEL_STEP_IMPULSE);
}

export function stepWheelCoast(state: WheelCoastState): WheelCoastState {
  let { angle, velocity, target } = state;

  velocity *= SCROLL_FRICTION;
  if (Math.abs(velocity) > SCROLL_MAX_VELOCITY) {
    velocity = Math.sign(velocity) * SCROLL_MAX_VELOCITY;
  }
  angle = clampAngle(angle + velocity);

  const dist = target - angle;
  const speed = Math.abs(velocity);
  const engaging = Math.abs(dist) < SCROLL_GEAR_ENGAGE_DIST && speed < SCROLL_GEAR_ENGAGE_SPEED;

  if (engaging) {
    const pull = dist * (SCROLL_GEAR_SPRING + (1 - Math.abs(dist) / SCROLL_GEAR_ENGAGE_DIST) * 0.25);
    angle = clampAngle(angle + pull);
    velocity = velocity * 0.25 + pull * 0.12;
  } else {
    const pull = dist * SCROLL_GUIDE_SPRING;
    angle = clampAngle(angle + pull);
    velocity += pull * 0.06;
  }

  return { angle, velocity, target, engaging };
}

export function isWheelCoastSettled(state: WheelCoastState) {
  return (
    Math.abs(state.target - state.angle) < SCROLL_SETTLE_EPSILON &&
    Math.abs(state.velocity) < SCROLL_COAST_MIN_VELOCITY
  );
}

export { crossedDetentBoundary, clampAngle, snapToDetent };
