
export const getPhotoSize = (vid: HTMLVideoElement, container: HTMLDivElement | null) => {
  const playerWidth = vid.videoWidth || 1280;
  const playerHeight = vid.videoHeight || 720;
  const playerAR = playerWidth / playerHeight;
  const canvasWidth = container?.offsetWidth || 1280;
  const canvasHeight = container?.offsetHeight || 1280;
  const canvasAR = canvasWidth / canvasHeight;
  const greater = playerAR > canvasAR;
  let sX = 0;
  let sY = 0;
  let sW = 0;
  let sH = 0;
  
  if (greater) {
    sH = playerHeight;
    sW = playerHeight * canvasAR;
    sX = (playerWidth - sW) / 2;
    sY = 0;
  } else {
    sW = playerWidth;
    sH = playerWidth / canvasAR;
    sX = 0;
    sY = (playerHeight - sH) / 2;
  }
  
  return {
    sX,
    sY,
    sW,
    sH,
    greater,
    canvasAR,
    canvasWidth,
    canvasHeight,
    playerWidth,
    playerHeight,
    playerAR,
  };
};
