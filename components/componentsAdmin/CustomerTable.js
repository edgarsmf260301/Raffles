import React, { useState } from 'react';
import styles from '../../styles/Admin.module.css';

const CustomerTable = ({ customers, ticketNumbers, handleVerify, buttonText, showPhone }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>ID</th>
            <th>Nombre</th>
            {showPhone && <th>Teléfono</th>}
            <th>Método de Pago</th>
            <th>Tickets</th>
            <th>Total Pagado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map(customer => (
            <tr key={customer._id}>
              <td>{customer.registerTime.split(',')[0]}</td>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              {showPhone && (
                <td>
                  <a href={`https://wa.me/${customer.phone}`} target="_blank" rel="noopener noreferrer">
                    {customer.phone}
                  </a>
                </td>
              )}
              <td>{customer.paymentMethod}</td>
              <td>{customer.selectedTickets.map(ticketId => ticketNumbers[ticketId]).join(', ')}</td>
              <td>{customer.totalPrice}</td>
              <td>
                <button onClick={() => handleVerify(customer)} className={styles.button}>
                  {buttonText}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className={styles.paginationButton}>
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.paginationButton}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CustomerTable;