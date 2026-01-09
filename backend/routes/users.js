const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await db.query('SELECT user_id, first_name, last_name, email, phone, address, user_type FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user role (admin only)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { user_type } = req.body;

    if (!['customer', 'admin'].includes(user_type)) {
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