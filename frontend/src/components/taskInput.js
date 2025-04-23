import React, { useState } from 'react';
import api from '../axios';

const TaskInput = () => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = { taskName, description, dueDate, priority };
      const response = await api.post('/tasks', taskData);
      console.log('Task added:', response.data);
      // Reset form
      setTaskName('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const getTaskSuggestion = async () => {
    try {
      const response = await api.post('/suggest-tasks', { userPreferences: 'short bursts of work' });
      console.log('Task suggestion:', response.data.suggestion);
    } catch (error) {
      console.error('Error getting task suggestion:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskInput;
