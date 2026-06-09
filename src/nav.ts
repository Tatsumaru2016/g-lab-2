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
/** Outgoing scene stays fully visible until this fraction of the arc */
export const SCENE_EXIT_FADE_START_RATIO = 0.42;
export const SCENE_EXIT_FADE_START_DEG = SCENE_ARC_DEGREES * SCENE_EXIT_FADE_START_RATIO;
/** Higher = slower, gentler fade-out while scrolling */
export const SCENE_EXIT_FADE_SOFTNESS = 2.8;
export const SCENE_MOTION_PREVIEW_DEG = 2.5;

export function sceneTransitionFade(scrollAngle: number, chamberId: number) {
  const travel = Math.abs(sceneRotateOffset(scrollAngle, chamberId));
  if (travel <= SCENE_EXIT_FADE_START_DEG) return 1;
  if (travel >= SCENE_ARC_DEGREES) return 0;
  const t =
    (travel - SCENE_EXIT_FADE_START_DEG) / (SCENE_ARC_DEGREES - SCENE_EXIT_FADE_START_DEG);
  return Math.pow(1 - t, SCENE_EXIT_FADE_SOFTNESS);
}

/** Next chamber from scroll offset — incoming layer appears early for smooth overlap */
export function motionPreviewChamber(scrollAngle: number, settledChamberId: number) {
  const offset = sceneRotateOffset(scrollAngle, settledChamberId);
  if (Math.abs(offset) < SCENE_MOTION_PREVIEW_DEG) return settledChamberId;
  const next = settledChamberId + (offset < 0 ? 1 : -1);
  return Math.max(1, Math.min(SCENE_COUNT, next));
}

/**
 * Carousel angle for chamber `id` on the ring (dial center = pivot).
 * Scene 1 at 0°, each next scene every SCENE_ARC_DEGREES clockwise on the ring.
 */
export function chamberToAngle(id: number) {
  return (id - 1) * -SCENE_ARC_DEGREES;
}

/** Fixed slot on the concentric ring — negates chamberToAngle for nested carousel child rotate */
export function sceneSlotAngle(id: number) {
  return -chamberToAngle(id);
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

/** Opacity for a scene layer on the concentric carousel */
export function sceneLayerOpacity(
  scrollAngle: number,
  sceneId: number,
  settledChamberId: number,
  isMotionActive: boolean,
  forcedPreviewId?: number,
) {
  if (!isMotionActive) {
    return sceneId === settledChamberId ? 1 : 0;
  }
  const preview =
    forcedPreviewId !== undefined
      ? forcedPreviewId
      : motionPreviewChamber(scrollAngle, settledChamberId);
  if (sceneId === settledChamberId) {
    return sceneTransitionFade(scrollAngle, settledChamberId);
  }
  if (sceneId === preview) {
    return 1 - sceneTransitionFade(scrollAngle, settledChamberId);
  }
  return 0;
}

export function shouldRenderSceneLayer(
  scrollAngle: number,
  sceneId: number,
  settledChamberId: number,
  isMotionActive: boolean,
  forcedPreviewId?: number,
) {
  if (!isMotionActive) return sceneId === settledChamberId;
  return (
    sceneLayerOpacity(scrollAngle, sceneId, settledChamberId, true, forcedPreviewId) > 0.001
  );
}
