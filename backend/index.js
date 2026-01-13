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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes); 
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customer-booking', customerbookingRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  const uploadDir = './uploads/profiles';
  if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📂 Created uploads/profiles directory');
  }
});