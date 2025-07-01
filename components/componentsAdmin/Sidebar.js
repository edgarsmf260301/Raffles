import React, { useState } from 'react';
import styles from '../../styles/Sidebar.module.css';
import FilterForm from './FilterForm';

const Sidebar = ({ filters, handleFilterChange, applyFilters, showFilterButton = true, children }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [showFilter, setShowFilter] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'}
      </button>
      {isOpen && (
        <div className={styles.sidebarContent}>
          {showFilterButton && (
            <button className={styles.filterButton} onClick={toggleFilter}>
              {showFilter ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
          )}
          {showFilter && <FilterForm filters={filters} handleFilterChange={handleFilterChange} applyFilters={applyFilters} />}
          {children}
        </div>
      )}
    </div>
  );
};

export default Sidebar;