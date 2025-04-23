const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// CREATE: Add a new task
router.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ: Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
