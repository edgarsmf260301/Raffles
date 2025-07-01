import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/NavbarWinners.module.css'; // Importar el archivo CSS Module

const NavbarWinners = ({ isNavbarVisible }) => {
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
        <ul className="flex justify-center items-center flex-1">
          <li className={styles.navbarItem}>
            <Link href="/" legacyBehavior>
              <a className={`${styles.navbarLink}`} onClick={() => {}}>Inicio</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarWinners;