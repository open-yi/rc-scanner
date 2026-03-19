import React from 'react';
import styles from './wrapper.module.less';

export const Wrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return <div className={styles.wrapper} {...props} />;
};