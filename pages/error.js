import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Error.module.css';

const ErrorPage = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Acceso Denegado</h1>
      <p className={styles.message}>Debe iniciar sesión para acceder a esta página.</p>
    </div>
  );
};

export default ErrorPage;