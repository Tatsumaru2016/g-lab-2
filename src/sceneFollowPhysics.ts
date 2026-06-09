import { clampAngle, type CoastState } from './jogDialPhysics';

/** Soft spring — scene trails the dial */
export const SCENE_FOLLOW_SPRING = 0.042;

/** Higher friction than dial = slower, heavier follow */
export const SCENE_FOLLOW_FRICTION = 0.915;

export const SCENE_FOLLOW_MIN_VELOCITY = 0.025;
export const SCENE_FOLLOW_EPSILON = 0.45;

/** One frame of scene follow toward the dial lead angle */
export function stepSceneFollow(state: CoastState, target: number, dtMs = 16.67): CoastState {
  let { angle, velocity } = state;
  const step = Math.min(Math.max(dtMs / 16.67, 0.5), 2.5);
  const pull = (target - angle) * SCENE_FOLLOW_SPRING * step;
  velocity = velocity * Math.pow(SCENE_FOLLOW_FRICTION, step) + pull * 0.9;
  angle = clampAngle(angle + velocity * step);
  return { angle, velocity };
}

export function isSceneFollowSettled(state: CoastState, target: number) {
  return (
    Math.abs(target - state.angle) < SCENE_FOLLOW_EPSILON &&
    Math.abs(state.velocity) < SCENE_FOLLOW_MIN_VELOCITY
  );
}
