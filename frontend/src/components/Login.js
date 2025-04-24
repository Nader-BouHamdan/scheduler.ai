import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../axios';
import { Link } from 'react-router-dom'; // Import Link from React Router

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await api.post('/login', { email, password });

      // After successful login, store the JWT in localStorage
      localStorage.setItem('authToken', response.data.token); // Store token in localStorage

      // Redirect to Home page after successful login
      navigate('/home'); // Redirect to Home page
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* Sign Up link below the login form */}
        <p>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#3498db', textDecoration: 'underline' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
