import React, { useState } from 'react';
import styles from '../../styles/RegisterForm.module.css';
import ErrorMessage from './ErrorMessage';

const getPaymentMethodInfo = (paymentMethod) => {
  const whatsappNumber = '+584126557778';
  const message = `Quisiera información de los datos para realizar el pago mediante ${paymentMethod}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={styles.paymentInfoContainer}>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
        Más información del pago
      </a>
    </div>
  );
};

const PaymentMethod = ({ formData, handleChange, formErrors }) => {
  return (
    <div className={styles.formGroupFull}>
      <label className={styles.label}>Método de Pago</label>
      <div className={styles.paymentMethodContainer}>
        <label className={styles.paymentMethodOption}>
          <input
            type="radio"
            name="paymentMethod"
            value="Zelle"
            checked={formData.paymentMethod === 'Zelle'}
            onChange={handleChange}
            className={styles.hiddenRadio}
          />
          <div className={`${styles.paymentOptionImageContainer} ${formData.paymentMethod === 'Zelle' ? styles.selected : ''}`}>
            <img src="/img/payment_methods/zelle.png" alt="Zelle" className={styles.paymentOptionImage} />
            {formData.paymentMethod === 'Zelle' && <span className={styles.checkMark}>✔</span>}
          </div>
        </label>
        <label className={styles.paymentMethodOption}>
          <input
            type="radio"
            name="paymentMethod"
            value="Pago Movil"
            checked={formData.paymentMethod === 'Pago Movil'}
            onChange={handleChange}
            className={styles.hiddenRadio}
          />
          <div className={`${styles.paymentOptionImageContainer} ${formData.paymentMethod === 'Pago Movil' ? styles.selected : ''}`}>
            <img src="/img/payment_methods/pago_movil.png" alt="Pago Movil" className={styles.paymentOptionImage} />
            {formData.paymentMethod === 'Pago Movil' && <span className={styles.checkMark}>✔</span>}
          </div>
        </label>
        <label className={styles.paymentMethodOption}>
          <input
            type="radio"
            name="paymentMethod"
            value="Binance"
            checked={formData.paymentMethod === 'Binance'}
            onChange={handleChange}
            className={styles.hiddenRadio}
          />
          <div className={`${styles.paymentOptionImageContainer} ${formData.paymentMethod === 'Binance' ? styles.selected : ''}`}>
            <img src="/img/payment_methods/binance.png" alt="Binance" className={styles.paymentOptionImage} />
            {formData.paymentMethod === 'Binance' && <span className={styles.checkMark}>✔</span>}
          </div>
        </label>
        <label className={styles.paymentMethodOption}>
          <input
            type="radio"
            name="paymentMethod"
            value="Paypal"
            checked={formData.paymentMethod === 'Paypal'}
            onChange={handleChange}
            className={styles.hiddenRadio}
          />
          <div className={`${styles.paymentOptionImageContainer} ${formData.paymentMethod === 'Paypal' ? styles.selected : ''}`}>
            <img src="/img/payment_methods/paypal.png" alt="Paypal" className={styles.paymentOptionImage} />
            {formData.paymentMethod === 'Paypal' && <span className={styles.checkMark}>✔</span>}
          </div>
        </label>
        <label className={styles.paymentMethodOption}>
          <input
            type="radio"
            name="paymentMethod"
            value="Bancolombia"
            checked={formData.paymentMethod === 'Bancolombia'}
            onChange={handleChange}
            className={styles.hiddenRadio}
          />
          <div className={`${styles.paymentOptionImageContainer} ${formData.paymentMethod === 'Bancolombia' ? styles.selected : ''}`}>
            <img src="/img/payment_methods/bancolombia.png" alt="Bancolombia" className={styles.paymentOptionImage} />
            {formData.paymentMethod === 'Bancolombia' && <span className={styles.checkMark}>✔</span>}
          </div>
        </label>
      </div>
      {formErrors.paymentMethod && (
        <div className={styles.error}>
          <ErrorMessage message={formErrors.paymentMethod} />
        </div>
      )}
      <div className="mt-2 text-sm text-white">
        {formData.paymentMethod && getPaymentMethodInfo(formData.paymentMethod)}
      </div>
    </div>
  );
};

export default PaymentMethod;