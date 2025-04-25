import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import TaskInput from './components/taskInput';
import CalendarView from './components/Calendar';
import './App.css';
import './styles.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar />}
        <div className="content">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/home" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/task-input" 
              element={isAuthenticated ? <TaskInput /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/calendar" 
              element={isAuthenticated ? <CalendarView /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
