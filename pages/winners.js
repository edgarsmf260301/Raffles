import { useEffect, useState } from 'react';
import NavbarWinners from '../components/NavbarWinners';
import styles from '../styles/Winners.module.css';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [activeWinner, setActiveWinner] = useState(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('/api/getWinnersCard');
        const data = await response.json();
        if (Array.isArray(data)) {
          setWinners(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching winners:', error);
      }
    };

    fetchWinners();
  }, []);

  const handleCardClick = (winnerId) => {
    setActiveWinner(activeWinner === winnerId ? null : winnerId);
  };

  return (
    <div>
      <NavbarWinners isNavbarVisible={true} />
      <div className={styles.container}>
        <h1 className={styles.title}>Ganadores</h1>
        <div className={styles.winnersGrid}>
          {Array.isArray(winners) && winners.map(winner => (
            <div
              key={winner._id}
              className={`${styles.winnerCard} ${activeWinner === winner._id ? styles.active : ''}`}
              onClick={() => handleCardClick(winner._id)}
            >
              <img src={winner.image} alt="Winner" className={styles.winnerImage} />
              <div className={styles.winnerDetailsBubble}>
                <p>Ticket: {winner.ticket}</p>
                <p>Nombre: {winner.customerName}</p>
                <p>Estado: {winner.customerState}</p>
                <p>Premio: {winner.prize}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Winners;