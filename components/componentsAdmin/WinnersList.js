import React from 'react';
import styles from '../../styles/Admin.module.css';

const WinnersList = ({ winners, onDelete }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Premio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {winners.map(winner => (
          <tr key={winner._id}>
            <td>{winner.ticket}</td>
            <td>{winner.customerName}</td>
            <td>
              <a href={`https://wa.me/${winner.customerPhone}`} target="_blank" rel="noopener noreferrer">
                {winner.customerPhone}
              </a>
            </td>
            <td>{winner.prize}</td>
            <td>
              <button onClick={() => onDelete(winner._id)} className={styles.button}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WinnersList;