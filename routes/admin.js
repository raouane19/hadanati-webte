const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authmiddleware");

// ensure only admins can access these routes
function requireAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}

router.use(authenticateToken);
router.use(requireAdmin);

// list all daycares, with optional query filters
router.get("/daycares", (req, res) => {
    const { verified, active } = req.query;
    const clauses = [];
    const values = [];

    if (verified !== undefined) {
        clauses.push("is_verified = ?");
        values.push(verified === "true" ? 1 : 0);
    }
    if (active !== undefined) {
        clauses.push("is_active = ?");
        values.push(active === "true" ? 1 : 0);
    }

    let sql = "SELECT id, name, email, phone, address, capacity, age_range, price, is_active, has_activities, is_verified FROM Daycares";
    if (clauses.length) sql += " WHERE " + clauses.join(" AND ");

    db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// update daycare status fields (activate, verify, activities)
router.put("/daycares/:id", (req, res) => {
    const { id } = req.params;
    const { is_active, is_verified, has_activities } = req.body;

    const fields = [];
    const values = [];
    if (is_active !== undefined) {
        fields.push("is_active = ?");
        values.push(is_active ? 1 : 0);
    }
    if (is_verified !== undefined) {
        fields.push("is_verified = ?");
        values.push(is_verified ? 1 : 0);
    }
    if (has_activities !== undefined) {
        fields.push("has_activities = ?");
        values.push(has_activities ? 1 : 0);
    }

    if (fields.length === 0) return res.status(400).json({ message: "No status fields provided" });

    const sql = `UPDATE Daycares SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Daycare updated" });
    });
});

// list all parents
router.get("/parents", (req, res) => {
    db.query("SELECT id, first_name, last_name, email, phone, is_verified FROM Parents", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;