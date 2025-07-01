import React from 'react';
import styles from '../styles/SelectedTickets.module.css';

const SelectedTickets = ({ selectedTickets }) => {
  return (
    <section id="selected-tickets" className={styles.selectedTicketsContainer}>
      <div className={styles.selectedTicketsGrid}>
        {selectedTickets.map(ticket => (
          <div
            key={ticket._id}
            className={styles.ticketCard}
          >
            {ticket.ticketNumber}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SelectedTickets;