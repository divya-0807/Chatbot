import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, name, required = true }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem' }}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '1rem'
        }}
      />
    </div>
  );
};

export default InputField;
