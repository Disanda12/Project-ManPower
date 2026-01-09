const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// TEST ROUTE: Get all services from your SQL table
app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});