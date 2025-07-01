import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Navbar.module.css'; // Importar el archivo CSS Module

const Navbar = ({ isNavbarVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${isNavbarVisible ? styles.navbarVisible : styles.navbarHidden}`}>
      <div className="flex justify-between items-center w-full">
        <div className={styles.navbarLogo}>
          <Link href="/" legacyBehavior>
            <a>
              <Image 
                src="/img/A-&-M-Recreaciones-imagotipo.png" 
                alt="Logo" 
                width={200} 
                height={800} 
                className="rounded-full drop-shadow-red" 
              />
            </a>
          </Link>
        </div>
        <div className={styles.hamburger} onClick={toggleMenu}>
          <svg className={styles.hamburgerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </div>
      </div>
      <ul className={`${isMenuOpen ? styles.navbarListMobile : 'hidden'} md:flex md:justify-between lg:justify-between w-full`}>
        <li className={styles.navbarItem}>
          <Link href="#home" legacyBehavior>
            <a className={`${styles.navbarLink} ${styles.navbarLinkHover}`} onClick={handleLinkClick}>Inicio</a>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="#register" legacyBehavior>
            <a className={`${styles.navbarLink} ${styles.navbarLinkHover}`} onClick={handleLinkClick}>Registrate</a>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="#contacts" legacyBehavior>
            <a className={`${styles.navbarLink} ${styles.navbarLinkHover}`} onClick={handleLinkClick}>Contactos</a>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="#verify" legacyBehavior>
            <a className={`${styles.navbarLink} ${styles.navbarLinkHover}`} onClick={handleLinkClick}>Verificación</a>
          </Link>
        </li>
        <li className={`${styles.navbarItem} lg:mr-5`}>
          <Link href="/winners" legacyBehavior>
            <a className={`${styles.navbarLink} ${styles.navbarLinkWinners} ${styles.navbarLinkWinnersHover}`} onClick={handleLinkClick}>Ganadores</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;