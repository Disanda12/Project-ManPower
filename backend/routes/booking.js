const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/create', async (req, res) => {
    const { 
        customer_id, 
        service_id, 
        number_of_workers, 
        work_description, 
        start_date, 
        end_date, 
        total_amount_lkr, 
        advance_amount_lkr 
    } = req.body;

    try {
        const sql = `
            INSERT INTO bookings 
            (customer_id, service_id, number_of_workers, work_description, start_date, end_date, total_amount_lkr, advance_amount_lkr) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            customer_id, 
            service_id, 
            number_of_workers, 
            work_description, 
            start_date, 
            end_date, 
            total_amount_lkr, 
            advance_amount_lkr
        ]);

        res.status(201).json({ 
            success: true, 
            message: "Booking placed successfully!", 
            bookingId: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error during booking" });
    }
});


// GET all bookings for a specific user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const sql = `
            SELECT 
                b.booking_id, 
                b.number_of_workers, 
                b.work_description, 
                b.start_date, 
                b.end_date, 
                b.total_amount_lkr, 
                b.booking_status, 
                s.service_name
            FROM bookings b
            JOIN services s ON b.service_id = s.service_id
            WHERE b.customer_id = ?
            ORDER BY b.created_at DESC
        `;

        const [rows] = await db.query(sql, [userId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch order history" });
    }
});


module.exports = router;