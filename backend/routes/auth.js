const express = require('express');
const router = express.Router();
const db = require('../db'); // Note the '../' to go up one folder to find db.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SIGN UP ---
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, phone, address, password,user_type } = req.body;

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: "Email taken" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (first_name, last_name, email, phone, address, password_hash, user_type) 
                     VALUES (?, ?, ?, ?, ?, ?,?)`;
        
        await db.query(sql, [firstName, lastName, email, phone, address, hashedPassword,user_type]);
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign(
            { id: user.user_id, role: user.user_type }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.user_type, name: user.first_name,user_id:user.user_id });
    } catch (err) {
        res.status(500).json({ error: "Login error" });
    }
});

module.exports = router;