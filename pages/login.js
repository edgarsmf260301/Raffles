import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from '../styles/Login.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.data.success) {
        setToken(response.data.token);
        setStep(2);
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleAuthCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/validateAuthCode', { token, authCode });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        Cookies.set('token', response.data.token);
        router.push('/admin');
      } else {
        setError('Invalid authorization code');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {step === 1 ? (
        <form onSubmit={handleLogin} className={styles.form}>
          <h2 className={styles.title}>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.button}>Login</button>
        </form>
      ) : (
        <form onSubmit={handleAuthCode} className={styles.form}>
          <h2 className={styles.title}>Enter Authorization Code</h2>
          {error && <p className={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder="Authorization Code"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;