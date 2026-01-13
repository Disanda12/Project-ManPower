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
        advance_amount_lkr,
        location
    } = req.body;

    try {
        const sql = `
            INSERT INTO bookings 
            (customer_id, service_id, number_of_workers, work_description, start_date, end_date, total_amount_lkr, advance_amount_lkr,location) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            customer_id, 
            service_id, 
            number_of_workers, 
            work_description, 
            start_date, 
            end_date, 
            total_amount_lkr, 
            advance_amount_lkr,
            location
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
                b.location, 
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
        console.error("Fetch Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch order history" });
    }
});

// CANCEL a booking
router.patch('/cancel/:bookingId', async (req, res) => {
    const { bookingId } = req.params;

    try {
        // 1. Check if the booking exists and is in a cancellable state
        const [booking] = await db.query(
            "SELECT booking_status FROM bookings WHERE booking_id = ?", 
            [bookingId]
        );

        if (booking.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const currentStatus = booking[0].booking_status.toLowerCase();
        if (currentStatus === 'confirmed' || currentStatus === 'completed') {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot cancel a booking that is already confirmed or completed." 
            });
        }

        // 2. Update status to 'cancelled'
        await db.query(
            "UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ?",
            [bookingId]
        );

        res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("Cancel Error:", err);
        res.status(500).json({ success: false, message: "Server error during cancellation" });
    }
});

module.exports = router;