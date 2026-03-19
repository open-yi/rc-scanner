import type { FacingMode, SetNotSupported, SetPermissionDenied, SetStream, Stream } from '../types';
import { handleError, handleSuccess } from './helpers';

export const initCameraStream = async (
  stream: Stream,
  setStream: SetStream,
  currentFacingMode: FacingMode,
  currentPixel: any,
  setCurrentPixel: (pixel: any) => void,
  setNumberOfCameras: (count: number) => void,
  setNotSupported: SetNotSupported,
  setPermissionDenied: SetPermissionDenied,
  isMounted: boolean,
  videoSourceDeviceId?: string,
): Promise<void> => {
  // Stop any active streams in the window
  if (stream) {
    stream.getTracks().forEach((track: any) => {
      track.stop();
    });
  }

  let cameraDeviceId;
  const switchToCamera = await (async () => {
    const win: any = window;
    return await win.documentScanner?.shouldSwitchToCamera?.(currentFacingMode);
  })();

  if (switchToCamera) {
    cameraDeviceId = switchToCamera;
  } else {
    cameraDeviceId = videoSourceDeviceId
      ? { exact: videoSourceDeviceId }
      : undefined;
  }

  const constraints = {
    audio: false,
    video: {
      deviceId: cameraDeviceId,
      facingMode: currentFacingMode,
      ...currentPixel,
    },
  };

  // Try modern API
  try {
    (navigator.mediaDevices as any)
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        if (isMounted) {
          setStream(
            handleSuccess(
              stream,
              setNumberOfCameras,
              currentPixel,
              setCurrentPixel,
            ),
          );
        }
      })
      .catch((err: any) => {
        handleError(err, setNotSupported, setPermissionDenied);
      });
  } catch {
    // Fallback to legacy API
    const getWebcam =
      (navigator as any).getUserMedia ||
      (navigator as any).webkitGetUserMedia ||
      (navigator as any).mozGetUserMedia ||
      (navigator as any).mozGetUserMedia ||
      (navigator as any).msGetUserMedia;
    if (getWebcam) {
      getWebcam(
        constraints,
        async (stream: MediaStream) => {
          if (isMounted) {
            setStream(
              handleSuccess(
                stream,
                setNumberOfCameras,
                currentPixel,
                setCurrentPixel,
              ),
            );
          }
        },
        (err: Error) => {
          handleError(err as Error, setNotSupported, setPermissionDenied);
        },
      );
    } else {
      setNotSupported(true);
    }
  }
};
