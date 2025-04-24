import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container">
      <h1>Welcome to Your Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/task-input">Add a New Task</Link>
          </li>
          <li>
            <Link to="/calendar">View Calendar</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
