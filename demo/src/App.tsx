import Image from "rc-image";
import { ToolbarRenderInfoType } from "rc-image/lib/Preview";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  AiOutlineClose,
  AiOutlineHistory,
  AiOutlineRotateLeft,
  AiOutlineRotateRight,
  AiOutlineSave,
  AiOutlineSwap,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
} from "react-icons/ai";
import { GrScan } from "react-icons/gr";
import { LuSwitchCamera } from "react-icons/lu";
import { Scanner, type ScannerType } from "../../src";
import styles from "./app.module.less";

export default () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [, forceUpdate] = useState<any>();
  const [preview, setPreview] = useState<any>(null);

  const cropOn = useRef<boolean>(true);
  const camera = useRef<ScannerType>(null);
  const cam = useRef<any>(null);
  const capturing = useRef<boolean>(false);

  const handleTakePhoto = async () => {
    if (camera.current && !capturing.current) {
      capturing.current = true;
      const cropArea = camera.current?.getCropArea();
      try {
        let photo = (await camera.current?.takePhoto(
          undefined,
          cropArea,
        )) as string;
        setPreview(photo);
      } catch (e) {
        console.log(e);
      }
      capturing.current = false;
      forceUpdate({});
    }
  };

  const body = document.querySelector("body");
  return ReactDOM.createPortal(
    <div className={`${styles.app} app`}>
      <div ref={cam} className="wrapper">
        {!preview && (
          <div className="photo-area">
            <div onClick={handleTakePhoto}>
              <Scanner
                facingMode="environment"
                ref={camera}
                aspectRatio="cover"
                numberOfCamerasCallback={setNumberOfCameras}
                errorMessages={{}}
                crop={!preview && !capturing.current && cropOn.current}
                takingPhoto={capturing.current}
                videoReadyCallback={() => {}}
                errorStream={(isError: any) => isError}
              />
            </div>
          </div>
        )}
        {!preview && (
          <div className="controller">
            <button
              style={{ color: "#fff", fontSize: 18 }}
              disabled={numberOfCameras <= 1}
              onClick={() => {
                if (camera.current) {
                  camera.current.switchScanner();
                }
              }}
            >
              <LuSwitchCamera style={{ position: "relative", top: 1.5 }} />
            </button>
            <button
              style={{ color: "#fff", opacity: torchOn ? 1 : 0.4 }}
              onClick={() => {
                if (camera.current) {
                  camera.current.toggleTorch();
                  setTorchOn(!torchOn);
                }
              }}
            >
              flash
            </button>
            <button
              style={{ color: "#fff", opacity: cropOn.current ? 1 : 0.4 }}
              color="default"
              onClick={() => {
                cropOn.current = !cropOn.current;
                forceUpdate({});
              }}
            >
              crop
            </button>
          </div>
        )}

        {preview && (
          <div className="preview">
            <Image
              src={preview}
              style={{ display: "none" }}
              preview={{
                visible: true,
                getContainer: () => cam.current,
                closeIcon: <AiOutlineClose />,
                onVisibleChange: (visible) => {
                  if (!visible) {
                    setPreview(null);
                  }
                },
                destroyOnClose: true,
                toolbarRender(
                  originalNode: React.ReactElement,
                  info: Omit<ToolbarRenderInfoType, "current" | "total">,
                ) {
                  const { actions } = info;
                  const {
                    onRotateLeft,
                    onRotateRight,
                    onFlipX,
                    onFlipY,
                    onReset,
                    onZoomIn,
                    onZoomOut,
                  } = actions;
                  const onSave = async () => {
                    try {
                      const response = await fetch(preview);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `photo_${Date.now()}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error("Failed to save image:", error);
                    }
                  };
                  return (
                    <div className="rc-image-preview-operations">
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-flipY"
                        onClick={onFlipY}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: "rotate(90deg)",
                        }}
                      >
                        <AiOutlineSwap style={{ display: "block" }} />
                      </div>
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-flipX"
                        onClick={onFlipX}
                      >
                        <AiOutlineSwap />
                      </div>
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-rotateLeft"
                        onClick={onRotateLeft}
                      >
                        <AiOutlineRotateLeft />
                      </div>
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-rotateRight"
                        onClick={onRotateRight}
                      >
                        <AiOutlineRotateRight />
                      </div>
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-zoomIn"
                        onClick={onZoomIn}
                      >
                        <AiOutlineZoomIn />
                      </div>
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-zoomOut"
                        onClick={onZoomOut}
                      >
                        <AiOutlineZoomOut />
                      </div>
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-reset"
                        onClick={onReset}
                      >
                        <AiOutlineHistory />
                      </div>
                      <div
                        className="rc-image-preview-operations-operation rc-image-preview-operations-operation-save"
                        onClick={onSave}
                      >
                        <AiOutlineSave />
                      </div>
                    </div>
                  );
                },
              }}
            />
          </div>
        )}

        {!preview && (
          <div className="bar">
            <div className="left"></div>
            <div className="center">
              <GrScan
                style={{
                  fontSize: 14,
                  position: "relative",
                  top: 3,
                  right: 6,
                }}
              />
              click / tap the screen
            </div>
            <div className="right"></div>
          </div>
        )}
      </div>
    </div>,
    body as Element,
  );
};