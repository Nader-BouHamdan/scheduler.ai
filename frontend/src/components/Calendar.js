import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../axios';
import BackButton from './backButton'; // Import BackButton

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  // Fetch tasks and set up calendar (same as before)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching tasks...');
        const response = await api.get('/tasks');
        console.log('Raw task data from server:', response.data);
        
        // Log each task's date
        response.data.forEach(task => {
          console.log(`Task: ${task.taskName}`, {
            dueDate: task.dueDate,
            parsedDate: new Date(task.dueDate),
            dateString: new Date(task.dueDate).toDateString()
          });
        });

        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again.');
      } finally {
        setIsLoading(false);
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
    console.log('Selected date:', {
      date: date,
      dateString: date.toDateString(),
      isoString: date.toISOString()
    });
    setSelectedDate(date);
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) {
      console.log('Invalid dates:', { date1, date2 });
      return false;
    }

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    console.log('Comparing dates:', {
      date1: {
        original: date1,
        parsed: d1,
        dateString: d1.toDateString()
      },
      date2: {
        original: date2,
        parsed: d2,
        dateString: d2.toDateString()
      },
      yearMatch: d1.getFullYear() === d2.getFullYear(),
      monthMatch: d1.getMonth() === d2.getMonth(),
      dayMatch: d1.getDate() === d2.getDate()
    });

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getTasksForDate = (date) => {
    console.log('Getting tasks for date:', {
      date: date,
      dateString: date.toDateString(),
      isoString: date.toISOString()
    });

    console.log('Current tasks state:', tasks);

    const tasksForDate = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      console.log('Checking task:', {
        taskName: task.taskName,
        taskDate: taskDate,
        taskDateString: taskDate.toDateString(),
        selectedDate: date.toDateString()
      });
      
      const isMatch = isSameDay(taskDate, date);
      
      if (isMatch) {
        console.log('Found matching task:', {
          taskName: task.taskName,
          taskDate: taskDate,
          taskDateString: taskDate.toDateString(),
          selectedDate: date.toDateString()
        });
      }
      
      return isMatch;
    });

    console.log('Tasks found for date:', {
      date: date.toDateString(),
      taskCount: tasksForDate.length,
      tasks: tasksForDate
    });

    return tasksForDate;
  };

  // Debug render
  console.log('Rendering calendar with:', {
    currentMonth: currentMonth.toDateString(),
    selectedDate: selectedDate?.toDateString(),
    tasksCount: tasks.length
  });

  return (
    <div className="container">
      {/* Back button */}
      <BackButton />

      {error && <p className="error">{error}</p>}

      <div className="calendar-nav">
        <button onClick={handlePrevMonth}>Previous</button>
        <span>{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</span>
        <button onClick={handleNextMonth}>Next</button>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <div className="day-header">Sun</div>
          <div className="day-header">Mon</div>
          <div className="day-header">Tue</div>
          <div className="day-header">Wed</div>
          <div className="day-header">Thu</div>
          <div className="day-header">Fri</div>
          <div className="day-header">Sat</div>
        </div>

        <div className="calendar-grid">
          {currentMonthDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isSelected = selectedDate && isSameDay(selectedDate, day);
            
            console.log('Rendering day:', {
              date: day.toDateString(),
              hasTasks: dayTasks.length > 0,
              isSelected
            });

            return (
              <div
                key={day.toISOString()}
                className={`day-button ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectDate(day)}
              >
                <span className="day-number">{day.getDate()}</span>
                {dayTasks.length > 0 && (
                  <span className="task-indicator">•</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="selected-date-tasks">
          <h3>Tasks for {selectedDate.toLocaleDateString()}</h3>
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <div className="task-list">
              {getTasksForDate(selectedDate).length === 0 ? (
                <p>No tasks for this date</p>
              ) : (
                getTasksForDate(selectedDate).map(task => (
                  <div key={task._id} className="task-item">
                    <h4>{task.taskName}</h4>
                    <p>{task.description}</p>
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
