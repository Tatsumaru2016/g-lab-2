import { CHAMBERS } from './types';

export const SCENE_ARC_DEGREES = 30;
export const SCENE_COUNT = CHAMBERS.length;
export const DIAL_SIZE = 380;
export const DIAL_RADIUS = DIAL_SIZE / 2;
export const DIAL_VISIBLE_RATIO = 0.25;
export const DIAL_VISIBLE_WIDTH = Math.round(DIAL_SIZE * DIAL_VISIBLE_RATIO);
export const DIAL_CENTER_OFFSET = DIAL_VISIBLE_WIDTH - DIAL_RADIUS;
export const DIAL_OUTER_R = DIAL_RADIUS - 6;
export const DIAL_LAYOUT_RIGHT = DIAL_CENTER_OFFSET + DIAL_OUTER_R + 18;
export const DIAL_SHADOW_MARGIN = 28;
export const MAIN_PADDING_GAP = 44;
export const SCENE_SAFE_INSET = 32;
export const MAIN_PADDING_LEFT = Math.ceil(
  DIAL_LAYOUT_RIGHT + DIAL_SHADOW_MARGIN + MAIN_PADDING_GAP + SCENE_SAFE_INSET,
);
/** Dial-center pivot expressed inside the clipped scene layer */
export const SCENE_PIVOT_ORIGIN = `${DIAL_CENTER_OFFSET}px 50%`;
export const SCENE_CLIP_LEFT = MAIN_PADDING_LEFT;

/**
 * Settle spring — mimics detent spring pulling knob into notch after coast.
 * Slightly under-damped for the characteristic "click + ring" feel.
 */
export const SCENE_SNAP_SPRING = {
  type: 'spring' as const,
  stiffness: 240,
  damping: 14,
  mass: 1,
};

/** Final gear-lock snap — stiff, slight overshoot like teeth seating */
export const SCENE_GEAR_LOCK_SPRING = {
  type: 'spring' as const,
  stiffness: 310,
  damping: 11.5,
  mass: 1.15,
};

export const SCENE_SNAP_MS = 900;
export const SCENE_TRANSITION_MS = SCENE_SNAP_MS;
export const SCENE_ROTATE_MS = SCENE_SNAP_MS;
export const SCENE_SNAP_EASE_CSS = 'cubic-bezier(0.34, 1.48, 0.44, 1)';

export const SCENE_EXIT_OPACITY_DELAY_MS = 500;
export const SCENE_EXIT_OPACITY_MS = 260;
export const SCENE_EXIT_FADE_EASE = [0.82, 0, 0.95, 1] as const;

export function chamberToAngle(id: number) {
  return (id - 1) * -SCENE_ARC_DEGREES;
}

export function angleToChamber(angle: number) {
  const id = Math.round(angle / -SCENE_ARC_DEGREES) + 1;
  return Math.max(1, Math.min(SCENE_COUNT, id));
}

export function snapAngle(angle: number) {
  return chamberToAngle(angleToChamber(angle));
}

/** Rotation relative to the settled chamber (0° when locked on a detent) */
export function sceneRotateOffset(angle: number, chamberId: number) {
  return angle - chamberToAngle(chamberId);
}
