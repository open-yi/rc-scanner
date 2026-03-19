import React, { useEffect, useRef } from 'react';
import styles from './scaning.module.less';

interface ScanningData {
  pic?: string;
  text?: string;
}

interface ScaningProps {
  scanning?: ScanningData;
  onClick?: () => void;
}

const Scaning: React.FC<ScaningProps> = ({ scanning, onClick }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current!;
    const progress = progressRef.current!;
    const container = containerRef.current!;

    const restart = () => {
      container.classList.add(styles.scannerWrapper, styles.scanner);
      line.style.animation = `scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite`;
      progress.style.animation = `progress 3s cubic-bezier(0.4, 0, 0.2, 1) infinite`;
    };

    const onEnd = () => {
      container.classList.remove(styles.scanner);
      // 使用 requestAnimationFrame 来确保动画重启时不会阻塞主线程
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          restart();
        });
      });
    };

    line.addEventListener('animationend', onEnd);

    // 初始启动动画
    restart();

    return () => {
      line.removeEventListener('animationend', onEnd);
    };
  }, []);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1011,
        }}
        onClick={onClick}
      >
        <div className={styles.scannerWrapper} ref={containerRef}>
          <div className={styles.scanProgress} ref={progressRef} />
          <div className={styles.scanLine} ref={lineRef} />

          {!scanning?.pic && (
            <div className={styles.docImage}>
              <div
                className={styles.paper}
                style={
                  window.innerWidth > window.innerHeight
                    ? { maxWidth: 'calc(90svw / 2)' }
                    : {}
                }
              >
                {/* Doc preview lines */}
                {[...Array(8)].map((_, index) => (
                  <div key={index} className={styles.line}>
                    {[...Array(6)].map((_, lineIndex) => (
                      <div
                        key={lineIndex}
                        className={`${styles.word} ${
                          lineIndex === 0
                            ? styles.long
                            : lineIndex === 1 || lineIndex === 3
                            ? styles.mid
                            : styles.short
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {scanning?.text && (
            <h3 className={styles.info}>
              <span>{scanning.text}</span>
            </h3>
          )}

          {scanning?.pic && (
            <div className={styles.docImage}>
              <img src={scanning.pic} alt="Scanning preview" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Scaning;