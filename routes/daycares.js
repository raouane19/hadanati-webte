const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protectDaycare, protectAdmin } = require("../middleware/authMiddleware");

// ==================== GET MY DAYCARE PROFILE ====================
router.get("/profile/me", protectDaycare, async (req, res) => {
    try {
        const [daycares] = await db.query(
            "SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, is_active, has_activities, is_verified FROM Daycares WHERE id = ?",
            [req.daycare.id]
        );
        res.json({ success: true, data: daycares[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== UPDATE MY DAYCARE PROFILE ====================
router.put("/profile/me", protectDaycare, async (req, res) => {
    try {
        const { 
            name, phone, address, lat, lon, capacity, 
            age_range, price, education_info, healthcare_info, 
            social_media, profile_image 
        } = req.body;

        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push("name = ?");
            values.push(name);
        }
        if (phone !== undefined) {
            updates.push("phone = ?");
            values.push(phone);
        }
        if (address !== undefined) {
            updates.push("address = ?");
            values.push(address);
        }
        if (lat !== undefined) {
            updates.push("lat = ?");
            values.push(lat);
        }
        if (lon !== undefined) {
            updates.push("lon = ?");
            values.push(lon);
        }
        if (capacity !== undefined) {
            updates.push("capacity = ?");
            values.push(capacity);
        }
        if (age_range !== undefined) {
            updates.push("age_range = ?");
            values.push(age_range);
        }
        if (price !== undefined) {
            updates.push("price = ?");
            values.push(price);
        }
        if (education_info !== undefined) {
            updates.push("education_info = ?");
            values.push(education_info);
        }
        if (healthcare_info !== undefined) {
            updates.push("healthcare_info = ?");
            values.push(healthcare_info);
        }
        if (social_media !== undefined) {
            updates.push("social_media = ?");
            values.push(social_media);
        }
        if (profile_image !== undefined) {
            updates.push("profile_image = ?");
            values.push(profile_image);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        values.push(req.daycare.id);
        await db.query(`UPDATE Daycares SET ${updates.join(", ")} WHERE id = ?`, values);

        const [updated] = await db.query(
            "SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, is_active, has_activities FROM Daycares WHERE id = ?",
            [req.daycare.id]
        );

        res.json({ success: true, message: "Profile updated successfully", data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET ALL DAYCARES (PUBLIC - ACTIVE ONLY) ====================
router.get("/", async (req, res) => {
    try {
        const [daycares] = await db.query(
            "SELECT id, name, email, phone, address, capacity, age_range, price, profile_image, has_activities FROM Daycares WHERE is_active = 1 AND is_verified = 1 ORDER BY name ASC"
        );
        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET SINGLE DAYCARE (PUBLIC) ====================
router.get("/:id", async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [daycares] = await db.query(
            "SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, has_activities FROM Daycares WHERE id = ? AND is_active = 1 AND is_verified = 1",
            [daycareId]
        );

        if (daycares.length === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        // Get average rating
        const [rating] = await db.query(
            "SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?",
            [daycareId]
        );

        // Get activities
        const [activities] = await db.query(
            "SELECT id, name, description, schedule, age_range, capacity FROM Activities WHERE daycare_id = ?",
            [daycareId]
        );

        res.json({
            success: true,
            data: {
                ...daycares[0],
                rating: {
                    average: parseFloat(rating[0].average) || 0,
                    total: rating[0].total
                },
                activities
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET DAYCARE RATING ONLY ====================
router.get("/:id/rating", async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [rows] = await db.query(
            "SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?",
            [daycareId]
        );

        res.json({
            success: true,
            average: parseFloat(rows[0].average) || 0,
            total_reviews: rows[0].total
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET DAYCARE ACTIVITIES (PUBLIC) ====================
router.get("/:id/activities", async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [activities] = await db.query(
            "SELECT id, name, description, schedule, age_range, capacity FROM Activities WHERE daycare_id = ? ORDER BY name ASC",
            [daycareId]
        );

        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET DAYCARE REVIEWS (PUBLIC) ====================
router.get("/:id/reviews", async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [reviews] = await db.query(`
            SELECT r.*, p.first_name, p.last_name
            FROM Reviews r
            JOIN Parents p ON r.parent_id = p.id
            WHERE r.daycare_id = ?
            ORDER BY r.review_date DESC
        `, [daycareId]);

        res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET NEARBY DAYCARES ====================
router.get("/nearby/search", async (req, res) => {
    try {
        const { lat, lon, radius = 10 } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
        }

        const [daycares] = await db.query(`
            SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, profile_image,
            (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance
            FROM Daycares 
            WHERE is_active = 1 AND is_verified = 1 AND lat IS NOT NULL AND lon IS NOT NULL
            HAVING distance < ?
            ORDER BY distance ASC
        `, [lat, lon, lat, radius]);

        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET MY REQUESTS (DAYCARE OWNER) ====================
router.get("/my-requests", protectDaycare, async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, 
                   p.first_name, p.last_name, p.email, p.phone,
                   c.name as child_name, c.age as child_age, c.gender as child_gender
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            WHERE r.daycare_id = ?
            ORDER BY r.request_date DESC
        `, [req.daycare.id]);

        res.json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== UPDATE REQUEST STATUS (ACCEPT/REJECT) ====================
router.put("/requests/:requestId/:status", protectDaycare, async (req, res) => {
    try {
        const requestId = parseInt(req.params.requestId, 10);
        const { status } = req.params;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Use 'accepted' or 'rejected'" });
        }

        // Check if request belongs to this daycare
        const [request] = await db.query(
            "SELECT id FROM Requests WHERE id = ? AND daycare_id = ?",
            [requestId, req.daycare.id]
        );

        if (request.length === 0) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        await db.query("UPDATE Requests SET status = ? WHERE id = ?", [status, requestId]);

        res.json({ success: true, message: `Request ${status} successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET MY ACTIVITIES (DAYCARE OWNER) ====================
router.get("/my-activities", protectDaycare, async (req, res) => {
    try {
        const [activities] = await db.query(
            "SELECT id, name, description, schedule, age_range, capacity FROM Activities WHERE daycare_id = ? ORDER BY name ASC",
            [req.daycare.id]
        );

        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== CREATE ACTIVITY ====================
router.post("/my-activities", protectDaycare, async (req, res) => {
    try {
        const { name, description, schedule, age_range, capacity } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Activity name is required" });
        }

        const [result] = await db.query(
            "INSERT INTO Activities (daycare_id, name, description, schedule, age_range, capacity) VALUES (?, ?, ?, ?, ?, ?)",
            [req.daycare.id, name.trim(), description || null, schedule || null, age_range || null, capacity || null]
        );

        // Update has_activities flag
        await db.query("UPDATE Daycares SET has_activities = 1 WHERE id = ?", [req.daycare.id]);

        const [newActivity] = await db.query("SELECT * FROM Activities WHERE id = ?", [result.insertId]);

        res.status(201).json({ success: true, message: "Activity created successfully", data: newActivity[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== UPDATE ACTIVITY ====================
router.put("/my-activities/:activityId", protectDaycare, async (req, res) => {
    try {
        const activityId = parseInt(req.params.activityId, 10);
        const { name, description, schedule, age_range, capacity } = req.body;

        // Check if activity belongs to this daycare
        const [activity] = await db.query(
            "SELECT id FROM Activities WHERE id = ? AND daycare_id = ?",
            [activityId, req.daycare.id]
        );

        if (activity.length === 0) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push("name = ?");
            values.push(name);
        }
        if (description !== undefined) {
            updates.push("description = ?");
            values.push(description);
        }
        if (schedule !== undefined) {
            updates.push("schedule = ?");
            values.push(schedule);
        }
        if (age_range !== undefined) {
            updates.push("age_range = ?");
            values.push(age_range);
        }
        if (capacity !== undefined) {
            updates.push("capacity = ?");
            values.push(capacity);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        values.push(activityId);
        await db.query(`UPDATE Activities SET ${updates.join(", ")} WHERE id = ?`, values);

        const [updated] = await db.query("SELECT * FROM Activities WHERE id = ?", [activityId]);

        res.json({ success: true, message: "Activity updated successfully", data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== DELETE ACTIVITY ====================
router.delete("/my-activities/:activityId", protectDaycare, async (req, res) => {
    try {
        const activityId = parseInt(req.params.activityId, 10);

        const [result] = await db.query("DELETE FROM Activities WHERE id = ? AND daycare_id = ?", [activityId, req.daycare.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Check if daycare has any remaining activities
        const [remaining] = await db.query("SELECT COUNT(*) as count FROM Activities WHERE daycare_id = ?", [req.daycare.id]);

        if (remaining[0].count === 0) {
            await db.query("UPDATE Daycares SET has_activities = 0 WHERE id = ?", [req.daycare.id]);
        }

        res.json({ success: true, message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== GET MY REVIEWS (DAYCARE OWNER) ====================
router.get("/my-reviews", protectDaycare, async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, p.first_name, p.last_name, p.Profile_image as parent_image
            FROM Reviews r
            JOIN Parents p ON r.parent_id = p.id
            WHERE r.daycare_id = ?
            ORDER BY r.review_date DESC
        `, [req.daycare.id]);

        // Get average rating
        const [rating] = await db.query(
            "SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?",
            [req.daycare.id]
        );

        res.json({
            success: true,
            data: reviews,
            stats: {
                average: parseFloat(rating[0].average) || 0,
                total: rating[0].total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADMIN: GET ALL DAYCARES (FULL ACCESS) ====================
router.get("/admin/all", protectAdmin, async (req, res) => {
    try {
        const [daycares] = await db.query(`
            SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, 
                   education_info, healthcare_info, is_active, is_verified, has_activities, created_at
            FROM Daycares 
            ORDER BY id DESC
        `);
        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADMIN: VERIFY DAYCARE ====================
router.put("/admin/:id/verify", protectAdmin, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [result] = await db.query("UPDATE Daycares SET is_verified = 1, is_active = 1 WHERE id = ?", [daycareId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        res.json({ success: true, message: "Daycare verified successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADMIN: DELETE DAYCARE ====================
router.delete("/admin/:id", protectAdmin, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [result] = await db.query("DELETE FROM Daycares WHERE id = ?", [daycareId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        res.json({ success: true, message: "Daycare deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;