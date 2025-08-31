const express = require("express");
const router = express.Router();
const db = require("../db");

// Login route
router.post("/login", (req, res) => {
    const { code } = req.body;

    const sql = "SELECT * FROM users WHERE code = ?";
    db.query(sql, [code], (err, results) => {
        if (err) return res.status(500).json({ message: "Database Error" });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid code" });
        }

        const user = results[0];

        // Update last visit and monthly count
        const now = new Date();
        const lastVisit = new Date(user.last_visit);
        let monthlyCount = user.monthly_count;

        if (!user.last_visit || now.getMonth() !== lastVisit.getMonth() || now.getFullYear() !== lastVisit.getFullYear()) {
            monthlyCount = 1;
        } else {
            monthlyCount += 1;
        }

        const updateSql = "UPDATE users SET last_visit = ?, monthly_count = ? WHERE id = ?";
        db.query(updateSql, [now, monthlyCount, user.id], (err2) => {
            if (err2) console.error(err2);
        });

        res.json({
            id: user.id,
            name: user.name,
            role: user.role,
            last_visit: now,
            monthly_count: monthlyCount,
        });
    });
});

module.exports = router;
