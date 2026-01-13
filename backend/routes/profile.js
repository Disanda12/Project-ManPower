const express = require('express');
const router = express.Router();
const db = require('../db');

const multer = require('multer'); 
const path = require('path'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        // Creates a unique filename: USER-1736682240.jpg
        cb(null, `USER-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage }); // 4. Define the 'upload' variable
// GET: Fetch Profile Details
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        // Query the actual column names in your database
        const sql = `SELECT user_id, first_name, last_name, email, phone, address, profile_image FROM users WHERE user_id = ?`;
        const [rows] = await db.query(sql, [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error", error: err.message });
    }
});

// POST: Update Profile
router.post('/update', upload.single('profile_image'), async (req, res) => {
    const { user_id, first_name, last_name, phone, address } = req.body;
    let imagePath = req.body.existing_image;

    if (req.file) {
        imagePath = `/uploads/profiles/${req.file.filename}`;
    }

    try {
        const sql = `UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ?, profile_image = ? WHERE user_id = ?`;
        await db.query(sql, [first_name, last_name, phone, address, imagePath, user_id]);
        res.status(200).json({ success: true, message: "Profile updated successfully!", image: imagePath });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
});

module.exports = router;