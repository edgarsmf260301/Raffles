import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import phoneCodes from '../phoneCodes'; 
import styles from '../../styles/RegisterForm.module.css'; 
import CustomSingleValue from './CustomSingleValue';
import CustomOption from './CustomOption';
import FormGroup from './FormGroup';

const PhoneNumberField = ({ formData, handleChange, formErrors }) => {
  const [selectedPhoneCode, setSelectedPhoneCode] = useState({ code: '+58', imageUrl: '/img/flag_codephone/Flag_of_Venezuela.webp' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePhoneCodeChange = (selectedOption) => {
    setSelectedPhoneCode(selectedOption);
    handleChange({ target: { name: 'phoneCode', value: selectedOption.code } });
  };

  return (
    <FormGroup label="Número de Teléfono" error={formErrors.phone}>
      <div className={styles.phoneInputContainer}>
        {isClient && (
          <Select
            value={selectedPhoneCode}
            onChange={handlePhoneCodeChange}
            options={phoneCodes}
            getOptionLabel={(option) => option.code}
            getOptionValue={(option) => option.code}
            components={{ SingleValue: CustomSingleValue, Option: CustomOption }}
            className={styles.phoneCodeSelect}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#1F2937',
                borderColor: '#ccc',
                color: 'white',
                height: '5px',
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
        )}
        <input 
          type="text" 
          name="phone" 
          placeholder="Número de Teléfono" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
          pattern="^\d+$" 
          title="Solo se permiten números." 
          className={`${styles.inputField} ${styles.phoneNumberInput}`} 
        />
      </div>
    </FormGroup>
  );
};

export default PhoneNumberField;