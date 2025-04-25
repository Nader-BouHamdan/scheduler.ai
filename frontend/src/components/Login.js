import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send login request to the backend
      const response = await api.post('/login', { email, password });

      if (response.data.token) {
        // Store the token
        localStorage.setItem('token', response.data.token);
        
        // Dispatch a storage event to trigger the auth state update
        window.dispatchEvent(new Event('storage'));
        
        // Navigate to home
        navigate('/home', { replace: true });
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
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
