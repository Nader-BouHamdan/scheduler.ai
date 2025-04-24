const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/authMiddleware'); // Import the middleware
const router = express.Router();

// Create a new task (protected route)
router.post('/tasks', authMiddleware, async (req, res) => {
  const { taskName, description, dueDate, priority } = req.body;

  try {
    const task = new Task({
      taskName,
      description,
      dueDate,
      priority,
      user: req.userId, // Associate task with logged-in user
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Get tasks for the logged-in user (protected route)
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }); // Only fetch tasks for the logged-in user
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// UPDATE: Update a task's status
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted', task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
