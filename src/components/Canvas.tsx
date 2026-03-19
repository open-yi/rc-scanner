import React, { forwardRef } from 'react';
import styles from './canvas.module.less';

export const Canvas = forwardRef<HTMLCanvasElement, { children?: React.ReactNode } & React.HTMLAttributes<HTMLCanvasElement>>(
  ({ children, ...props }, ref) => {
    return <canvas ref={ref} className={styles.canvas} {...props}>{children}</canvas>;
  }
);