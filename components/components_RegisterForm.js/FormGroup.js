import React from 'react';
import styles from '../../styles/RegisterForm.module.css';

const FormGroup = ({ label, children, error }) => (
  <div className={styles.formGroup}>
    <label className={styles.label}>{label}</label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormGroup;