const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
require('dotenv').config();

const app = express();

// --- 1. Import Routes ---
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const serviceRoutes = require('./routes/services');
const customerbookingRoutes = require('./routes/customerBooking');
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');
const notificationRoutes = require('./routes/notifications');
const statusRoutes = require('./routes/status');

// --- 2. Middleware ---
app.use(cors());
app.use(express.json());

// --- 3. API Routes (Defined BEFORE static files) ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customer-booking', customerbookingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes.router);
app.use('/api/status', statusRoutes);

// --- 4. Static File Serving ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the React app build directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: ['https://manpower.jaan.lk', 'http://localhost:5173'], // Allow your domain and local dev
  credentials: true
}));// --- 5. Catch-All Handler (Regex Version) ---
// Using /.*/ as a literal regex is the most bulletproof way to catch all routes
app.get(/.*/, (req, res) => {
    // If a request starts with /api but didn't match any routes above, return a 404 JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other requests (navigation), send the React index.html
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Frontend build not found in 'public' folder.");
    }
});
// --- 6. Server Initialization ---
const PORT = process.env.PORT || 5000;

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
    
    // Ensure upload directories exist
    const uploadDir = path.join(__dirname, 'uploads', 'profiles');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('📂 Created uploads/profiles directory');
    }
});