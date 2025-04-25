import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../axios';
import BackButton from './backButton'; // Import BackButton

const TaskInput = () => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = { taskName, description, dueDate, priority };
      await api.post('/tasks', taskData);
      navigate('/calendar'); // Redirect to calendar after task is added
    } catch (error) {
      setError('Failed to add task. Please try again.');
    }
  };

  return (
    <div className="task-input-container">
      <BackButton /> {/* Back Button */}
      <div className="task-input-form">
        <h2>Add New Task</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default TaskInput;
