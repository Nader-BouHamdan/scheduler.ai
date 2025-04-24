import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../axios';
import BackButton from './backButton'; // Import BackButton

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Fetch tasks and set up calendar (same as before)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [currentMonth]);

  // Helper function to get the days of the month
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // Get the current month and year
  const currentMonthDays = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container">
      {/* Back button */}
      <BackButton />

      <div className="calendar-nav">
        <button onClick={handlePrevMonth}>Back</button>
        <span>{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</span>
        <button onClick={handleNextMonth}>Next</button>
      </div>

      <div className="calendar-container">
        {/* Days of the week */}
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>

        {/* Days of the month */}
        {currentMonthDays.map((day) => (
          <div
            key={day}
            className={`day-button ${selectedDate?.toDateString() === day.toDateString() ? 'selected' : ''}`}
            onClick={() => handleSelectDate(day)}
          >
            {day.getDate()}
          </div>
        ))}
      </div>

      <div>
        {selectedDate && (
          <div>
            <h3>Tasks on {selectedDate.toLocaleDateString()}</h3>
            {/* Filter tasks based on selected date */}
            {tasks
              .filter((task) => new Date(task.dueDate).toDateString() === selectedDate.toDateString())
              .map((task) => (
                <div key={task._id}>
                  <p>{task.taskName}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
