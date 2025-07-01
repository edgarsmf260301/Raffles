import React from 'react';
import styles from '../../styles/Sidebar.module.css';

const FilterForm = ({ filters, handleFilterChange, applyFilters }) => {
  return (
    <div className={styles.filterForm}>
      <input
        type="date"
        name="date"
        placeholder="Fecha"
        value={filters.date || ''}
        onChange={handleFilterChange}
        className={`${styles.input} ${styles.dateInput}`} // Apply both input and dateInput classes
      />
      <input
        type="text"
        name="id"
        placeholder="Cedula"
        value={filters.id || ''}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={filters.name || ''}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <input
        type="text"
        name="paymentMethod"
        placeholder="Método de Pago"
        value={filters.paymentMethod || ''}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <input
        type="number"
        name="tickets"
        placeholder="Tickets"
        value={filters.tickets || ''}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <input
        type="number"
        name="totalPrice"
        placeholder="Total Pagado"
        value={filters.totalPrice || ''}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <button className={styles.button} onClick={applyFilters}>
        Aplicar Filtros
      </button>
    </div>
  );
};

export default FilterForm;