/**
 * Authentication Routes
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser, getMe, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  registerUser
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

// GET /api/auth/me
router.get('/me', protect, getMe);

// GET /api/auth/users — admin only (for task assignment dropdown)
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
