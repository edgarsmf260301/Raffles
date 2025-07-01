import React, { useState } from 'react';
import styles from '../../styles/Admin.module.css';

const CustomerModal = ({ selectedCustomer, ticketNumbers, status, setStatus, handleStatusChange, handleCloseModal, handleViewImage, ticketError, statusOptions, handleOpenConfirmationModal }) => {
  const [updateError, setUpdateError] = useState('');

  const handleSaveChanges = async () => {
    try {
      await handleStatusChange();
      setUpdateError('');
      handleOpenConfirmationModal(); // Abrir la ventana de confirmación después de guardar los cambios
    } catch (error) {
      setUpdateError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={styles.modal}>
      <h2 className={styles.title}>Datos de la confirmación de pago</h2>
      <p className={styles.modalText}><strong>Nombre y Apellido:</strong> {selectedCustomer.name}</p>
      <p className={styles.modalText}><strong>Número de Teléfono:</strong> {selectedCustomer.phone}</p>
      <p className={styles.modalText}><strong>Ubicación:</strong> {selectedCustomer.state}</p>
      <p className={styles.modalText}><strong>Método de Pago:</strong> {selectedCustomer.paymentMethod}</p>
      <p className={styles.modalText}><strong>Tickets:</strong> {selectedCustomer.selectedTickets.map(ticketId => ticketNumbers[ticketId] || ticketId).join(', ')}</p>
      <p className={styles.modalText}><strong>Total Pagado:</strong> {selectedCustomer.totalPrice}</p>
      <p className={styles.centered}><a className={styles.viewReceiptButton} href="#" onClick={() => handleViewImage(selectedCustomer.imgBuy)}>Ver Comprobante de Pago</a></p>
      <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Seleccione un estado</option>
        {statusOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {ticketError && <p className={styles.error}>{ticketError}</p>}
      {status && (
        <button className={styles.button} onClick={handleSaveChanges}>Guardar Cambios</button>
      )}
      <button className={styles.button} onClick={handleCloseModal}>Cerrar</button>
      {updateError && <p className={styles.error}>{updateError}</p>}
    </div>
  );
};

export default CustomerModal;