const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authmiddleware");

// Get all daycares (protected)
router.get("/", authenticateToken, (req, res) => {
    if (req.user.role !== "daycare" && req.user.role !== "admin") 
        return res.status(403).json({ message: "Forbidden" });

    // only expose non-sensitive fields
    db.query(
        "SELECT id, name, email, phone, address, capacity, age_range, price, is_active, has_activities, is_verified FROM Daycares",
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// Get a single daycare by id
router.get("/:id", authenticateToken, (req, res) => {
    const { id } = req.params;

    // parents can only view active daycares
    const sql = "SELECT id, name, email, phone, address, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, is_active, has_activities, is_verified FROM Daycares WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "Daycare not found" });
        const daycare = results[0];

        if (req.user.role === "parent" && !daycare.is_active)
            return res.status(403).json({ message: "This daycare is not active" });

        res.json(daycare);
    });
});

// Update a daycare (daycare itself or admin)
router.put("/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // only the daycare owner or admin can update
    if (req.user.role === "daycare" && req.user.id != id)
        return res.status(403).json({ message: "Cannot modify another daycare" });
    if (req.user.role !== "daycare" && req.user.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

    const allowedFields = [
        "name",
        "phone",
        "address",
        "lat",
        "lon",
        "capacity",
        "age_range",
        "price",
        "education_info",
        "healthcare_info",
        "social_media",
        "profile_image",
        "is_active",
        "has_activities"
    ];

    const setParts = [];
    const values = [];
    for (let key in updates) {
        if (allowedFields.includes(key)) {
            setParts.push(`${key} = ?`);
            values.push(updates[key]);
        }
    }

    if (setParts.length === 0)
        return res.status(400).json({ message: "No valid fields to update" });

    const sql = `UPDATE Daycares SET ${setParts.join(", ")} WHERE id = ?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Daycare updated successfully" });
    });
});

module.exports = router