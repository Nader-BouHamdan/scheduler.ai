const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/authMiddleware'); // Import the middleware
const router = express.Router();

// Create a new task (protected route)
router.post('/tasks', authMiddleware, async (req, res) => {
  const { taskName, description, dueDate, priority, startDate, endDate } = req.body;

  // Validate required fields
  if (!taskName || !description || !dueDate || !priority) {
    return res.status(400).json({ 
      message: 'All fields are required',
      missing: {
        taskName: !taskName,
        description: !description,
        dueDate: !dueDate,
        priority: !priority
      }
    });
  }

  try {
    // Create new task with user ID
    const task = new Task({
      taskName,
      description,
      dueDate: new Date(dueDate),
      priority,
      user: req.userId,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(dueDate)
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      message: 'Error creating task', 
      error: error.message 
    });
  }
});

// Get tasks for the logged-in user (protected route)
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.userId };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const userTasks = await Task.find(query).lean();

    // Convert dates to ISO strings for consistent handling
    const formattedTasks = userTasks.map(task => ({
      ...task,
      _id: task._id,
      title: task.taskName,
      date: task.dueDate,
      startTime: task.startTime,
      description: task.description,
      priority: task.priority,
      dueDate: new Date(task.dueDate).toISOString(),
      startDate: task.startDate ? new Date(task.startDate).toISOString() : null,
      endDate: task.endDate ? new Date(task.endDate).toISOString() : null,
      createdAt: new Date(task.createdAt).toISOString()
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', {
      error: error.message,
      userId: req.userId
    });
    res.status(500).json({ 
      message: 'Error fetching tasks', 
      error: error.message 
    });
  }
});

// Update a task (protected route)
router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task with new data
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : task.dueDate,
        startDate: req.body.startDate ? new Date(req.body.startDate) : task.startDate,
        endDate: req.body.endDate ? new Date(req.body.endDate) : (req.body.dueDate ? new Date(req.body.dueDate) : task.endDate),
        user: req.userId 
      },
      { new: true }
    );
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      message: 'Error updating task', 
      error: error.message 
    });
  }
});

// Delete a task (protected route)
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      message: 'Error deleting task', 
      error: error.message 
    });
  }
});

// Temporary route to fix tasks without user IDs
router.post('/fix-tasks', authMiddleware, async (req, res) => {
  try {
    // Find all tasks without a user field
    const tasksWithoutUser = await Task.find({ user: { $exists: false } });
    console.log('Found tasks without user:', tasksWithoutUser.length);

    // Update them with the current user's ID
    const updatePromises = tasksWithoutUser.map(task => 
      Task.findByIdAndUpdate(task._id, { user: req.userId })
    );
    
    await Promise.all(updatePromises);
    
    res.json({ 
      message: 'Tasks updated successfully',
      count: tasksWithoutUser.length
    });
  } catch (error) {
    console.error('Error fixing tasks:', error);
    res.status(500).json({ message: 'Error fixing tasks' });
  }
});

module.exports = router;
