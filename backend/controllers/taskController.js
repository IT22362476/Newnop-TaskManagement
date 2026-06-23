/**
 * Task Controller
 * Handles all CRUD operations for tasks.
 * Role-based filtering: Admins see all tasks; regular users see only their own.
 */
const { validationResult } = require('express-validator');
const Task = require('../models/Task');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (admin sees all; user sees only their own)
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      // Admin: fetch all tasks, populate user info
      tasks = await Task.find().populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      // Regular user: fetch only their tasks
      tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership or admin
    if (task.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error.message);
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error fetching task' });
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 * @access  Private
 */
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership or admin
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error updating task' });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership or admin
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
