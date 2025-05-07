import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import './taskTable.css';

const columns = [
  { key: 'title', label: 'Task' },
  { key: 'priority', label: 'Priority' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'createdAt', label: 'Date Created' },
];

const PAGE_SIZES = [10, 20, 50];

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  // Filtering logic
  const filteredTasks = tasks.filter(task => {
    const title = (task.title || '').toLowerCase();
    const description = (task.description || '').toLowerCase();
    const matchesSearch =
      title.includes(search.toLowerCase()) ||
      description.includes(search.toLowerCase());
    const matchesPriority = priority === 'all' || task.priority === priority;
    return matchesSearch && matchesPriority;
  });

  // Sorting logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    // For dates, convert to timestamps
    if (['startDate', 'endDate', 'createdAt'].includes(sortBy)) {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    }
    // For priority, custom order
    if (sortBy === 'priority') {
      const order = { high: 3, medium: 2, low: 1 };
      aVal = order[aVal] || 0;
      bVal = order[bVal] || 0;
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedTasks.length / pageSize) || 1;
  const pagedTasks = sortedTasks.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [search, priority]);

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="task-table-container">
      <h1>All Tasks</h1>
      <div className="task-table-controls">
        <input
          type="text"
          className="task-search-input"
          placeholder="Search by name or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="task-priority-filter"
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="task-page-size"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          {PAGE_SIZES.map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
      </div>
      <table className="task-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="sortable-th"
              >
                {col.label}
                {sortBy === col.key && (
                  <span className="sort-arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedTasks.map(task => (
            <tr key={task._id} className="task-row" onClick={e => { if (e.target.tagName !== 'BUTTON') navigate(`/task/${task._id}`); }}>
              <td>{task.title}</td>
              <td><span className={`priority-badge ${task.priority}`}>{task.priority}</span></td>
              <td>{task.startDate ? new Date(task.startDate).toLocaleDateString() : '-'}</td>
              <td>{task.endDate ? new Date(task.endDate).toLocaleDateString() : '-'}</td>
              <td>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}</td>
              <td>
                <button className="edit-btn" onClick={e => { e.stopPropagation(); navigate(`/task/${task._id}`); }}>Edit</button>
                <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(task._id); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="task-table-pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&laquo; Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next &raquo;</button>
      </div>
    </div>
  );
};

export default TaskTable; 