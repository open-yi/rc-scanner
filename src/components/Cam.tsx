import React, { forwardRef } from 'react';
import styles from './cam.module.less';

export interface CamProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  mirrored?: boolean;
}

export const Cam = forwardRef<HTMLVideoElement, CamProps>(
  ({ mirrored = false, ...props }, ref) => {
    return <video ref={ref} className={`${styles.cam} ${mirrored ? styles.mirrored : ''}`} {...props} />;
  }
);