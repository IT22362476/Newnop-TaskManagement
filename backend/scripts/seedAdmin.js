/**
 * Admin Seed Script
 * Run this to create an admin user directly in the database.
 *
 * Usage:
 *   node scripts/seedAdmin.js
 *
 * Alternatively, an existing admin can promote users via the member progress page.
 */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const adminData = {
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
    };

    // Check if admin already exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log(`Admin user already exists: ${existing.email} (role: ${existing.role})`);
      await mongoose.disconnect();
      return;
    }

    const admin = await User.create(adminData);
    console.log(`✅ Admin user created:`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role:  ${admin.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
