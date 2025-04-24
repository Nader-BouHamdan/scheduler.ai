import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskInput from './components/taskInput';
import CalendarView from './components/Calendar';
import Home from './pages/Home';
import TaskPage from './pages/taskPage';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/protectedRoute';
import { Navigate } from 'react-router-dom';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Add more protected routes */}
        <Route path="/home" element={<ProtectedRoute component={Home} />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/task-input" element={<TaskInput />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/task/:id" element={<TaskPage />} />

        {/* Default to Home after login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
