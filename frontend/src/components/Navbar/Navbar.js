import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Remove all auth-related items
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Force a page reload to clear any cached state
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/home')}>
        Scheduler.AI
      </div>
      <div className="navbar-right">
        <div className="notification-icon">
          <FaBell />
          <span className="notification-badge">0</span>
        </div>
        <button className="sign-out-button" onClick={handleSignOut}>
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 