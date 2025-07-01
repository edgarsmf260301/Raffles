import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/RegisterForm.module.css'; 
import PhoneNumberField from './components_RegisterForm.js/PhoneNumberField';
import PaymentMethod from './components_RegisterForm.js/PaymentMethod';
import SuccessMessage from './components_RegisterForm.js/SuccessMessage';
import sendToWhatsapp from './components_RegisterForm.js/sendToWhatsapp';
import StateSelect from './components_RegisterForm.js/StateSelect';
import FormGroup from './components_RegisterForm.js/FormGroup';
import PaymentProof from './components_RegisterForm.js/PaymentProof';
import ErrorMessage, { validateForm, validateField, handleFormErrors, isFormValid } from './components_RegisterForm.js/ErrorMessage';

const RegisterForm = ({ selectedTickets, ticketQuantity, totalPrice, formErrors, setFormErrors, resetTickets }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    state: '',
    paymentMethod: '',
    phoneCode: '+58',
  });
  const [sendToWhatsApp, setSendToWhatsApp] = useState(false);
  const [imgBuy, setImgBuy] = useState(null);
  const [fileName, setFileName] = useState(''); // Nuevo estado para almacenar el nombre del archivo
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    const fieldErrors = validateField(name, value, formData, imgBuy);
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors, ...fieldErrors };
      if (!fieldErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErrors = validateField(name, value, formData, imgBuy);
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors, ...fieldErrors };
      if (!fieldErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleStateChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData({
      ...formData,
      state: value,
    });
    const fieldErrors = validateField('state', value, formData, imgBuy);
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors, ...fieldErrors };
      if (!fieldErrors.state) {
        delete newErrors.state;
      }
      return newErrors;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImgBuy(file);
    setFileName(file.name); // Actualizar el nombre del archivo cargado
    const fieldErrors = validateField('imgBuy', file, formData, file);
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors, ...fieldErrors };
      if (!fieldErrors.imgBuy) {
        delete newErrors.imgBuy;
      }
      return newErrors;
    });
  };

  const submitFormData = async (formDataToSubmit) => {
    try {
      const response = await axios.post('/api/customers', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form submitted successfully:', response.data);
      setSuccessMessage('Su registro ha sido enviado exitosamente,se estarán comunicando con usted mediante su número de teléfono. Gracias por participar');
      setFormData({
        id: '',
        name: '',
        phone: '',
        state: '',
        paymentMethod: '',
        phoneCode: '',
      });
      setImgBuy(null);
      setFileName(''); // Resetear el nombre del archivo
      setSendToWhatsApp(false);
      resetTickets();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateForm(formData, selectedTickets, ticketQuantity, sendToWhatsApp, imgBuy);
    if (!isFormValid(errors)) {
      handleFormErrors(errors, setFormErrors);
      setIsSubmitting(false);
      return;
    }

    if (sendToWhatsApp) {
      sendToWhatsapp(formData, selectedTickets, totalPrice);
      setIsSubmitting(false);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('id', formData.id);
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('phone', `${formData.phoneCode}${formData.phone}`);
    formDataToSubmit.append('state', formData.state);
    formDataToSubmit.append('paymentMethod', formData.paymentMethod);
    formDataToSubmit.append('selectedTickets', JSON.stringify(selectedTickets));
    formDataToSubmit.append('totalPrice', totalPrice);
    formDataToSubmit.append('sendToWhatsApp', sendToWhatsApp);
    formDataToSubmit.append('registerTime', new Date().toLocaleString('es-ES', { timeZone: 'America/Caracas' }));
    if (imgBuy) {
      formDataToSubmit.append('imgbuy', imgBuy);
    }

    submitFormData(formDataToSubmit);
  };

  return (
    <section id="register" className={styles.registerSection}>
      <h1 className={styles.title}>Registro</h1>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form} noValidate>
          <div className={styles.formGroupRow}>
            <FormGroup label="Cédula" error={formErrors.id}>
              <input 
                type="text" 
                name="id" 
                placeholder="Cédula" 
                value={formData.id} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={styles.inputField} 
              />
            </FormGroup>
            <FormGroup label="Nombre y Apellido" error={formErrors.name}>
              <input 
                type="text" 
                name="name" 
                placeholder="Nombre y Apellido" 
                value={formData.name} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={styles.inputField} 
              />
            </FormGroup>
          </div>
          <div className={styles.formGroupRow}>
            <StateSelect
              value={formData.state}
              onChange={handleStateChange}
              error={formErrors.state}
            />
            <div className={styles.formGroup}>
              <PhoneNumberField formData={formData} handleChange={handleChange} handleBlur={handleBlur} formErrors={formErrors} />
            </div>
          </div>
          <PaymentMethod formData={formData} handleChange={handleChange} handleBlur={handleBlur} formErrors={formErrors} />
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="sendToWhatsApp" 
                checked={sendToWhatsApp} 
                onChange={(e) => setSendToWhatsApp(e.target.checked)} 
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxText}>Enviar comprobante de pago a WhatsApp</span>
            </label>
          </div>
          {!sendToWhatsApp && (
            <PaymentProof 
              formErrors={formErrors} 
              handleFileChange={handleFileChange} 
              fileName={fileName} 
              sendToWhatsApp={sendToWhatsApp} 
            />
          )}
          {!isSubmitted && (
            <>
              <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
              {formErrors.ticketQuantity && (
                <div className={styles.error}>
                  <ErrorMessage message={formErrors.ticketQuantity} />
                </div>
              )}
            </>
          )}
        </form>
        <SuccessMessage successMessage={successMessage} />
      </div>
    </section>
  );
};

export default RegisterForm;