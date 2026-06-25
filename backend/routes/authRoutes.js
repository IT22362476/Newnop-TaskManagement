/**
 * Authentication Routes
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser, getMe, getUsers, promoteToAdmin, googleLogin } = require('../controllers/authController');
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

// PATCH /api/auth/users/:id/promote — admin only (promote user to admin)
router.patch('/users/:id/promote', protect, authorize('admin'), promoteToAdmin);

// POST /api/auth/google — authenticate with Google ID token
router.post('/google', (req, res, next) => {
  console.log('POST /google route hit');
  console.log('Body:', req.body);
  next();
}, googleLogin);

module.exports = router;
