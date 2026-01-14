const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get notifications for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
    const { notificationId } = req.params;

    try {
        const [result] = await db.query(
            'UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?',
            [notificationId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found or not owned by user' });
        }

        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// Create a notification (internal function)
async function createNotification(userId, title, message, type) {
    try {
        await db.query(
            'INSERT INTO notifications (user_id, title, message, notification_type) VALUES (?, ?, ?, ?)',
            [userId, title, message, type]
        );
        console.log(`Notification created for user ${userId}: ${title}`);
    } catch (err) {
        console.error('Error creating notification:', err);
        throw err;
    }
}

module.exports = { router, createNotification };