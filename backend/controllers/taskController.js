/**
 * Task Controller
 * Handles all CRUD operations with full role-based access control.
 *
 * Rules:
 *   Admin  → can read/update/delete ANY task, assign to ANY user
 *   User   → can read/update tasks they created OR are assigned to;
 *             can ONLY delete tasks they created;
 *             can ONLY assign tasks to themselves
 */
const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (admin sees ALL; user sees own + assigned)
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      // Admin: fetch all tasks, populate creator and assignee info
      tasks = await Task.find()
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Regular user: tasks they created OR are assigned to
      tasks = await Task.find({
        $or: [
          { createdBy: req.user._id },
          { assignedTo: req.user._id },
        ],
      })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
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
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admin can view any task
    if (req.user.role === 'admin') {
      return res.json(task);
    }

    // Regular user: can view only if created by them or assigned to them
    const isCreator = task.createdBy && task.createdBy._id.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo._id.toString() === req.user._id.toString();

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error.message);
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
 *
 * Admin: can optionally set assignedTo to any user
 * User:  assignedTo defaults to themselves (hidden field)
 */
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    let targetAssignee;

    if (req.user.role === 'admin') {
      // Admin can assign to any user; if none provided, assign to self
      if (assignedTo) {
        const targetUser = await User.findById(assignedTo);
        if (!targetUser) {
          return res.status(400).json({ message: 'Assigned user not found' });
        }
        targetAssignee = assignedTo;
      } else {
        targetAssignee = req.user._id;
      }
    } else {
      // Regular user: always assigned to self
      targetAssignee = req.user._id;
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy: req.user._id,
      assignedTo: targetAssignee,
    });

    // Return with populated fields
    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 * @access  Private
 *
 * Admin:  can update ANY task
 * User:   can update only if createdBy or assignedTo matches
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

    // Check permissions
    if (req.user.role !== 'admin') {
      const isCreator = task.createdBy.toString() === req.user._id.toString();
      const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

      if (!isCreator && !isAssignee) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    // Admin can reassign; regular user cannot change assignment
    if (req.user.role === 'admin' && assignedTo !== undefined) {
      if (assignedTo) {
        const targetUser = await User.findById(assignedTo);
        if (!targetUser) {
          return res.status(400).json({ message: 'Assigned user not found' });
        }
        task.assignedTo = assignedTo;
      } else {
        // Unassign — fall back to creator
        task.assignedTo = task.createdBy;
      }
    }

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(populatedTask);
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
 *
 * Admin: can delete ANY task
 * User:  can ONLY delete tasks they created (not just assigned)
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admin can delete any task
    if (req.user.role === 'admin') {
      await task.deleteOne();
      return res.json({ message: 'Task removed successfully' });
    }

    // Regular user: can only delete tasks they created
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task — you can only delete tasks you created' });
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

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics per user (admin only)
 * @access  Private (admin)
 */
const getTaskStats = async (req, res) => {
  try {
    const users = await User.find().select('_id name email role').sort({ name: 1 });

    const stats = await Promise.all(
      users.map(async (user) => {
        const [total, pending, inProgress, completed] = await Promise.all([
          Task.countDocuments({ assignedTo: user._id }),
          Task.countDocuments({ assignedTo: user._id, status: 'pending' }),
          Task.countDocuments({ assignedTo: user._id, status: 'in-progress' }),
          Task.countDocuments({ assignedTo: user._id, status: 'completed' }),
        ]);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          stats: { total, pending, inProgress, completed },
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      })
    );

    res.json(stats);
  } catch (error) {
    console.error('Get task stats error:', error.message);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskStats };
