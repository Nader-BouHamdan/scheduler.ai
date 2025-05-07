import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './services/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import TaskInput from './pages/TaskInput/taskInput';
import Calendar from './pages/Calendar/Calendar';
import Timeline from './pages/Timeline/Timeline';
import TaskTable from './pages/TaskTable/TaskTable';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route
              path="/task-input"
              element={
                <ProtectedRoute>
                  <TaskInput />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timeline"
              element={
                <ProtectedRoute>
                  <Timeline />
                </ProtectedRoute>
              }
            />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <TaskTable />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
