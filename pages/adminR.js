import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Admin.module.css';
import CustomerTable from '../components/componentsAdmin/CustomerTable';
import CustomerModal from '../components/componentsAdmin/CustomerModal';
import Sidebar from '../components/componentsAdmin/Sidebar';
import LogoutButton from '../components/componentsAdmin/LogoutButton';

const AdminR = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
        const response = await axios.get('/api/customersAdmin?status=Rechazado', {
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
      if (status === 'Cancelado') {
        await axios.put('/api/cancelCustomer', { id: selectedCustomer._id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(customers.filter(customer => customer._id !== selectedCustomer._id));
      } else {
        await axios.put(`/api/customersAdmin?id=${selectedCustomer._id}`, {
          status,
          fromAdminR: true // Indicate that the request is from adminR
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(customers.map(customer => 
          customer._id === selectedCustomer._id ? { ...customer, status } : customer
        ));
      }
      setShowModal(false);
      setStatus(''); // Clear the status when closing the modal
      window.location.reload(); // Refresh the page after closing the modal
    } catch (error) {
      if (error.response && error.response.status === 401) {
        router.push('/error');
      } else {
        setError(`Failed to update status: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleVerify = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTicketError(''); // Clear the ticket error when closing the modal
    setStatus(''); // Clear the status when closing the modal
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'comprobante';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className={styles.container}>
      <Sidebar filters={filters} handleFilterChange={handleFilterChange} applyFilters={applyFilters}>
        <button className={styles.navButton} onClick={() => router.push('/admin')}>
          Solicitudes
        </button>
        <button className={styles.navButton} onClick={() => router.push('/adminA')}>
          Aprobadas
        </button>
        <button className={styles.navButton} onClick={() => router.push('/adminW')}>
          Ganadores
        </button>
      </Sidebar>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Rechazados</h2>
          <LogoutButton />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        
        <CustomerTable customers={filteredCustomers} ticketNumbers={ticketNumbers} handleVerify={handleVerify} buttonText="Cambiar estatus" showPhone={true} />

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
            statusOptions={['Aprobado', 'Cancelado']} // Only "Aprobado" and "Cancelado" options
          />
        )}
      </div>
    </div>
  );
};

export default AdminR;