import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../axios';

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    
    fetchTask();
  }, [id]);

  const handleComplete = async () => {
    try {
      const updatedTask = { ...task, completed: true };
      await api.put(`/tasks/${id}`, updatedTask);
      setTask(updatedTask);
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${id}`);
      alert('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="task-page-container">
      <div className="task-details">
        <h1>Task Details</h1>
        <p><strong>Task Name:</strong> {task.taskName}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}</p>

        {!task.completed && (
          <button onClick={handleComplete}>Mark as Completed</button>
        )}

        <button onClick={handleDelete}>Delete Task</button>

        <Link to="/calendar">Back to Calendar</Link>
      </div>
    </div>
  );
};

export default TaskPage;
