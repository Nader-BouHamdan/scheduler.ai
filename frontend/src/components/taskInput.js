import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../axios';
import BackButton from './backButton'; // Import BackButton

const TaskInput = () => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = { taskName, description, dueDate, priority };
      await api.post('/tasks', taskData);
      navigate('/calendar'); // Redirect to calendar after task is added
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="task-input-container">
      <BackButton /> {/* Back Button */}
      <div className="task-input-form">
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default TaskInput;
