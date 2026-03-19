import React from 'react';
import styles from './error-msg.module.less';

export const ErrorMsg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.errorMsg}>{children}</div>;
};