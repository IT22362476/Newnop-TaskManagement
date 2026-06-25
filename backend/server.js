/**
 * Express Server — Entry point for the Task Management API
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// -------------------- Middleware --------------------
// Allow all origins (the API is public and auth is handled via JWT)
app.use(cors());
app.options('*', cors());
app.use(express.json()); // Parse JSON request bodies

// -------------------- Routes --------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health-check endpoint — reports DB status too
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.json({ status: 'OK', database: dbStatus, timestamp: new Date().toISOString() });
});

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// -------------------- Start Server (only after DB connects) --------------------
const PORT = process.env.PORT || 5000;

const start = async () => {
  console.log('Connecting to MongoDB…');
  const db = await connectDB();

  if (!db) {
    console.warn('⚠  MongoDB not available — server will start but DB operations will fail.');
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start();