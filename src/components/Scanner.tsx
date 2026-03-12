import React, { useState, useEffect, useRef } from 'react';

export interface ScannerProps {
  onScan?: (data: string | ArrayBuffer) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  className?: string;
  allowZoom?: boolean;
  allowCrop?: boolean;
  mode?: 'document' | 'photo' | 'qr';
}

export type ScanMode = 'document' | 'photo' | 'qr';

export const Scanner: React.FC<ScannerProps> = ({
  onScan,
  onError,
  autoStart = true,
  className = '',
  allowZoom = true,
  allowCrop = false,
  mode = 'document'
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [documentRect, setDocumentRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const minZoom = 1;
  const maxZoom = 3;
  const stepZoom = 0.25;

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to access camera'));
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsScanning(false);
  };

  const handleZoomIn = () => {
    if (zoom < maxZoom) {
      setZoom(Math.min(zoom + stepZoom, maxZoom));
    }
  };

  const handleZoomOut = () => {
    if (zoom > minZoom) {
      setZoom(Math.max(zoom - stepZoom, minZoom));
    }
  };

  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setDocumentRect(null);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!allowZoom) return;
    setIsDragging(true);
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !allowZoom) return;
    let clientX: number, clientY: number;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    setPanX(prev => prev + dx);
    setPanY(prev => prev + dy);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const captureDocument = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size
    canvas.width = img.naturalWidth * zoom;
    canvas.height = img.naturalHeight * zoom;

    // Apply crop if document rect exists
    if (documentRect && allowCrop) {
      ctx.save();
      ctx.translate(-documentRect.x * zoom, -documentRect.y * zoom);
      ctx.drawImage(
        img,
        -documentRect.x * zoom,
        -documentRect.y * zoom,
        img.naturalWidth * zoom,
        img.naturalHeight * zoom
      );
      ctx.restore();
    } else {
      ctx.drawImage(img, 0, 0, img.naturalWidth * zoom, img.naturalHeight * zoom);
    }

    // Convert to image URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setLastResult(dataUrl);
    onScan?.(dataUrl);
  };

  useEffect(() => {
    if (autoStart) {
      startScanning();
    }

    return () => {
      stopScanning();
    };
  }, [autoStart]);

  return (
    <div className={`scanner-container ${className}`}>
      <div className="scanner-wrapper" ref={wrapperRef}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="scanner-video"
          muted
          onLoadedMetadata={() => {
            if (videoRef.current && wrapperRef.current && documentRect === null) {
              // Initialize document rect to full frame
              setDocumentRect({
                x: 0,
                y: 0,
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight
              });
            }
          }}
        />
        <canvas ref={canvasRef} className="scanner-canvas" style={{ display: 'none' }} />

        <div
          className={`scanner-overlay ${allowZoom ? 'zoomable' : ''}`}
          style={{
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            cursor: isDragging ? 'grabbing' : allowZoom ? 'grab' : 'default'
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDragStart(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            handleDragMove(e);
          }}
          onTouchEnd={handleDragEnd}
        >
          {/* Document Crop Box */}
          {documentRect && allowCrop && (
            <div className="scanner-crop-box">
              <div className="crop-corner crop-tl" />
              <div className="crop-corner crop-tr" />
              <div className="crop-corner crop-bl" />
              <div className="crop-corner crop-br" />
              <div className="crop-lines">
                <div className="crop-line crop-line-h" />
                <div className="crop-line crop-line-v" />
              </div>
            </div>
          )}

          {/* Grid overlay for document scanning */}
          {mode === 'document' && (
            <div className="scanner-grid">
              <div className="grid-lines">
                <div className="grid-line grid-line-v" />
                <div className="grid-line grid-line-v" />
                <div className="grid-line grid-line-v" />
                <div className="grid-line grid-line-h" />
                <div className="grid-line grid-line-h" />
                <div className="grid-line grid-line-h" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="scanner-controls">
        {isScanning && (
          <>
            {allowZoom && (
              <div className="control-group">
                <button onClick={handleZoomOut} className="scanner-btn control-btn" title="Zoom out">
                  −
                </button>
                <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                <button onClick={handleZoomIn} className="scanner-btn control-btn" title="Zoom in">
                  +
                </button>
                <button onClick={handleReset} className="scanner-btn control-btn" title="Reset">
                  ↺
                </button>
              </div>
            )}

            {allowCrop && (
              <button onClick={() => setDocumentRect(
                documentRect
                  ? null
                  : documentRect || { x: 0, y: 0, width: 1, height: 1 }
              )} className="scanner-btn">
                {documentRect ? '取消裁剪' : '裁剪文档'}
              </button>
            )}

            <button onClick={captureDocument} className="scanner-btn scan-capture">
              拍摄文档
            </button>
            <button onClick={stopScanning} className="scanner-btn scan-stop">
              停止
            </button>
          </>
        )}
      </div>

      {lastResult && (
        <div className="scanner-result">
          <div className="result-preview">
            <img src={lastResult} alt="Captured" />
          </div>
          <div className="result-actions">
            <a href={lastResult} download={`document_${Date.now()}.jpg`} className="download-link">
              下载图片
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
