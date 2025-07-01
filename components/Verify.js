import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Verify.module.css';

const Verify = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setError(null); 
      console.log(`Searching for cedula: ${searchTerm}`);
      const response = await axios.get(`/api/verifyCustomer?cedula=${searchTerm}&status=Aprobado`);
      console.log('Response from verifyCustomer:', response.data);
      if (response.data.length > 0) {
        const allTicketIds = response.data.flatMap(customer => customer.selectedTickets);
        console.log('All ticket IDs:', allTicketIds);
        const ticketDetailsResponse = await axios.post('/api/getTickets', { ticketIds: allTicketIds });
        console.log('Response from getTickets:', ticketDetailsResponse.data);
        const ticketNumbers = ticketDetailsResponse.data.map(ticket => ticket.ticketNumber);
        setTicketNumbers(ticketNumbers);
      } else {
        setTicketNumbers([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
  };

  return (
    <section id="verify" className={styles.verify}>
      <h1>Verificar Tickets</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="ingrese su número de cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Buscar</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {ticketNumbers.length > 0 && (
        <div className={styles.customerInfo}>
          <p>Tus Tickets son los siguientes:</p>
          <div className={styles.tickets}>
            {ticketNumbers.map((ticketNumber, index) => (
              <div key={index} className={styles.ticket}>
                {ticketNumber}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Verify;