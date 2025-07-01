import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Loading.module.css';

const Loading = ({ isVisible }) => {
  return (
    <div className={`${styles.loadingContainer} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.logoContainer}>
        <Image
          src="/img/A-&-M-Recreaciones-Logotipo.png"
          alt="Logo"
          layout="intrinsic"
          width={300}
          height={300}
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default Loading;