// adminRoutes.js
const express = require('express');
const Employee = require('./models/Employee'); // Adjust the import path based on your directory structure
const { verifyToken } = require('./authMiddleware'); // Import your middleware

const router = express.Router();

// Fetch admin information endpoint
router.get('/api/admin/info', verifyToken, async (req, res) => {
  try {
    const admin = await Employee.findById(req.userId, 'name'); // Fetch admin by ID
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json({ name: admin.name });
  } catch (err) {
    console.error('Error fetching admin info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
