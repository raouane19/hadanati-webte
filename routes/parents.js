const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Fixed path
const { protectParent, protectAdmin } = require("../middleware/authMiddleware");

// Helper: compute age from birth_date (YYYY-MM-DD)
function computeAgeFromBirthDate(birth_date) {
    if (!birth_date) return null;
    const birth = new Date(birth_date);
    if (isNaN(birth)) return null;
    const diffMs = Date.now() - birth.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

// ==================== GET PARENT PROFILE (Own) ====================
router.get("/profile/me", protectParent, async (req, res) => {
    try {
        const [parents] = await db.query(
            "SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents WHERE id = ?",
            [req.parent.id]
        );
        res.json({ success: true, data: parents[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== UPDATE PARENT PROFILE ====================
router.put("/profile/me", protectParent, async (req, res) => {
    try {
        const { first_name, last_name, phone } = req.body;
        const parentId = req.parent.id;

        await db.query(
            "UPDATE Parents SET first_name = ?, last_name = ?, phone = ? WHERE id = ?",
            [first_name || req.parent.first_name, last_name || req.parent.last_name, phone || req.parent.phone, parentId]
        );

        const [updated] = await db.query(
            "SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents WHERE id = ?",
            [parentId]
        );

        res.json({ success: true, message: "Profile updated successfully", data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== DELETE PARENT ACCOUNT ====================
router.delete("/profile/me", protectParent, async (req, res) => {
    try {
        await db.query("DELETE FROM Parents WHERE id = ?", [req.parent.id]);
        res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET MY CHILDREN ====================
router.get("/my-children", protectParent, async (req, res) => {
    try {
        const [children] = await db.query(
            "SELECT id, name, age, gender, medical_issues FROM Children WHERE parent_id = ? ORDER BY age ASC",
            [req.parent.id]
        );
        res.json({ success: true, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADD CHILD ====================
router.post("/my-children", protectParent, async (req, res) => {
    try {
        const { name, age, gender, medical_issues } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Child name is required" });
        }

        let finalAge = age ? parseInt(age, 10) : null;
        if (finalAge && (isNaN(finalAge) || finalAge < 0 || finalAge > 18)) {
            return res.status(400).json({ success: false, message: "Age must be between 0 and 18" });
        }

        const [result] = await db.query(
            "INSERT INTO Children (parent_id, name, age, gender, medical_issues) VALUES (?, ?, ?, ?, ?)",
            [req.parent.id, name.trim(), finalAge, gender || null, medical_issues || null]
        );

        const [newChild] = await db.query("SELECT * FROM Children WHERE id = ?", [result.insertId]);

        res.status(201).json({ success: true, message: "Child added successfully", data: newChild[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== UPDATE CHILD ====================
router.put("/my-children/:childId", protectParent, async (req, res) => {
    try {
        const childId = parseInt(req.params.childId, 10);
        const { name, age, gender, medical_issues } = req.body;

        // Check if child belongs to this parent
        const [child] = await db.query("SELECT id FROM Children WHERE id = ? AND parent_id = ?", [childId, req.parent.id]);
        if (child.length === 0) {
            return res.status(404).json({ success: false, message: "Child not found" });
        }

        const updates = [];
        const values = [];

        if (name) {
            updates.push("name = ?");
            values.push(name.trim());
        }
        if (age !== undefined) {
            updates.push("age = ?");
            values.push(parseInt(age, 10));
        }
        if (gender !== undefined) {
            updates.push("gender = ?");
            values.push(gender);
        }
        if (medical_issues !== undefined) {
            updates.push("medical_issues = ?");
            values.push(medical_issues);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        values.push(childId);
        await db.query(`UPDATE Children SET ${updates.join(", ")} WHERE id = ?`, values);

        const [updated] = await db.query("SELECT * FROM Children WHERE id = ?", [childId]);
        res.json({ success: true, message: "Child updated successfully", data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== DELETE CHILD ====================
router.delete("/my-children/:childId", protectParent, async (req, res) => {
    try {
        const childId = parseInt(req.params.childId, 10);

        // Check for pending requests
        const [requests] = await db.query("SELECT id FROM Requests WHERE child_id = ? AND status = 'pending'", [childId]);
        if (requests.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete child with pending requests" });
        }

        const [result] = await db.query("DELETE FROM Children WHERE id = ? AND parent_id = ?", [childId, req.parent.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Child not found" });
        }

        res.json({ success: true, message: "Child deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== SEARCH DAYCARES ====================
router.get("/search-daycares", protectParent, async (req, res) => {
    try {
        const {
            name,
            lat_min, lat_max,
            lon_min, lon_max,
            capacity_min, capacity_max,
            age_range,
            price_min, price_max,
            has_activities
        } = req.query;

        let sql = `
            SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price,
                   education_info, healthcare_info, social_media, profile_image, has_activities
            FROM Daycares
            WHERE is_active = 1 AND is_verified = 1
        `;
        const values = [];

        if (name) {
            sql += " AND name LIKE ?";
            values.push(`%${name}%`);
        }
        if (lat_min) {
            sql += " AND lat >= ?";
            values.push(parseFloat(lat_min));
        }
        if (lat_max) {
            sql += " AND lat <= ?";
            values.push(parseFloat(lat_max));
        }
        if (lon_min) {
            sql += " AND lon >= ?";
            values.push(parseFloat(lon_min));
        }
        if (lon_max) {
            sql += " AND lon <= ?";
            values.push(parseFloat(lon_max));
        }
        if (capacity_min) {
            sql += " AND capacity >= ?";
            values.push(parseInt(capacity_min));
        }
        if (capacity_max) {
            sql += " AND capacity <= ?";
            values.push(parseInt(capacity_max));
        }
        if (age_range) {
            sql += " AND age_range = ?";
            values.push(age_range);
        }
        if (price_min) {
            sql += " AND price >= ?";
            values.push(parseFloat(price_min));
        }
        if (price_max) {
            sql += " AND price <= ?";
            values.push(parseFloat(price_max));
        }
        if (has_activities !== undefined) {
            sql += " AND has_activities = ?";
            values.push(parseInt(has_activities));
        }

        sql += " ORDER BY name ASC";

        const [results] = await db.query(sql, values);
        res.json({ success: true, count: results.length, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET SAVED DAYCARES ====================
router.get("/saved-daycares", protectParent, async (req, res) => {
    try {
        const [saved] = await db.query(`
            SELECT s.*, d.name, d.address, d.phone, d.price, d.age_range, d.profile_image
            FROM Saved_Daycares s
            JOIN Daycares d ON s.daycare_id = d.id
            WHERE s.parent_id = ?
            ORDER BY s.saved_date DESC
        `, [req.parent.id]);
        res.json({ success: true, data: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== SAVE DAYCARE ====================
router.post("/save-daycare/:daycareId", protectParent, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.daycareId, 10);

        // Check if daycare exists
        const [daycare] = await db.query("SELECT id FROM Daycares WHERE id = ? AND is_active = 1 AND is_verified = 1", [daycareId]);
        if (daycare.length === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        // Check if already saved
        const [existing] = await db.query("SELECT id FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?", [req.parent.id, daycareId]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Daycare already saved" });
        }

        await db.query("INSERT INTO Saved_Daycares (parent_id, daycare_id, saved_date) VALUES (?, ?, NOW())", [req.parent.id, daycareId]);

        res.status(201).json({ success: true, message: "Daycare saved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== REMOVE SAVED DAYCARE ====================
router.delete("/saved-daycares/:daycareId", protectParent, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.daycareId, 10);

        const [result] = await db.query("DELETE FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?", [req.parent.id, daycareId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Saved daycare not found" });
        }

        res.json({ success: true, message: "Daycare removed from saved list" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADD REVIEW ====================
router.post("/review-daycare/:daycareId", protectParent, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.daycareId, 10);
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        // Check if daycare exists
        const [daycare] = await db.query("SELECT id FROM Daycares WHERE id = ?", [daycareId]);
        if (daycare.length === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        // Check if already reviewed
        const [existing] = await db.query("SELECT id FROM Reviews WHERE parent_id = ? AND daycare_id = ?", [req.parent.id, daycareId]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "You have already reviewed this daycare" });
        }

        const [result] = await db.query(
            "INSERT INTO Reviews (parent_id, daycare_id, rating, comment, review_date) VALUES (?, ?, ?, ?, NOW())",
            [req.parent.id, daycareId, rating, comment || null]
        );

        res.status(201).json({ success: true, message: "Review submitted successfully", review_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET MY REVIEWS ====================
router.get("/my-reviews", protectParent, async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, d.name as daycare_name, d.address
            FROM Reviews r
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.parent_id = ?
            ORDER BY r.review_date DESC
        `, [req.parent.id]);
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== UPDATE REVIEW ====================
router.put("/reviews/:reviewId", protectParent, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId, 10);
        const { rating, comment } = req.body;

        // Check if review belongs to this parent
        const [review] = await db.query("SELECT id FROM Reviews WHERE id = ? AND parent_id = ?", [reviewId, req.parent.id]);
        if (review.length === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        await db.query("UPDATE Reviews SET rating = ?, comment = ? WHERE id = ?", [rating, comment || null, reviewId]);

        res.json({ success: true, message: "Review updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== DELETE REVIEW ====================
router.delete("/reviews/:reviewId", protectParent, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId, 10);

        const [result] = await db.query("DELETE FROM Reviews WHERE id = ? AND parent_id = ?", [reviewId, req.parent.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADMIN: GET ALL PARENTS ====================
router.get("/admin/all", protectAdmin, async (req, res) => {
    try {
        const [parents] = await db.query("SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents ORDER BY id DESC");
        res.json({ success: true, count: parents.length, data: parents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADMIN: DELETE ANY PARENT ====================
router.delete("/admin/:parentId", protectAdmin, async (req, res) => {
    try {
        const parentId = parseInt(req.params.parentId, 10);

        const [result] = await db.query("DELETE FROM Parents WHERE id = ?", [parentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        res.json({ success: true, message: "Parent deleted successfully by admin" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;