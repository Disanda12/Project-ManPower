const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/* ===================== PUBLIC ===================== */

// Get all available services (public)
router.get('/available', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT service_id, service_name, description, daily_rate_lkr, advance_percentage
             FROM services
             WHERE is_available = TRUE`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

/* ===================== ADMIN ===================== */

// Get all services
router.get('/', async (req, res) => {
    try {
        const [services] = await db.query(
            'SELECT * FROM services ORDER BY service_name'
        );
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new service (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const {
        service_name,
        description,
        daily_rate_lkr,
        advance_percentage,
        is_available
    } = req.body;

    if (!service_name || !daily_rate_lkr) {
        return res
            .status(400)
            .json({ message: 'Service name and daily rate are required' });
    }

    try {
        const [existing] = await db.query(
            'SELECT 1 FROM services WHERE service_name = ?',
            [service_name]
        );

        if (existing.length > 0) {
            return res
                .status(400)
                .json({ message: 'Service name already exists' });
        }

        const [result] = await db.query(
            `INSERT INTO services
             (service_name, description, daily_rate_lkr, advance_percentage, is_available)
             VALUES (?, ?, ?, ?, ?)`,
            [
                service_name,
                description || null,
                parseFloat(daily_rate_lkr),
                advance_percentage ? parseFloat(advance_percentage) : 25.0,
                is_available !== undefined ? is_available : true
            ]
        );

        res.status(201).json({
            message: 'Service created successfully!',
            service_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update service (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const {
        service_name,
        description,
        daily_rate_lkr,
        advance_percentage,
        is_available
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE services SET
                service_name = ?,
                description = ?,
                daily_rate_lkr = ?,
                advance_percentage = ?,
                is_available = ?
             WHERE service_id = ?`,
            [
                service_name,
                description || null,
                parseFloat(daily_rate_lkr),
                parseFloat(advance_percentage),
                is_available,
                parseInt(id)
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service updated successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete service (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const [[workers]] = await db.query(
            'SELECT COUNT(*) AS count FROM worker_profiles WHERE service_id = ?',
            [id]
        );
        const [[bookings]] = await db.query(
            'SELECT COUNT(*) AS count FROM bookings WHERE service_id = ?',
            [id]
        );

        if (workers.count > 0 || bookings.count > 0) {
            return res.status(400).json({
                message:
                    'Cannot delete service assigned to workers or with bookings'
            });
        }

        const [result] = await db.query(
            'DELETE FROM services WHERE service_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
