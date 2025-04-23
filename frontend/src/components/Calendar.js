import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import api from '../axios';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        const taskData = response.data.map(task => ({
          title: task.taskName,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          priority: task.priority,
        }));
        setTasks(taskData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={tasks}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default Calendar;
