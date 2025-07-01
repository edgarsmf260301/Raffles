import React, { useState, useEffect } from 'react';
import styles from '../styles/AvailableTickets.module.css';

const AvailableTickets = ({ tickets, handleTicketClick, selectedTickets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(16); // Valor inicial para móvil

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setTicketsPerPage(25); // 5x5
      } else {
        setTicketsPerPage(16); // 4x4
      }
    };

    handleResize(); // Ejecutar al cargar la página
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(tickets.length / ticketsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  return (
    <section id="available-tickets" className={styles.availableTicketsContainer}>
      <div className={styles.availableTicketsGrid}>
        {currentTickets.map(ticket => (
          <div
            key={ticket._id}
            onClick={() => handleTicketClick(ticket)}
            className={`${styles.ticketCard} ${selectedTickets.includes(ticket) ? styles.selected : ''}`}
          >
            {ticket.ticketNumber}
          </div>
        ))}
      </div>
      <div className={styles.paginationButtons}>
        <button onClick={handlePreviousPage} disabled={currentPage <= 1} className={styles.paginationButton}>
          {"<"}
        </button>
        <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(tickets.length / ticketsPerPage)} className={styles.paginationButton}>
          {">"}
        </button>
      </div>
    </section>
  );
};

export default AvailableTickets;