const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Submit Feedback
router.post('/submit', async (req, res) => {
    const { booking_id, customer_id, rating, comment } = req.body;
   
    try {
        // 1. Removed the extra comma after 'comment'
        // 2. Changed to exactly FOUR '?' to match the four variables
        const sql = `INSERT INTO feedbacks (booking_id, customer_id, rating, comment) 
                     VALUES (?, ?, ?, ?)`;
        
        await db.query(sql, [
            booking_id, 
            customer_id, 
            rating, 
            comment, 
        ]);

        res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
    } catch (err) {
        console.error("Feedback Error:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Feedback already exists for this booking." });
        }
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

module.exports = router;