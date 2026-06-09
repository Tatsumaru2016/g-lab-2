import { SCENE_ARC_DEGREES, SCENE_COUNT, chamberToAngle } from './nav';
import {
  clampAngle,
  crossedDetentBoundary,
  snapToDetent,
  JOG_COAST_MIN_VELOCITY,
  JOG_FRICTION,
  JOG_SETTLE_EPSILON,
  JOG_SETTLE_SPRING,
  type CoastState,
} from './jogDialPhysics';

/** Swipe delta → angle */
export const SCROLL_SWIPE_GAIN = 0.14;

/** Accumulated |deltaY| needed to register one mechanical notch */
export const WHEEL_NOTCH_THRESHOLD = 45;

/** Gear-engage cue — same band as dial coast near detent */
export const SCROLL_GEAR_ENGAGE_DIST = SCENE_ARC_DEGREES * 0.4;
export const SCROLL_GEAR_ENGAGE_SPEED = 0.55;

export interface WheelCoastState extends CoastState {
  engaging: boolean;
  target: number;
}

/** Next detent from settled chamber — one step per wheel notch */
export function nextDetentTarget(chamberId: number, direction: 1 | -1) {
  const nextId = Math.max(1, Math.min(SCENE_COUNT, chamberId + direction));
  return chamberToAngle(nextId);
}

/** Initial velocity — dial release flick toward the next detent */
export function wheelImpulseToward(angle: number, target: number) {
  const remaining = target - angle;
  if (Math.abs(remaining) < 0.5) return 0;
  const sign = Math.sign(remaining);
  return sign * Math.min(Math.abs(remaining) * 0.055, 1.5);
}

/**
 * Wheel coast uses the same inertia + detent spring as jog dial release,
 * but pulls toward the wheel step target instead of the nearest detent.
 */
export function stepWheelCoast(state: WheelCoastState, dtMs = 16.67): WheelCoastState {
  let { angle, velocity, target } = state;
  const step = Math.min(Math.max(dtMs / 16.67, 0.5), 2.5);

  velocity *= Math.pow(JOG_FRICTION, step);
  angle = clampAngle(angle + velocity * step);

  const pull = (target - angle) * JOG_SETTLE_SPRING * step;
  angle = clampAngle(angle + pull);
  velocity = velocity * Math.pow(0.88, step) + pull * 0.14;

  const engaging =
    Math.abs(target - angle) < SCROLL_GEAR_ENGAGE_DIST &&
    Math.abs(velocity) < SCROLL_GEAR_ENGAGE_SPEED;

  return { angle, velocity, target, engaging };
}

export function isWheelCoastSettled(state: WheelCoastState) {
  return (
    Math.abs(state.target - state.angle) < JOG_SETTLE_EPSILON &&
    Math.abs(state.velocity) < JOG_COAST_MIN_VELOCITY
  );
}

export { crossedDetentBoundary, clampAngle, snapToDetent };
