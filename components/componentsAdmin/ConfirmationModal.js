import React from 'react';
import styles from '../../styles/Admin.module.css';

const ConfirmationModal = ({ handleCloseConfirmationModal, handleNotifyCustomer }) => {
  return (
    <div className={styles.modal}>
      <h2 className={styles.title}>¿Desea notificarle al Cliente?</h2>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={() => handleNotifyCustomer(true)}>Sí</button>
        <button className={styles.button} onClick={() => handleNotifyCustomer(false)}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;