import React from 'react';
import styles from '../../styles/ErrorMessage.module.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.errorBubble}>
      {message}
    </div>
  );
};

export const validateField = (name, value, formData, imgBuy) => {
  const errors = {};
  switch (name) {
    case 'id':
      if (!value) {
        errors.id = 'Por favor, ingrese una cédula.';
      } else if (!/^\d{8}$/.test(value)) {
        errors.id = 'La cédula debe tener 8 dígitos y solo números.';
      }
      break;
    case 'name':
      if (!value) {
        errors.name = 'Por favor, ingrese un nombre y apellido.';
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        errors.name = 'El nombre y apellido debe tener solo letras y espacios en blanco.';
      }
      break;
    case 'phone':
      if (!value) {
        errors.phone = 'Por favor, ingrese su número de teléfono.';
      } else if (!/^\d+$/.test(value)) {
        errors.phone = 'El número de teléfono debe contener solo dígitos.';
      }
      break;
    case 'state':
      if (!value) {
        errors.state = 'Por favor, seleccione un estado.';
      }
      break;
    case 'paymentMethod':
      if (!value) {
        errors.paymentMethod = 'Por favor, seleccione un método de pago.';
      }
      break;
    case 'imgBuy':
      if (imgBuy && imgBuy.size > 2 * 1024 * 1024) {
        errors.imgBuy = 'El comprobante de pago no debe exceder los 2MB.';
      } else if (imgBuy && !['image/jpeg', 'image/png', 'image/gif'].includes(imgBuy.type)) {
        errors.imgBuy = 'El comprobante de pago debe ser una imagen (JPEG, PNG, GIF).';
      }
      break;
    default:
      break;
  }
  return errors;
};

export const validateForm = (formData, selectedTickets, ticketQuantity, sendToWhatsApp, imgBuy) => {
  const errors = {};
  Object.keys(formData).forEach((field) => {
    const fieldErrors = validateField(field, formData[field], formData, imgBuy);
    Object.assign(errors, fieldErrors);
  });
  if (selectedTickets.length === 0) {
    errors.selectedTickets = 'Debe seleccionar al menos un ticket.';
  }
  if (selectedTickets.length !== ticketQuantity) {
    errors.ticketQuantity = 'La cantidad de tickets seleccionados no coincide con la cantidad de tickets.';
  }
  if (!sendToWhatsApp && !imgBuy) {
    errors.imgBuy = 'Por favor, suba un comprobante de pago válido.';
  }
  return errors;
};

export const handleFormErrors = (errors, setFormErrors) => {
  setFormErrors(errors);
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

export default ErrorMessage;