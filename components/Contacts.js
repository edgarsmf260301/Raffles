import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import styles from '../styles/Contacts.module.css';

const Contacts = () => {
  return (
    <>
      <h1 className={styles.title}>Contactos</h1>
      <section id="contacts" className={styles.contactsSection}>
        <ul className={styles.socialList}>
          <li className={styles.socialItem}>
            <a href="https://www.tiktok.com/@angelcolina.oficial?_t=8pVAMqzK0O6&_r=1" className={styles.socialLink}>
              <img src="/img/socialNetworks/tiktok.svg" alt="TikTok" className={styles.icon} /> Angel Colina
            </a>
          </li>
          <li className={styles.socialItem}>
            <a href="https://www.instagram.com/angel.colina7?igsh=MWw4dmFrZzJnMTdsbw==" className={styles.socialLink}>
              <img src="/img/socialNetworks/instagram.svg" alt="Instagram" className={styles.icon} /> Angel Colina
            </a>
          </li>
          <li className={styles.socialItem}>
            <a href="https://wa.me/+584126557778" className={styles.contactLink}>
              <FaWhatsapp className={`${styles.icon} ${styles['icon-whatsapp']}`} /> +58 412 6557778
            </a>
          </li>
          <li className={styles.socialItem}>
            <a href="mailto:rifasvam@gmail.com" className={styles.contactLink}>
              <img src="/img/socialNetworks/gmail.svg" alt="Gmail" className={styles.icon} /> rifasvam@gmail.com
            </a>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Contacts;