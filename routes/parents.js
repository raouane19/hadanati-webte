// routes/parents.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authmiddleware");

// Get all parents (protected)
router.get("/", authenticateToken, (req, res) => {
    if (req.user.role !== "parent" && req.user.role !== "admin") 
        return res.status(403).json({ message: "Forbidden" });

    db.query("SELECT id, first_name, last_name, email, phone FROM Parents", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;