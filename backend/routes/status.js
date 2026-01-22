const express = require('express');
const router = express.Router();
const db = require('../db');

// Get database connection status
router.get('/db-status', async (req, res) => {
    try {
        // Test database connection
        const connection = await db.getConnection();
        connection.release();

        res.json({
            status: 'success',
            message: 'Database connected successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;