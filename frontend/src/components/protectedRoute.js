import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('authToken'); // Check for token in localStorage

  return token ? <Component {...rest} /> : <Navigate to="/login" />; // Redirect to login if no token
};

export default ProtectedRoute;
