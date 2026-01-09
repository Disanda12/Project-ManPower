const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Create new user (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const { firstName, lastName, email, phone, address, password, user_type, service_id, experience_years, bio, profile_image, is_available } = req.body;
    const serviceIdNum = service_id ? parseInt(service_id, 10) : null;
    const experienceYearsNum = experience_years ? parseInt(experience_years, 10) : 0;
    const isAvailableBool = is_available !== undefined ? is_available : true;

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: "Email taken" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (first_name, last_name, email, phone, address, password_hash, user_type) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const [result] = await db.query(sql, [firstName, lastName, email, phone, address, hashedPassword, user_type]);
        const userId = result.insertId;

        // If creating a worker, also create worker profile
        if (user_type === 'worker') {
            if (!serviceIdNum) {
                return res.status(400).json({ message: "Service ID is required for workers" });
            }
            
            const workerSql = `INSERT INTO worker_profiles (user_id, service_id, experience_years, rating, total_jobs_completed, is_available, bio, profile_image) 
                              VALUES (?, ?, ?, 0.00, 0, ?, ?, ?)`;
            await db.query(workerSql, [userId, serviceIdNum, experienceYearsNum, isAvailableBool, bio || null, profile_image || null]);
        }

        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT 
                u.user_id, u.first_name, u.last_name, u.email, u.phone, u.address, u.user_type,
                wp.service_id, s.service_name
            FROM users u
            LEFT JOIN worker_profiles wp ON u.user_id = wp.user_id
            LEFT JOIN services s ON wp.service_id = s.service_id
            ORDER BY u.user_id
        `);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user role (admin only)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { user_type } = req.body;

    if (!['customer', 'admin', 'worker'].includes(user_type)) {
        return res.status(400).json({ message: 'Invalid user type' });
    }

    try {
        await db.query('UPDATE users SET user_type = ? WHERE user_id = ?', [user_type, id]);
        res.json({ message: 'User role updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM users WHERE user_id = ?', [id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;