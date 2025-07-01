import React from 'react';
import styles from '../styles/TicketSearch.module.css';

const TicketSearch = ({ searchTerm, handleSearch, handleRandomSelection }) => {
  return (
    <section id="ticket-search" className={styles.ticketSearchContainer}>
      <input
        type="text"
        placeholder="Buscar ticket"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.ticketSearchInput}
      />
      <button onClick={handleRandomSelection} className={styles.ticketSearchButton}>
        Probar suerte
      </button>
    </section>
  );
};

export default TicketSearch;