const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const serviceRoutes = require('./routes/services');
const customerbookingRoutes = require('./routes/customerBooking');

// Middleware
const path = require('path');
const fs = require('fs');
app.use(cors());
app.use(express.json());
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');
const notificationRoutes = require('./routes/notifications');
const statusRoutes = require('./routes/status');

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customer-booking', customerbookingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes.router);
app.use('/api/status', statusRoutes);

// Catch all handler: send back React's index.html file for any non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  
  // Test database connection
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
  
  const uploadDir = './uploads/profiles';
  if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📂 Created uploads/profiles directory');
  }
});