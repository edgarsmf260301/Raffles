import React from 'react';
import Select from 'react-select';
import venezuelanStates from '../venezuelanStates';
import styles from '../../styles/StateSelect.module.css';

const StateSelect = ({ value, onChange, error }) => {
  const stateOptions = venezuelanStates.map(state => ({
    value: state,
    label: state,
  }));

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>Estado</label>
      <Select
      instanceId="state-select"
        value={stateOptions.find(option => option.value === value)}
        onChange={onChange}
        options={stateOptions}
        className={styles.selectField}
        placeholder="Seleccione un estado..." // Cambiar el texto del valor inicial vacío
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: '#1F2937',
            borderColor: '#ccc',
            color: 'white',
            height: '40px',
            width: '100%',
          }),
          singleValue: (base) => ({
            ...base,
            color: 'white',
            fontSize: '15px',
          }),
          valueContainer: (base) => ({
            ...base,
            height: '40px',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#1F2937',
            color: 'white',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#555' : '#1F2937',
            color: 'white',
            fontSize: '15px',
          }),
          input: (base) => ({
            ...base,
            color: 'transparent',
          }),
        }}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default StateSelect;