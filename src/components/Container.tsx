import React, { forwardRef } from 'react';
import type { AspectRatio } from '../types';
import styles from './container.module.less';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: AspectRatio;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ aspectRatio = 'cover', ...props }, ref) => {
    return (
      <div ref={ref} className={`${styles.container} ${styles[aspectRatio as string]}`} {...props} />
    );
  }
);