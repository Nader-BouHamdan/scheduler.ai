import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import './styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const {loading} = useAuth();

  if (loading) return null;

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h1>Welcome to Scheduler.ai</h1>
        <p className="subtitle">Your intelligent scheduling assistant</p>
        
        <div className="features">
          <div className="feature-card">
            <h3>Smart Scheduling</h3>
            <p>Let AI help you organize your tasks efficiently</p>
          </div>
          <div className="feature-card">
            <h3>Priority Management</h3>
            <p>Focus on what matters most with priority-based scheduling</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Updates</h3>
            <p>Stay on top of your schedule with instant notifications</p>
          </div>
        </div>

        <div className="quick-actions">
            <>
              <button className="action-button" onClick={() => navigate('/task-input')}>Add New Task</button>
              <button className="action-button" onClick={() => navigate('/calendar')}>View Calendar</button>
            </>
        </div>
      </div>
    </div>
  );
};

export default Home;
