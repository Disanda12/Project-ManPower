// backend/routes/services.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all available services
router.get('/get-Services', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT service_id, service_name, description, daily_rate_lkr, advance_percentage FROM services WHERE is_available = TRUE"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

module.exports = router;