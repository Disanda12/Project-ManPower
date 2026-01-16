const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, } = require('../middleware/auth');
const { createNotification } = require('./notifications');

// Add 'authenticateToken' here to protect the route
router.post('/create', authenticateToken, async (req, res) => {
    const { 
        service_id, 
        number_of_workers, 
        work_description, 
        start_date, 
        end_date, 
        total_amount_lkr, 
        advance_amount_lkr,
        location,
        customer_id: requested_customer_id // Optional: if admin wants to specify a ID
    } = req.body;

    // Security: Use logged-in user ID, or if Admin, use the provided customer_id
    const customer_id = (req.user.role === 'admin' && requested_customer_id) 
        ? requested_customer_id 
        : req.user.id;

    try {
        const sql = `
            INSERT INTO bookings 
            (customer_id, service_id, number_of_workers, work_description, start_date, end_date, total_amount_lkr, advance_amount_lkr, location) 
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

        const booking_id = result.insertId;

        // Notify all admins about the new booking
        try {
            const [admins] = await db.query('SELECT user_id FROM users WHERE user_type = ?', ['admin']);
            for (const admin of admins) {
                await createNotification(
                    admin.user_id,
                    'New Booking Requires Worker Assignment',
                    `A new booking (ID: ${booking_id}) has been created and needs a worker to be assigned.`,
                    'general'
                );
            }
        } catch (notificationErr) {
            console.error('Error creating admin notifications:', notificationErr);
            // Don't fail the booking creation if notification fails
        }

        res.status(201).json({ 
            success: true, 
            message: "Booking placed successfully!", 
            bookingId: result.insertId 
        });
    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error during booking",
            error: err.message 
        });
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
router.patch('/cancel/:bookingId', authenticateToken, async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id; // Extracted from the token by authenticateToken middleware

    try {
        // 1. Check if the booking exists AND belongs to the authenticated user
        const [booking] = await db.query(
            "SELECT booking_status FROM bookings WHERE booking_id = ? AND customer_id = ?", 
            [bookingId, userId]
        );

        // If no booking found, it either doesn't exist or belongs to someone else
        if (booking.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Booking not found or you do not have permission to cancel it." 
            });
        }

        const currentStatus = booking[0].booking_status.toLowerCase();

        // 2. Prevent cancelling if already confirmed, completed, or already cancelled
        if (['confirmed', 'completed', 'cancelled'].includes(currentStatus)) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot cancel a booking that is already ${currentStatus}.` 
            });
        }

        // 3. Update status to 'cancelled' - targeting both ID and customer_id for safety
        await db.query(
            "UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ? AND customer_id = ?",
            [bookingId, userId]
        );

        res.json({ 
            success: true, 
            message: "Booking cancelled successfully" 
        });

    } catch (err) {
        console.error("Cancel Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error during cancellation" 
        });
    }
});

module.exports = router;