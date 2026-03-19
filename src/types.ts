export type FacingMode = 'user' | 'environment';
export type AspectRatio = 'cover' | number;
export type Stream = MediaStream | null;
export type SetStream = (stream: Stream) => void;
export type SetNumberOfStreams = (count: number) => void;
export type SetNotSupported = (value: boolean) => void;
export type SetPermissionDenied = (value: boolean) => void;
export type SetTorchSupported = (value: boolean) => void;
export type SetTorchOnOff = (value: boolean) => void;
export interface ScannerProps {
  facingMode?: FacingMode;
  aspectRatio?: AspectRatio;
  streamCountCallback?: (count: number) => void;
  deviceId?: string;
  errorMessages: {
    noScannerAccessible?: string;
    permissionDenied?: string;
    switchScanner?: string;
    canvas?: string;
  };
  streamReadyCallback?: (stream: MediaStream) => void;
  activeStream?: (stream: MediaStream) => void;
  streamError?: (isError: boolean) => void;
  crop?: boolean;
  takingPhoto?: boolean;
  style?: React.CSSProperties;
  autoTake?: boolean | number;
}

export type ScannerType = React.ForwardRefExoticComponent<
  ScannerProps & React.RefAttributes<unknown>
> &
  {
    takePhoto(
      type?: 'base64url' | 'imgData',
      croppingArea?: any,
    ): string | ImageData;
    switchScanner(): FacingMode;
    getNumberOfStreams(): number;
    toggleTorch(): boolean;
    torchSupported: boolean;
    getCropArea(): any;
  };