import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import './styles/timeline.css';

const DAY_MS = 24 * 60 * 60 * 1000;

const Timeline = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [windowDays, setWindowDays] = useState(14);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setHours(0,0,0,0)),
        end: new Date(new Date().setHours(0,0,0,0) + 13 * DAY_MS)
    });
    const navigate = useNavigate();

    useEffect(() => {
        const start = new Date();
        start.setHours(0,0,0,0);
        const end = new Date(start.getTime() + (windowDays - 1) * DAY_MS);
        setDateRange({ start, end });
    }, [windowDays]);

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line
    }, [dateRange]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/tasks', {
                params: {
                    startDate: dateRange.start.toISOString(),
                    endDate: dateRange.end.toISOString()
                }
            });
            setTasks(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch tasks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getDaysArray = () => {
        const days = [];
        let current = new Date(dateRange.start);
        while (current <= dateRange.end) {
            days.push(new Date(current));
            current = new Date(current.getTime() + DAY_MS);
        }
        return days;
    };

    const getBarPosition = (task) => {
        const start = new Date(task.startDate || task.dueDate);
        const end = new Date(task.endDate || task.dueDate);
        const rangeStart = dateRange.start;
        const rangeEnd = dateRange.end;
        // Clamp bar to visible range
        const barStart = start < rangeStart ? rangeStart : start;
        const barEnd = end > rangeEnd ? rangeEnd : end;
        const totalDays = getDaysArray().length;
        const offset = Math.max(0, Math.round((barStart - rangeStart) / DAY_MS));
        const span = Math.max(1, Math.round((barEnd - barStart) / DAY_MS) + 1);
        return { offset, span };
    };

    const todayIndex = () => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return Math.round((today - dateRange.start) / DAY_MS);
    };

    if (loading) return <div className="loading">Loading timeline...</div>;
    if (error) return <div className="error">{error}</div>;

    const days = getDaysArray();
    const todayCol = todayIndex();

    return (
        <div className="gantt-container">
            <div className="gantt-sidebar">
                <div className="gantt-sidebar-header">Tasks</div>
                {tasks.map(task => (
                    <div className="gantt-task-label" key={task._id}>
                        <span className="gantt-task-id">{task._id.slice(-4)}</span> {task.title}
                    </div>
                ))}
            </div>
            <div className="gantt-main">
                <div className="gantt-header" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
                    {days.map((date, idx) => (
                        <div className="gantt-header-cell" key={idx}>
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    ))}
                </div>
                <div className="gantt-rows">
                    {tasks.map((task, rowIdx) => {
                        const { offset, span } = getBarPosition(task);
                        return (
                            <div className="gantt-row" key={task._id} style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
                                {/* Empty cells before bar */}
                                {Array(offset).fill(0).map((_, i) => <div className="gantt-cell" key={i}></div>)}
                                {/* Bar */}
                                <div
                                    className={`gantt-bar priority-${task.priority}`}
                                    style={{ gridColumn: `span ${span}` }}
                                    title={`${task.title}: ${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.endDate).toLocaleDateString()}`}
                                    onClick={() => navigate(`/task/${task._id}`)}
                                >
                                    {task.title}
                                </div>
                                {/* Empty cells after bar */}
                                {Array(days.length - offset - span).fill(0).map((_, i) => <div className="gantt-cell" key={i + offset + span}></div>)}
                            </div>
                        );
                    })}
                    {/* Today line */}
                    {todayCol >= 0 && todayCol < days.length && (
                        <div className="gantt-today-line" style={{ left: `calc(${(todayCol / days.length) * 100}% )` }}></div>
                    )}
                </div>
                <div className="gantt-controls">
                    <button onClick={() => setWindowDays(7)}>7 Days</button>
                    <button onClick={() => setWindowDays(14)}>14 Days</button>
                    <button onClick={() => setWindowDays(30)}>30 Days</button>
                </div>
            </div>
        </div>
    );
};

export default Timeline; 