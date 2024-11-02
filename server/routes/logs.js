// server/routes/logs.js
const express = require('express');
const router = express.Router();
const db = require('../server');

// POST route to log user activity
router.post('/', (req, res) => {
  const { action, details } = req.body;
  const query = `INSERT INTO logs (action, details) VALUES (?, ?)`;

  db.run(query, [action, details], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Log entry created', id: this.lastID });
  });
});

module.exports = router;
