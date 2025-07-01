import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import RegisterForm from '../components/RegisterForm';
import TicketQuantity from '../components/TicketQuantity';
import TicketSearch from '../components/TicketSearch';
import AvailableTickets from '../components/AvailableTickets';
import SelectedTickets from '../components/SelectedTickets';
import Contacts from '../components/Contacts';
import Verify from '../components/Verify';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const ticketPrice = 2;
  const router = useRouter();

  const images = [
    '/img/prize/premio.webp',
    '/img/prize/premio2.webp',
    '/img/prize/premio3.webp'
  ];

  useEffect(() => {
    axios.get('/api/tickets')
      .then(response => {
        setTickets(response.data.data);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedTickets.length > ticketCount) {
      setSelectedTickets(selectedTickets.slice(0, ticketCount));
    }
  }, [ticketCount]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === '/') {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3200); // 2200ms + 1000ms for fading

    return () => clearInterval(interval);
  }, [images.length]);

  const handleIncrement = () => {
    if (ticketCount < tickets.length) {
      setTicketCount(ticketCount + 1);
    }
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRandomSelection = () => {
    const shuffled = [...tickets].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, ticketCount);
    setSelectedTickets(selected);
  };

  const handleTicketClick = (ticket) => {
    if (selectedTickets.includes(ticket)) {
      setSelectedTickets(selectedTickets.filter(t => t !== ticket));
    } else if (selectedTickets.length < ticketCount) {
      setSelectedTickets([...selectedTickets, ticket]);
    }
  };

  const resetTickets = () => {
    setTicketCount(1);
    setSelectedTickets([]);
  };

  const filteredTickets = tickets
    .filter(ticket => ticket.ticketNumber.toString().includes(searchTerm))
    .sort((a, b) => a.ticketNumber - b.ticketNumber);

  if (isLoading) {
    return <Loading isVisible={isLoading} />;
  }

  return (
    <>
      <Navbar isNavbarVisible={isNavbarVisible} />
      <main className="flex justify-center items-center min-h-screen">
        <div className={styles.container}>
          <section id="home" className={`${styles.section} ${styles.premioContainer}`}>
            <div className={styles.premioContainer} style={{ position: 'relative' }}>
              <div className={styles.dateTimeContainer}>
                <div className={styles.dateTime}>
                  <FontAwesomeIcon icon={faCalendarAlt} className={styles.dateTimeIcon} />
                  <p>02/09/2024</p>
                </div>
                <div className={styles.dateTime}>
                  <FontAwesomeIcon icon={faClock} className={styles.dateTimeIcon} />
                  <p>18:00 PM</p>
                </div>
              </div>
              <div className={styles.imageWrapper}>
                <AnimatePresence>
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Image
                      src={images[currentImageIndex]}
                      alt="Premio"
                      className={styles.premioImage}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className={styles.premioText}>
                <h1 className={styles.premio}>1. Lamborghini Gallardo</h1>
                <h2 className={styles.subPremio}>2. Yamaha R1</h2>
                <h3 className={styles.subPremio2}>3. 200$</h3>
                <div className={styles.largeText}>
                  <p>No pierdas la increible oportunidad de participar para ganar estos increibles premios</p>
                  <p>Precio por ticket: ${ticketPrice}</p>
                  <p>Debes adquirir por lo menos 2 ticket</p>
                  <p>18:00PM por la lotería de Maracaibo Premio mayor</p>
                  <p>Fecha del evento el dia 02 de septiembre del 2024</p>
                </div>
              </div>
            </div>
          </section>

          <TicketQuantity
            ticketCount={ticketCount}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            ticketPrice={ticketPrice}
          />

          <TicketSearch
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            handleRandomSelection={handleRandomSelection}
          />

          <AvailableTickets
            tickets={filteredTickets}
            handleTicketClick={handleTicketClick}
            selectedTickets={selectedTickets}
          />

          <SelectedTickets selectedTickets={selectedTickets} />

          <RegisterForm
            selectedTickets={selectedTickets}
            ticketQuantity={ticketCount}
            totalPrice={ticketCount * ticketPrice}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            resetTickets={resetTickets}
          />

          <Verify />

          <Contacts />
        </div>
      </main>
    </>
  );
};

export default Home;