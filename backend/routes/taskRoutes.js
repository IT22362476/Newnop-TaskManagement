/**
 * Task Routes
 * All routes require authentication (protect middleware).
 *
 * ⚠  Order matters: /stats must come before /:id to avoid "stats"
 *    being matched as an ID parameter.
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

// GET  /api/tasks         — list tasks (filtered by role)
router.get('/', getTasks);

// GET  /api/tasks/stats   — task stats per user (admin only)
router.get('/stats', (req, res, next) => {
  console.log("STATS ROUTE HIT");
  next();
}, authorize('admin'), getTaskStats);

// GET  /api/tasks/:id     — get a single task
router.get('/:id', (req, res, next) => {
  console.log("ID ROUTE HIT:", req.params.id);
  next();
}, getTaskById);

// POST /api/tasks         — create a task
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
  ],
  createTask
);

// PUT  /api/tasks/:id     — update a task
router.put(
  '/:id',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
  ],
  updateTask
);

// DELETE /api/tasks/:id   — delete a task
router.delete('/:id', deleteTask);

module.exports = router;
