import React from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/LogoutButton.module.css';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className={styles.button}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;