import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Admin.module.css';
import CustomerTable from '../components/componentsAdmin/CustomerTable';
import CustomerModal from '../components/componentsAdmin/CustomerModal';
import ConfirmationModal from '../components/componentsAdmin/ConfirmationModal';
import Sidebar from '../components/componentsAdmin/Sidebar';
import ProtectedRoute from '../components/componentsAdmin/ProtectedRoute';
import LogoutButton from '../components/componentsAdmin/LogoutButton';

const Admin = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [status, setStatus] = useState('');
  const [ticketNumbers, setTicketNumbers] = useState({});
  const [ticketError, setTicketError] = useState('');
  const [token, setToken] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    id: '',
    name: '',
    paymentMethod: '',
    tickets: '',
    totalPrice: ''
  });
  const [message, setMessage] = useState(''); 
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
    const fetchCustomers = async () => {
      if (!token) return;

      try {
        const response = await axios.get('/api/customersAdmin?status=Procesando', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/error');
        } else {
          setError('Failed to fetch customers');
        }
      }
    };

    fetchCustomers();
  }, [token, router]);

  useEffect(() => {
    const fetchTicketNumbers = async () => {
      if (!token) return;

      try {
        const ticketIds = customers.flatMap(customer => customer.selectedTickets);
        if (ticketIds.length === 0) {
          throw new Error('No ticket IDs found');
        }
        const response = await axios.post('/api/ticketsadmin', { ticketIds }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const tickets = response.data.data;
        const ticketMap = tickets.reduce((acc, ticket) => {
          acc[ticket._id] = ticket.ticketNumber;
          return acc;
        }, {});
        setTicketNumbers(ticketMap);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/error');
        } else {
          setError(`Failed to fetch ticket numbers: ${error.message}`);
        }
      }
    };

    if (customers.length > 0) {
      fetchTicketNumbers();
    }
  }, [customers, token, router]);

  const handleStatusChange = async () => {
    if (!status) return;

    try {
      const response = await axios.put(`/api/customersAdmin?id=${selectedCustomer._id}`, {
        status,
        fromAdmin: true 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCustomers(customers.map(customer => 
        customer._id === selectedCustomer._id ? { ...customer, status } : customer
      ));
      setShowModal(false);
      setStatus(''); 
      updateMessage(status); // Actualizar el mensaje según el estado
      handleOpenConfirmationModal(); // Abrir la ventana de confirmación después de guardar los cambios
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const updateMessage = (status) => {
    let newMessage = '';
    switch (status) {
      case 'Aprobado':
        newMessage = `Estimado Cliente, felicidades ${selectedCustomer.name}, su verificación de pago fue todo un éxito. Ahora está participando en esta increíble oportunidad con los siguientes tickets: ${selectedCustomer.selectedTickets.map(ticketId => ticketNumbers[ticketId] || ticketId).join(', ')}. Gracias por realizar su pago mediante ${selectedCustomer.paymentMethod}.`;
        break;
      case 'Rechazado':
        newMessage = `Estimado Cliente, ${selectedCustomer.name}, su verificación de pago no pudo ser procesada con éxito. Para participar con los siguientes tickets: ${selectedCustomer.selectedTickets.map(ticketId => ticketNumbers[ticketId] || ticketId).join(', ')} mediante el método de pago ${selectedCustomer.paymentMethod}.`;
        break;
      default:
        newMessage = `Estimado Cliente, ${selectedCustomer.name}, ha ocurrido un error con su verificación de pago. Por favor, contacte con soporte.`;
    }
    setMessage(newMessage);
  };

  const handleVerify = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTicketError('');
    setStatus('');
  };

  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleViewImage = (url) => {
    window.open(url, '_blank');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    let filtered = customers;

    if (filters.date) {
      filtered = filtered.filter(customer => {
        const customerDate = customer.registerTime.split(',')[0];
        const [day, month, year] = customerDate.split('/');
        const formattedCustomerDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        return formattedCustomerDate === filters.date;
      });
    }
    if (filters.id) {
      filtered = filtered.filter(customer => customer.id.includes(filters.id));
    }
    if (filters.name) {
      filtered = filtered.filter(customer => customer.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.paymentMethod) {
      filtered = filtered.filter(customer => customer.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase()));
    }
    if (filters.tickets) {
      filtered = filtered.filter(customer => customer.selectedTickets.some(ticketId => ticketNumbers[ticketId]?.toString().includes(filters.tickets)));
    }
    if (filters.totalPrice) {
      filtered = filtered.filter(customer => customer.totalPrice.toString().includes(filters.totalPrice));
    }

    setFilteredCustomers(filtered);
  };

  const handleNotifyCustomer = (notify) => {
    if (notify) {
      const whatsappUrl = `https://wa.me/${selectedCustomer.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
    handleCloseConfirmationModal();
    window.location.reload(); // Refrescar la página después de cerrar la ventana de confirmación
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Sidebar filters={filters} handleFilterChange={handleFilterChange} applyFilters={applyFilters}>
          <button className={`${styles.navButton} ${styles.navButtonAprobadas}`} onClick={() => router.push('/adminA')}>
            Aprobadas
          </button>
          <button className={styles.navButton} onClick={() => router.push('/adminR')}>
            Rechazadas
          </button>
          <button className={styles.navButton} onClick={() => router.push('/adminW')}>
            Ganadores
          </button>
        </Sidebar>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Solicitudes de Clientes</h2>
            <LogoutButton />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          
          <CustomerTable customers={filteredCustomers} ticketNumbers={ticketNumbers} handleVerify={handleVerify} buttonText="Verificar" />

          {showModal && selectedCustomer && (
            <CustomerModal
              selectedCustomer={selectedCustomer}
              ticketNumbers={ticketNumbers}
              status={status}
              setStatus={setStatus}
              handleStatusChange={handleStatusChange}
              handleCloseModal={handleCloseModal}
              handleViewImage={handleViewImage}
              ticketError={ticketError}
              statusOptions={['Aprobado', 'Rechazado']}
              handleOpenConfirmationModal={handleOpenConfirmationModal}
            />
          )}

          {showConfirmationModal && (
            <ConfirmationModal
              handleCloseConfirmationModal={handleCloseConfirmationModal}
              handleNotifyCustomer={handleNotifyCustomer}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;