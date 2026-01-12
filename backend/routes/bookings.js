const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Create a new booking (customer or admin)
router.post('/', authenticateToken, async (req, res) => {
    const { service_id, number_of_workers, work_description, start_date, end_date, total_amount_lkr, advance_amount_lkr, customer_id: requested_customer_id } = req.body;
    
    console.log('Booking creation request:', req.body);
    console.log('User:', req.user);
    
    // If admin specifies customer_id, use that; otherwise use the logged-in user's ID
    const customer_id = (req.user.role === 'admin' && requested_customer_id) ? requested_customer_id : req.user.id;
    
    console.log('Using customer_id:', customer_id);

    try {
        console.log('Parsed data:', {
            customer_id: typeof customer_id,
            service_id: typeof service_id,
            number_of_workers: typeof number_of_workers,
            work_description: typeof work_description,
            start_date,
            end_date,
            total_amount_lkr: typeof total_amount_lkr,
            advance_amount_lkr: typeof advance_amount_lkr
        });

        // Validate that customer exists
        const [customerCheck] = await db.query('SELECT user_id FROM users WHERE user_id = ? AND user_type = ?', [customer_id, 'customer']);
        if (customerCheck.length === 0) {
            console.log('Customer not found:', customer_id);
            return res.status(400).json({ error: 'Invalid customer ID' });
        }

        // Validate that service exists
        const [serviceCheck] = await db.query('SELECT service_id FROM services WHERE service_id = ?', [service_id]);
        if (serviceCheck.length === 0) {
            console.log('Service not found:', service_id);
            return res.status(400).json({ error: 'Invalid service ID' });
        }

        console.log('Validation passed, inserting booking...');

        // Insert booking - try with minimal columns first
        const [result] = await db.query(`
            INSERT INTO bookings (
                customer_id, service_id, number_of_workers, work_description,
                start_date, end_date, total_amount_lkr, advance_amount_lkr
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [customer_id, service_id, number_of_workers, work_description, start_date, end_date, total_amount_lkr, advance_amount_lkr]);

        console.log('Booking inserted successfully, ID:', result.insertId);

        const booking_id = result.insertId;

        // TODO: Auto-assign available workers for this service
        // await assignWorkersToBooking(booking_id, service_id, number_of_workers);

        res.status(201).json({
            message: 'Booking created successfully',
            booking_id: booking_id
        });
    } catch (err) {
        console.error('Booking creation error:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ error: err.message });
    }
});

// Function to assign real workers to booking
async function assignWorkersToBooking(booking_id, service_id, number_of_workers) {
    try {
        // Find available workers for this service
        const [availableWorkers] = await db.query(`
            SELECT u.user_id, u.first_name, u.last_name
            FROM users u
            JOIN worker_profiles wp ON u.user_id = wp.user_id
            WHERE u.user_type = 'worker'
            AND wp.service_id = ?
            AND wp.is_available = 1
            AND u.user_id NOT IN (
                SELECT bw.worker_id
                FROM booking_workers bw
                JOIN bookings b ON bw.booking_id = b.booking_id
                WHERE b.booking_status IN ('assigned', 'in_progress')
                AND (
                    (b.start_date <= (SELECT end_date FROM bookings WHERE booking_id = ?))
                    AND (b.end_date >= (SELECT start_date FROM bookings WHERE booking_id = ?))
                )
            )
            LIMIT ?
        `, [service_id, booking_id, booking_id, number_of_workers]);

        // Assign workers to booking
        for (const worker of availableWorkers) {
            await db.query(`
                INSERT INTO booking_workers (booking_id, worker_id)
                VALUES (?, ?)
            `, [booking_id, worker.user_id]);
        }

        // Update booking status to 'assigned' if workers were assigned
        if (availableWorkers.length > 0) {
            await db.query(`
                UPDATE bookings SET booking_status = 'assigned'
                WHERE booking_id = ?
            `, [booking_id]);
        }

        return availableWorkers.length;
    } catch (err) {
        console.error('Worker assignment error:', err);
        throw err;
    }
}

// Get customer's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
    const customer_id = req.user.id;

    try {
        const [bookings] = await db.query(`
            SELECT
                b.*,
                s.service_name,
                GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') as assigned_workers
            FROM bookings b
            JOIN services s ON b.service_id = s.service_id
            LEFT JOIN booking_workers bw ON b.booking_id = bw.booking_id
            LEFT JOIN users u ON bw.worker_id = u.user_id
            WHERE b.customer_id = ?
            GROUP BY b.booking_id
            ORDER BY b.created_at DESC
        `, [customer_id]);

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all bookings (admin only)
router.get('/', authenticateToken, async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    try {
        const [bookings] = await db.query(`
            SELECT
                b.*,
                s.service_name,
                u.first_name as customer_first_name,
                u.last_name as customer_last_name,
                GROUP_CONCAT(CONCAT(wu.first_name, ' ', wu.last_name) SEPARATOR ', ') as assigned_workers
            FROM bookings b
            JOIN services s ON b.service_id = s.service_id
            JOIN users u ON b.customer_id = u.user_id
            LEFT JOIN booking_workers bw ON b.booking_id = bw.booking_id
            LEFT JOIN users wu ON bw.worker_id = wu.user_id
            GROUP BY b.booking_id
            ORDER BY b.created_at DESC
        `);

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign workers to a booking (admin only)
router.put('/:bookingId/assign-workers', authenticateToken, async (req, res) => {
    const { bookingId } = req.params;
    const { workerIds } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    if (!Array.isArray(workerIds) || workerIds.length === 0) {
        return res.status(400).json({ error: 'workerIds must be a non-empty array' });
    }

    try {
        // Check if booking exists and is in pending/confirmed status
        const [bookingCheck] = await db.query(
            'SELECT booking_id, number_of_workers, booking_status FROM bookings WHERE booking_id = ?',
            [bookingId]
        );

        if (bookingCheck.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = bookingCheck[0];

        if (booking.booking_status !== 'pending' && booking.booking_status !== 'confirmed') {
            return res.status(400).json({ error: 'Can only assign workers to pending or confirmed bookings' });
        }

        if (workerIds.length > booking.number_of_workers) {
            return res.status(400).json({
                error: `Cannot assign more than ${booking.number_of_workers} workers to this booking`
            });
        }

        // Check if all workers exist and are actually workers with profiles
        const [workerCheck] = await db.query(
            `SELECT wp.user_id, wp.worker_id FROM worker_profiles wp 
             JOIN users u ON wp.user_id = u.user_id 
             WHERE wp.user_id IN (?) AND u.user_type = ?`,
            [workerIds, 'worker']
        );

        if (workerCheck.length !== workerIds.length) {
            return res.status(400).json({ error: 'One or more workers do not have valid profiles or are not workers' });
        }

        // Get the correct worker_id from worker_profiles (assuming worker_id is the primary key)
        const workerIdMap = {};
        workerCheck.forEach(worker => {
            workerIdMap[worker.user_id] = worker.worker_id || worker.user_id;
        });

        // Remove existing worker assignments for this booking
        await db.query('DELETE FROM booking_workers WHERE booking_id = ?', [bookingId]);

        // Insert new worker assignments using the correct worker_id from worker_profiles
        const workerAssignments = workerIds.map(workerId => [bookingId, workerIdMap[workerId]]);
        await db.query('INSERT INTO booking_workers (booking_id, worker_id) VALUES ?', [workerAssignments]);

        // Update booking status to 'assigned'
        await db.query('UPDATE bookings SET booking_status = ? WHERE booking_id = ?', ['assigned', bookingId]);

        res.json({
            message: `${workerIds.length} worker(s) assigned successfully`,
            assigned_workers: workerIds.length
        });

    } catch (err) {
        console.error('Error assigning workers:', err);
        res.status(500).json({ error: 'Failed to assign workers' });
    }
});

// Update booking status (admin only)
router.put('/:bookingId/status', authenticateToken, async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    }

    try {
        // Check if booking exists
        const [bookingCheck] = await db.query(
            'SELECT booking_id, booking_status FROM bookings WHERE booking_id = ?',
            [bookingId]
        );

        if (bookingCheck.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = bookingCheck[0];

        // Update booking status
        await db.query('UPDATE bookings SET booking_status = ?, updated_at = NOW() WHERE booking_id = ?', [status, bookingId]);

        res.json({
            message: `Booking status updated to ${status}`,
            booking_id: bookingId,
            status: status
        });

    } catch (err) {
        console.error('Error updating booking status:', err);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

module.exports = router;