const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Submit Feedback
router.post('/submit', async (req, res) => {
    const { booking_id, customer_id, rating, comment } = req.body;
   
    try {
        // 1. Removed the extra comma after 'comment'
        // 2. Changed to exactly FOUR '?' to match the four variables
        const sql = `INSERT INTO feedbacks (booking_id, customer_id, rating, comment,status) 
                     VALUES (?, ?, ?, ?, 'pending')`;
        
        await db.query(sql, [
            booking_id, 
            customer_id, 
            rating, 
            comment, 
        ]);

        res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
    } catch (err) {
        console.error("Feedback Error:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Feedback already exists for this booking." });
        }
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

// feedbackController.js or within your routes file
router.get('/approved-feedbacks', async (req, res) => {
  try {
    const query = `
      SELECT 
        f.feedback_id, 
        f.comment, 
        f.rating, 
        u.first_name, 
        u.last_name, 
        u.profile_image 
      FROM feedbacks f
      JOIN users u ON f.customer_id = u.user_id
      WHERE f.status = 'approved'
      ORDER BY f.feedback_id DESC
      LIMIT 5
    `;

    const [rows] = await db.execute(query);
    
    const formattedData = rows.map(row => {
    let imageFileName = row.profile_image;

    // If the DB already has "/uploads/profiles/" in it, remove it to get just the filename
    if (imageFileName && imageFileName.includes('/uploads/profiles/')) {
        imageFileName = imageFileName.replace('/uploads/profiles/', '');
    }

    return {
        feedback_id: row.feedback_id,
        comment: row.comment,
        rating: row.rating,
        customer_name: `${row.first_name} ${row.last_name}`,
        // Now prepend the path ONLY once
        profile_picture: imageFileName 
            ? `http://localhost:5000/uploads/profiles/${imageFileName}` 
            : `https://ui-avatars.com/api/?name=${row.first_name}+${row.last_name}`
    };
});

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
});

// GET: Get all feedbacks for admin moderation
router.get('/admin/all', async (req, res) => {
  try {
    const query = `
      SELECT 
        f.feedback_id, 
        f.comment, 
        f.rating, 
        f.status,
        f.submitted_at,
        u.first_name, 
        u.last_name, 
        s.service_name as service
      FROM feedbacks f
      JOIN users u ON f.customer_id = u.user_id
      JOIN bookings b ON f.booking_id = b.booking_id
      JOIN services s ON b.service_id = s.service_id
      ORDER BY f.submitted_at DESC
    `;

    const [rows] = await db.execute(query);

    const formattedData = rows.map(row => ({
      id: row.feedback_id,
      customer: `${row.first_name} ${row.last_name}`,
      rating: row.rating,
      comment: row.comment,
      date: row.submitted_at.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      service: row.service,
      status: row.status
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
});

// PATCH: Update feedback status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'reject', 'pending'].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Must be 'approved', 'reject', or 'pending'" });
  }

  try {
    const sql = `UPDATE feedbacks SET status = ? WHERE feedback_id = ?`;
    const [result] = await db.execute(sql, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ success: true, message: "Feedback status updated successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to update feedback status" });
  }
});

module.exports = router;