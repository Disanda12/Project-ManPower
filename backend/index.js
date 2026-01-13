const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/auth');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/booking');
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  const uploadDir = './uploads/profiles';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📂 Created uploads/profiles directory');
  }
});
