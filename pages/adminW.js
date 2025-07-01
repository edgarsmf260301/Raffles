import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Admin.module.css';
import WinnersList from '../components/componentsAdmin/WinnersList';
import ProtectedRoute from '../components/componentsAdmin/ProtectedRoute';
import Sidebar from '../components/componentsAdmin/Sidebar';
import LogoutButton from '../components/componentsAdmin/LogoutButton';

const AdminW = () => {
  const [token, setToken] = useState('');
  const [winners, setWinners] = useState([]);
  const [approvedTickets, setApprovedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [prize, setPrize] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [winnerToDelete, setWinnerToDelete] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    id: '',
    name: '',
    paymentMethod: '',
    tickets: '',
    totalPrice: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        router.push('/error');
        return;
      }
      setToken(storedToken);
    };

    fetchToken();
  }, [router]);

  useEffect(() => {
    const fetchWinners = async () => {
      if (!token) return;

      try {
        const response = await axios.get('/api/getWinners', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWinners(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/error');
        } else {
          setError('Failed to fetch winners');
        }
      }
    };

    fetchWinners();
  }, [token, router]);

  useEffect(() => {
    const fetchApprovedTickets = async () => {
      if (!token) return;

      try {
        const response = await axios.get('/api/approvedTickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApprovedTickets(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/error');
        } else {
          setError('Failed to fetch approved tickets');
        }
      }
    };

    fetchApprovedTickets();
  }, [token, router]);

  const handleTicketChange = async (e) => {
    const ticketId = e.target.value;
    setSelectedTicket(ticketId);

    try {
      const response = await axios.get(`/api/getCustomerByTicket?ticketId=${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const customer = response.data.find(c => c.selectedTickets.includes(ticketId));
      setSelectedCustomer(customer);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        router.push('/error');
      } else {
        setError('Failed to fetch customer');
      }
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddWinner = async () => {
    if (!selectedTicket || !selectedCustomer || !prize || !image) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('ticket', selectedTicket);
    formData.append('customerName', selectedCustomer.name);
    formData.append('customerId', selectedCustomer.id);
    formData.append('customerPhone', selectedCustomer.phone);
    formData.append('customerState', selectedCustomer.state);
    formData.append('prize', prize);
    formData.append('image', image);

    try {
      await axios.post('/api/adminUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      setShowModal(false);
      window.location.reload(); // Refrescar la página después de agregar un nuevo ganador
    } catch (error) {
      if (error.response && error.response.status === 401) {
        router.push('/error');
      } else {
        setError('Failed to add winner');
      }
    }
  };

  const handleDeleteWinner = async () => {
    if (!winnerToDelete) return;

    try {
      await axios.delete(`/api/deleteWinner?id=${winnerToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setWinnerToDelete(null);
      window.location.reload(); // Refrescar la página después de eliminar un ganador
    } catch (error) {
      if (error.response && error.response.status === 401) {
        router.push('/error');
      } else {
        setError('Failed to delete winner');
      }
    }
  };

  const confirmDeleteWinner = (winnerId) => {
    setWinnerToDelete(winnerId);
    setShowDeleteModal(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    // Implement filter logic here
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Sidebar filters={filters} handleFilterChange={handleFilterChange} applyFilters={applyFilters} showFilterButton={false}>
          <button className={styles.navButton} onClick={() => router.push('/admin')}>
            Solicitudes
          </button>
          <button className={styles.navButton} onClick={() => router.push('/adminA')}>
            Aprobadas
          </button>
          <button className={styles.navButton} onClick={() => router.push('/adminR')}>
            Rechazadas
          </button>
        </Sidebar>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Ganadores</h2>
            <LogoutButton />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {token && (
            <button onClick={() => setShowModal(true)} className={styles.button}>Agregar Ganador</button>
          )}
          <WinnersList winners={winners} onDelete={confirmDeleteWinner} />

          {showModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2 className={styles.title}>Agregar Nuevo Ganador</h2>
                <label className={styles.modalText}>
                  Ticket:
                  <select value={selectedTicket} onChange={handleTicketChange} className={styles.select}>
                    <option value="">Seleccione un ticket</option>
                    {approvedTickets.map(ticket => (
                      <option key={ticket._id} value={ticket._id}>{ticket.ticketNumber}</option>
                    ))}
                  </select>
                </label>

                {selectedCustomer && (
                  <div className={styles.customerInfo}>
                    <p className={styles.modalText}><strong>Nombre:</strong> {selectedCustomer.name}</p>
                    <p className={styles.modalText}><strong>ID:</strong> {selectedCustomer.id}</p>
                    <p className={styles.modalText}><strong>Teléfono:</strong> {selectedCustomer.phone}</p>
                    <p className={styles.modalText}><strong>Estado:</strong> {selectedCustomer.state}</p>
                  </div>
                )}

                <label className={styles.modalText}>
                  Premio:
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    className={`${styles.input} ${styles.prizeInput}`}
                    pattern="[A-Za-z\s]*"
                  />
                </label>

                <label className={styles.modalText}>
                  Imagen:
                  <input type="file" onChange={handleImageChange} className={styles.fileInput} />
                </label>

                <div className={styles.buttonContainer}>
                  <button onClick={handleAddWinner} className={styles.button}>Guardar Nuevo Campeón</button>
                  <button onClick={() => setShowModal(false)} className={styles.button}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2 className={styles.title}>Confirmar Eliminación</h2>
                <p>¿Está seguro que desea eliminar este ganador?</p>
                <div className={styles.buttonContainer}>
                  <button onClick={handleDeleteWinner} className={styles.button}>Sí</button>
                  <button onClick={() => setShowDeleteModal(false)} className={styles.button}>No</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminW;