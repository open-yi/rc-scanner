import React, { forwardRef } from 'react';
import styles from './rect-canvas.module.less';

export interface RectCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
}

export const RectCanvas = forwardRef<HTMLCanvasElement, RectCanvasProps>(
  ({ className, style, ...props }, ref) => {
    return <canvas ref={ref} className={`${styles.rectCanvas} ${className || ''}`} style={style} {...props} />;
  }
);