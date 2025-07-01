import React, { useEffect, useState } from 'react';
import styles from '../styles/TicketQuantity.module.css';

const TicketQuantity = ({ ticketCount, handleIncrement, handleDecrement, ticketPrice }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchPercentage = async () => {
      try {
        const response = await fetch('/api/percentage');
        const data = await response.json();
        setPercentage(data.percentage);
      } catch (error) {
        console.error('Error fetching percentage:', error);
      }
    };

    fetchPercentage();
  }, []);

  return (
    <div className={styles.ticketQuantityContainer}>
      <div className={styles.percentageBarContainer}>
        <div className={styles.percentageText}>{`Vendidos ${percentage.toFixed(2)}%`}</div>
        <div className={styles.percentageBar} style={{ width: `${percentage}%` }}></div>
      </div>
      <label className={styles.ticketQuantityLabel}>Cantidad de Tickets</label>
      <div className={styles.ticketQuantityControls}>
        <button
          className={`${styles.ticketButton} ${ticketCount <= 2 ? styles.disabledButton : ''}`}
          onClick={handleDecrement}
          disabled={ticketCount <= 2}
        >
          -
        </button>
        <span className={styles.ticketCount}>{ticketCount}</span>
        <button className={styles.ticketButton} onClick={handleIncrement}>
          +
        </button>
      </div>
      <div className={styles.ticketPrice}>
        Precio total: ${ticketCount * ticketPrice}
      </div>
    </div>
  );
};

export default TicketQuantity;