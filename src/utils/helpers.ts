import type { FacingMode, Stream } from '../types';

export const shouldSwitchToCamera = async (
  currentFacingMode: FacingMode,
): Promise<string | undefined> => {
  const cameras: string[] = [];
  
  if (currentFacingMode === 'environment') {
    await navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((i) => i.kind === 'videoinput');
      videoDevices.forEach((device) => {
        const capabilities = (device as InputDeviceInfo).getCapabilities();
        if (
          capabilities.facingMode &&
          capabilities.facingMode.indexOf('environment') >= 0 &&
          capabilities.deviceId
        ) {
          cameras.push(capabilities.deviceId);
        }
      });
    });
  }
  
  if (cameras.length > 1) {
    return cameras.pop();
  }
  
  return undefined;
};

export const detectPixel = (stream: Stream, setCurrentPixel: (pixel: any) => void) => {
  if (!stream) return;
  const track = stream.getVideoTracks()[0];
  if (!track) return;
  const capabilities = track.getCapabilities();
  if (!capabilities?.width?.max) return;
  const pixel = {
    width: { ideal: Math.min(capabilities.width.max, 3840) },
  };
  setCurrentPixel(pixel);
};

export const handleSuccess = (
  stream: MediaStream,
  setNumberOfCameras: (count: number) => void,
  _currentPixel: any,
  setCurrentPixel: (pixel: any) => void,
) => {
  console.log("Current pixel:", _currentPixel);
  detectPixel(stream, setCurrentPixel);
  navigator.mediaDevices
    .enumerateDevices()
    .then((r) =>
      setNumberOfCameras(r.filter((i) => i.kind === 'videoinput').length),
    );
  return stream;
};

export const handleError = (
  error: any,
  setNotSupported: (supported: boolean) => void,
  setPermissionDenied: (denied: boolean) => void,
) => {
  console.error('camera error', error);

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (error?.name === 'PermissionDeniedError') {
    setPermissionDenied(true);
  } else {
    setNotSupported(true);
  }
};