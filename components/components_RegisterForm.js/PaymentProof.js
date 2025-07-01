import React from 'react';
import styles from '../../styles/RegisterForm.module.css';
import FormGroup from './FormGroup';
import ErrorMessage from './ErrorMessage';

const PaymentProof = ({ formErrors, handleFileChange, fileName, sendToWhatsApp }) => {
  return (
    <FormGroup 
      label={<span className={styles.centeredLabel}>Subir comprobante de pago</span>} 
      error={formErrors.imgBuy} 
      className={sendToWhatsApp ? styles.hidden : ''}
    >
      <div className={styles.fileInputContainer}>
        <input 
          type="file" 
          name="imgBuy" 
          accept="image/jpeg, image/png, image/gif" 
          onChange={handleFileChange} 
          className={styles.fileInput} 
          id="fileInput"
        />
        <label htmlFor="fileInput" className={styles.customFileButton}>
          {fileName ? 'Archivo seleccionado' : 'Seleccionar archivo'}
        </label>
      </div>
    </FormGroup>
  );
};

export default PaymentProof;