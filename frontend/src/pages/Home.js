import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to Scheduler.ai</h1>
      <p>
        Manage your tasks and schedule in a smarter way! Scheduler.ai
        uses AI to help you prioritize tasks based on your personal preferences.
      </p>
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

export default Home;
