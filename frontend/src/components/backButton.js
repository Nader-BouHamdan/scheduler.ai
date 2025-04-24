// components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button 
      onClick={handleBack}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        padding: '10px 15px',
        fontSize: '1rem',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      &#8592; Back
    </button>
  );
};

export default BackButton;
