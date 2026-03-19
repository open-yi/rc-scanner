export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const STEP_ZOOM = 0.25;

export const ERROR_MESSAGES = {
  noCameraAccessible:
    'No camera device accessible. Please connect your camera or try a different browser.',
  permissionDenied:
    'Permission denied. Please refresh and give camera permission.',
  switchCamera:
    'It is not possible to switch camera to different one because there is only one video device accessible.',
  canvas: 'Canvas is not supported.',
} as const;