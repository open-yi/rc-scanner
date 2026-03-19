import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import { Cam } from "./components/Cam";
import { Canvas } from "./components/Canvas";
import { Container } from "./components/Container";
import { ErrorMsg } from "./components/ErrorMsg";
import { RectCanvas } from "./components/RectCanvas";
import { Wrapper } from "./components/Wrapper";
import type { AspectRatio, FacingMode, ScannerProps, Stream } from "./types";
import { getPhotoSize } from "./utils/logic";
import { initCameraStream } from "./utils/stream";

export const Scanner = React.forwardRef<unknown, ScannerProps>(
  (
    {
      facingMode = "user" as FacingMode,
      aspectRatio = "cover" as AspectRatio,
      streamCountCallback = () => null,
      deviceId,
      errorMessages = {
        noScannerAccessible:
          "No camera device accessible. Please connect your camera or try a different browser.",
        permissionDenied:
          "Permission denied. Please refresh and give camera permission.",
        switchScanner:
          "It is not possible to switch camera to different one because there is only one video device accessible.",
        canvas: "Canvas is not supported.",
      },
      streamReadyCallback = (stream: MediaStream) => {
        console.log("Stream ready:", stream);
      },
      activeStream = (stream: MediaStream) => {
        console.log("Active stream:", stream);
      },
      streamError = (isError: boolean) => {
        console.log("Stream error:", isError);
      },
      crop = true,
      takingPhoto = false,
      style,
    },
    ref,
  ) => {
    const player = useRef<HTMLVideoElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const show = useRef<HTMLCanvasElement>(null);
    const showCtxRef = useRef<any | null>(null);
    const context = useRef<any | null>(null);
    const container = useRef<HTMLDivElement>(null);
    const [numberOfCameras, setNumberOfCameras] = useState<number>(0);
    const [stream, setStream] = useState<Stream>(null);
    const [currentPixel, setCurrentPixel] = useState<any>(undefined);
    const [currentFacingMode, setFacingMode] = useState<FacingMode>(facingMode);
    const [notSupported, setNotSupported] = useState<boolean>(false);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
    const [torchSupported, setTorchSupported] = useState<boolean>(false);
    const [torch, setTorch] = useState<boolean>(false);
    const mounted = useRef(false);
    const cropArea = useRef<any>(null);
    const cropTimer = useRef<any>(null);
    const isDetecting = useRef(false);
    const initCameraStreamRef = useRef(false);

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    useEffect(() => {
      streamCountCallback(numberOfCameras);
    }, [numberOfCameras]);

    const switchTorch = async (on = false) => {
      if (stream && navigator?.mediaDevices && !!mounted.current) {
        const supportedConstraints =
          navigator.mediaDevices.getSupportedConstraints();
        const [track] = stream.getTracks();
        if (supportedConstraints && "torch" in supportedConstraints && track) {
          try {
            await track.applyConstraints({
              advanced: [{ torch: on }],
            } as MediaTrackConstraintSet);
            return true;
          } catch {
            return false;
          }
        }
      }
      return false;
    };

    useEffect(() => {
      switchTorch(torch);
    }, [torch]);

    useImperativeHandle(ref, () => ({
      getCropArea: () => cropArea.current,
      takePhoto: async (type?: "base64url" | "imgData", cropingArea?: any) => {
        if (numberOfCameras < 1) {
          throw new Error(errorMessages.noScannerAccessible);
        }
        console.log(player?.current, canvas?.current);
        if (player?.current && canvas?.current) {
          const { sX, sY, sW, sH } = getPhotoSize(
            player?.current,
            container.current,
          );
          canvas.current.width = sW;
          canvas.current.height = sH;
          if (!context.current) {
            context.current = canvas.current.getContext("2d", {
              willReadFrequently: true,
            });
          }
          if (context.current && player?.current) {
            context.current.drawImage(
              player.current,
              sX,
              sY,
              sW,
              sH,
              0,
              0,
              sW,
              sH,
            );
          }
          let resultCanvas = canvas.current;
          let resutContext = context.current;
          if (cropingArea) {
            const win: any = window;
            /* 1. 专用于裁剪的小画布（原尺寸） */
            resultCanvas = await win.documentScanner.crop(
              resultCanvas,
              cropingArea,
            );
            resutContext = resultCanvas.getContext("2d")!;
          }
          /* 无裁剪，直接返回整图 */
          let imgData;
          switch (type) {
            case "imgData":
              imgData = resutContext.getImageData(0, 0, sW, sH);
              break;
            default:
              imgData = resultCanvas.toDataURL("image/png");
              break;
          }
          return imgData;
        } else {
          throw new Error(errorMessages.canvas);
        }
      },
      switchScanner: () => {
        if (numberOfCameras < 1) {
          throw new Error(errorMessages.noScannerAccessible);
        } else if (numberOfCameras < 2) {
          console.error(
            "Error: Unable to switch camera. Only one device is accessible.",
          ); // console only
        }
        const newFacingMode =
          currentFacingMode === "user" ? "environment" : "user";
        setCurrentPixel(undefined);
        setFacingMode(newFacingMode);
        return newFacingMode;
      },
      getNumberOfCameras: () => {
        return numberOfCameras;
      },
      toggleTorch: () => {
        const torchVal = !torch;
        setTorch(torchVal);
        return torchVal;
      },
      torchSupported: torchSupported,
    }));

    // 只在首次挂载时初始化相机，或者当 stream 为 null 时重新初始化
    useEffect(() => {
      if (!initCameraStreamRef.current && stream === null) {
        console.log("Initializing camera stream");
        initCameraStreamRef.current = true;
        initCameraStream(
          null,
          (stream: Stream) => {
            console.log("Camera stream initialized");
            setStream(stream);
            activeStream(stream as MediaStream);
          },
          currentFacingMode,
          currentPixel,
          setCurrentPixel,
          setNumberOfCameras,
          (v: boolean | ((prevState: boolean) => boolean)) => {
            setNotSupported(v);
            streamError(true);
          },
          (v: boolean | ((prevState: boolean) => boolean)) => {
            setPermissionDenied(v);
            streamError(true);
          },
          true,
          deviceId,
        );
      }
    }, []); // 空依赖数组，只在组件挂载时执行一次

    useEffect(() => {
      // 当 facingMode 改变时，重新初始化相机（但不通过 useEffect 重复执行）
      if (initCameraStreamRef.current && stream) {
        const newStream = stream;
        // 停止当前 stream
        newStream.getTracks().forEach((track: any) => {
          track.stop();
        });
        // 重新初始化
        initCameraStream(
          null,
          (stream: Stream) => {
            setStream(stream);
            activeStream(stream as MediaStream);
          },
          currentFacingMode,
          currentPixel,
          setCurrentPixel,
          setNumberOfCameras,
          (v: boolean | ((prevState: boolean) => boolean)) => {
            setNotSupported(v);
            streamError(true);
          },
          (v: boolean | ((prevState: boolean) => boolean)) => {
            setPermissionDenied(v);
            streamError(true);
          },
          true,
          deviceId,
        );
      }
    }, [currentFacingMode, deviceId]);

    useEffect(() => {
      switchTorch(false).then((success) => setTorchSupported(success));
      if (stream && player.current) {
        player.current.srcObject = stream;
        player.current.onloadedmetadata = () => {};
      }
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      };
    }, [stream, player.current]);

    const updateCanvas = async () => {
      const vid = player.current;
      const showArea = show.current;
      if (!vid || !showArea || takingPhoto) return;
      let showCtx = showCtxRef.current;
      if (!showCtx) {
        showCtxRef.current = showArea.getContext("2d", {
          willReadFrequently: true,
        });
        showCtx = showCtxRef.current;
        showCtx.imageSmoothingEnabled = true;
      }
      const MODEL_SIZE = 128;
      const win: any = window;

      /* 2. 预处理：128×128 输入 */
      const preprocess = async (
        v: HTMLVideoElement,
        { sX, sY, sW, sH }: any,
      ) => {
        const tCan = document.createElement("canvas");
        tCan.width = MODEL_SIZE;
        tCan.height = Math.round((sH / sW) * MODEL_SIZE);
        const tCtx = tCan.getContext("2d")!;
        tCtx.drawImage(v, sX, sY, sW, sH, 0, 0, tCan.width, tCan.height);
        return tCan;
      };

      /* 3. 映射：128 像素 → 页面显示 */
      const renderBox = (
        fourPts: any,
        { sW, sH, canvasWidth, canvasHeight }: any,
        padH: any,
      ) => {
        /* 1. 还原到「视频裁切区域」像素（去黑边）*/
        const scaleX = sW / MODEL_SIZE; // 宽放大系数
        const scaleY = sH / padH; // 高放大系数
        const vidPts = fourPts.map((p: any) => ({
          x: p.x * scaleX,
          y: p.y * scaleY,
        }));
        /* 3. 后面照旧：4 点 → 外接矩形 → 页面显示 */
        const left = Math.min(...vidPts.map((p: { x: any }) => p.x));
        const top = Math.min(...vidPts.map((p: { y: any }) => p.y));
        const right = Math.max(...vidPts.map((p: { x: any }) => p.x));
        const bottom = Math.max(...vidPts.map((p: { y: any }) => p.y));
        let cropRect = {
          points: undefined,
          width: right - left,
          height: bottom - top,
        };
        if (
          Math.abs(cropRect.width - sW) <= 20 &&
          Math.abs(cropRect.height - sH) <= 20
        )
          return;

        /* 4. 页面显示（同你原来代码）*/
        const pageScaleX = canvasWidth / sW;
        const pageScaleY = canvasHeight / sH;
        /* 5. 画框（同你原来代码）*/
        showArea.width = canvasWidth;
        showArea.height = canvasHeight;
        showCtx.clearRect(0, 0, showArea.width, showArea.height);
        showCtx.fillStyle = "rgba(68,170,255,0.3)";
        showCtx.beginPath();
        showCtx.moveTo(vidPts[0].x * pageScaleX, vidPts[0].y * pageScaleY);
        showCtx.lineTo(vidPts[1].x * pageScaleX, vidPts[1].y * pageScaleY);
        showCtx.lineTo(vidPts[2].x * pageScaleX, vidPts[2].y * pageScaleY);
        showCtx.lineTo(vidPts[3].x * pageScaleX, vidPts[3].y * pageScaleY);
        showCtx.closePath();
        showCtx.fill();
        showCtx.strokeStyle = "#4af";
        showCtx.lineWidth = 2;
        showCtx.stroke();
        cropRect = win.documentScanner.calculateCorrectedSize(vidPts);
        const isWide = canvasWidth >= canvasHeight;
        let scale;
        if (isWide) {
          scale = cropRect.width / sW;
          cropRect.width = sW;
          cropRect.height /= scale;
        } else {
          scale = cropRect.height / sH;
          cropRect.height = sH;
          cropRect.width /= scale;
        }
        cropRect.points = vidPts;
        cropArea.current = cropRect;
      };
      /* 4. 推理循环 */
      if (!isDetecting.current) {
        isDetecting.current = true;
        setTimeout(async () => {
          const photoSize = getPhotoSize(vid, container.current);
          const { sH, sW, canvasWidth, canvasHeight } = photoSize;
          const padH = Math.round((sH / sW) * MODEL_SIZE);
          showArea.width = canvasWidth;
          showArea.height = canvasHeight;
          showCtx.clearRect(0, 0, showArea.width, showArea.height);
          // 画一个占满整个 canvas 的半透明背景框
          showCtx.fillStyle = "rgba(0,0,0,0)";
          showCtx.strokeStyle = "#4af"; // 绿色描边
          showCtx.lineWidth = 2;
          showCtx.fillRect(0, 0, showArea.width, showArea.height);
          showCtx.strokeRect(0, 0, showArea.width, showArea.height);
          cropArea.current = undefined;
          try {
            const tCan = await preprocess(vid, photoSize);
            if (tCan) {
              const points = await win.documentScanner.detect(tCan);
              if (points) {
                renderBox(points, photoSize, padH);
              }
            }
          } catch (e) {
            console.warn(e);
          } finally {
            isDetecting.current = false;
          }
        }, 0);
      }
      cropTimer.current = requestAnimationFrame(updateCanvas);
    };

    // useEffect(() => {
    //   console.log("crop", crop);
    //   const win: any = window;
    //   if (stream && player && player.current && crop) {
    //     updateCanvas();
    //   } else {
    //     cropArea.current = undefined;
    //     cropTimer.current && cancelAnimationFrame(cropTimer.current);
    //     cropTimer.current = undefined;
    //     isDetecting.current = false;
    //     const showArea = show.current;
    //     if (showArea) {
    //       const showCtx = showArea.getContext("2d")!;
    //       showCtx.clearRect(0, 0, showArea.width, showArea.height);
    //     }
    //     win.documentScanner?.resetDetect();
    //   }
    //   return () => {
    //     cropArea.current = undefined;
    //     cropTimer.current && cancelAnimationFrame(cropTimer.current);
    //     cropTimer.current = undefined;
    //     isDetecting.current = false;
    //     const showArea = show.current;
    //     if (showArea) {
    //       const showCtx = showArea.getContext("2d")!;
    //       showCtx.clearRect(0, 0, showArea.width, showArea.height);
    //     }
    //     win.documentScanner?.resetDetect();
    //   };
    // }, [crop, stream, player.current]);

    return (
      <Container style={style} aspectRatio={aspectRatio}>
        <Wrapper>
          {notSupported ? (
            <ErrorMsg>{errorMessages.noScannerAccessible}</ErrorMsg>
          ) : null}
          {permissionDenied ? (
            <ErrorMsg>{errorMessages.permissionDenied}</ErrorMsg>
          ) : null}
          <Cam
            ref={player}
            id="video"
            muted={true}
            autoPlay={true}
            playsInline={true}
            mirrored={currentFacingMode === "user" ? true : false}
            onLoadedData={() => {
              if (stream) {
                streamReadyCallback(stream);
              }
            }}
          />
          <Canvas ref={canvas} />
          <RectCanvas
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              display: crop ? "block" : "none",
            }}
          />
        </Wrapper>
      </Container>
    );
  },
);