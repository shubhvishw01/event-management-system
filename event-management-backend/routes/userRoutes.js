const express = require("express");
const router = express.Router();
const db = require("../db");

// GET user stats
router.get("/:id/stats", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT last_visit, monthly_count FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const { last_visit, monthly_count } = results[0];
    res.json({
      lastVisit: last_visit,
      monthlyCount: monthly_count,
    });
  });
});

module.exports = router;
