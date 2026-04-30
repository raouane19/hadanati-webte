const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protectAdmin, restrictToSuperAdmin } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

// ==================== DASHBOARD STATISTICS ====================

// Get complete dashboard stats
router.get("/stats/dashboard", protectAdmin, async (req, res) => {
    try {
        const [totalParents] = await db.query("SELECT COUNT(*) as count FROM Parents WHERE is_verified = 1");
        const [totalDaycares] = await db.query("SELECT COUNT(*) as count FROM Daycares WHERE is_verified = 1");
        const [pendingDaycares] = await db.query("SELECT COUNT(*) as count FROM Daycares WHERE is_verified = 0 OR is_active = 0");
        const [totalRequests] = await db.query("SELECT COUNT(*) as count FROM Requests");
        const [pendingRequests] = await db.query("SELECT COUNT(*) as count FROM Requests WHERE status = 'pending'");
        const [totalReviews] = await db.query("SELECT COUNT(*) as count FROM Reviews");
        const [avgRating] = await db.query("SELECT AVG(rating) as average FROM Reviews");
        const [totalChildren] = await db.query("SELECT COUNT(*) as count FROM Children");

        res.json({
            success: true,
            data: {
                parents: totalParents[0].count,
                daycares: {
                    total: totalDaycares[0].count,
                    pending: pendingDaycares[0].count
                },
                children: totalChildren[0].count,
                requests: {
                    total: totalRequests[0].count,
                    pending: pendingRequests[0].count
                },
                reviews: {
                    total: totalReviews[0].count,
                    average_rating: parseFloat(avgRating[0].average) || 0
                }
            }
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get daycare statistics
router.get("/stats/daycares", protectAdmin, async (req, res) => {
    try {
        const [total] = await db.query("SELECT COUNT(*) as count FROM Daycares");
        const [active] = await db.query("SELECT COUNT(*) as count FROM Daycares WHERE is_active = 1");
        const [verified] = await db.query("SELECT COUNT(*) as count FROM Daycares WHERE is_verified = 1");
        const [pending] = await db.query("SELECT COUNT(*) as count FROM Daycares WHERE is_verified = 0 OR is_active = 0");

        res.json({
            success: true,
            data: {
                total: total[0].count,
                active: active[0].count,
                verified: verified[0].count,
                pending: pending[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get parent statistics
router.get("/stats/parents", protectAdmin, async (req, res) => {
    try {
        const [total] = await db.query("SELECT COUNT(*) as count FROM Parents");
        const [verified] = await db.query("SELECT COUNT(*) as count FROM Parents WHERE is_verified = 1");

        res.json({
            success: true,
            data: {
                total: total[0].count,
                verified: verified[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get request statistics
router.get("/stats/requests", protectAdmin, async (req, res) => {
    try {
        const [pending] = await db.query("SELECT COUNT(*) as count FROM Requests WHERE status = 'pending'");
        const [accepted] = await db.query("SELECT COUNT(*) as count FROM Requests WHERE status = 'accepted'");
        const [rejected] = await db.query("SELECT COUNT(*) as count FROM Requests WHERE status = 'rejected'");

        res.json({
            success: true,
            data: {
                pending: pending[0].count,
                accepted: accepted[0].count,
                rejected: rejected[0].count,
                total: pending[0].count + accepted[0].count + rejected[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== DAYCARE MANAGEMENT ====================

// Get all daycares (admin view)
router.get("/daycares", protectAdmin, async (req, res) => {
    try {
        const [daycares] = await db.query(`
            SELECT id, name, email, phone, address, capacity, age_range, price, 
                   is_active, is_verified, has_activities, created_at
            FROM Daycares 
            ORDER BY id DESC
        `);
        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get pending daycares (waiting for verification)
router.get("/daycares/pending", protectAdmin, async (req, res) => {
    try {
        const [daycares] = await db.query(`
            SELECT id, name, email, phone, address, capacity, age_range, price, 
                   education_info, healthcare_info, created_at
            FROM Daycares 
            WHERE is_verified = 0 OR is_active = 0
            ORDER BY id ASC
        `);
        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single daycare details (admin view)
router.get("/daycares/:id", protectAdmin, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);
        
        const [daycares] = await db.query("SELECT * FROM Daycares WHERE id = ?", [daycareId]);
        if (daycares.length === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        // Get review stats
        const [reviews] = await db.query(
            "SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?",
            [daycareId]
        );

        res.json({
            success: true,
            data: {
                ...daycares[0],
                rating: {
                    average: parseFloat(reviews[0].average) || 0,
                    total: reviews[0].total
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Verify a daycare (approve)
router.put("/daycares/:id/verify", protectAdmin, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [result] = await db.query(
            "UPDATE Daycares SET is_verified = 1, is_active = 1 WHERE id = ?",
            [daycareId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        res.json({ success: true, message: "Daycare verified successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Activate a daycare
router.put("/daycares/:id/activate", protectAdmin, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [result] = await db.query("UPDATE Daycares SET is_active = 1 WHERE id = ?", [daycareId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        res.json({ success: true, message: "Daycare activated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Deactivate a daycare
router.put("/daycares/:id/deactivate", protectAdmin, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);

        const [result] = await db.query("UPDATE Daycares SET is_active = 0 WHERE id = ?", [daycareId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        res.json({ success: true, message: "Daycare deactivated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update daycare details (admin)
router.put("/daycares/:id", protectAdmin, async (req, res) => {
    try {
        const daycareId = parseInt(req.params.id, 10);
        const { name, email, phone, address, capacity, age_range, price } = req.body;

        const [result] = await db.query(
            "UPDATE Daycares SET name = ?, email = ?, phone = ?, address = ?, capacity = ?, age_range = ?, price = ? WHERE id = ?",
            [name, email, phone, address, capacity, age_range, price, daycareId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Daycare not found" });
        }

        res.json({ success: true, message: "Daycare updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a daycare (admin)
router.delete("/daycares/:id", protectAdmin, async (req, res) => {
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

// ==================== PARENT MANAGEMENT ====================

// Get all parents (admin view)
router.get("/parents", protectAdmin, async (req, res) => {
    try {
        const [parents] = await db.query(`
            SELECT id, first_name, last_name, email, phone, Profile_image, is_verified, created_at
            FROM Parents 
            ORDER BY id DESC
        `);
        res.json({ success: true, count: parents.length, data: parents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single parent details (admin view)
router.get("/parents/:id", protectAdmin, async (req, res) => {
    try {
        const parentId = parseInt(req.params.id, 10);

        const [parents] = await db.query("SELECT * FROM Parents WHERE id = ?", [parentId]);
        if (parents.length === 0) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        // Get parent's children
        const [children] = await db.query("SELECT id, name, age, gender, medical_issues FROM Children WHERE parent_id = ?", [parentId]);

        // Get parent's requests
        const [requests] = await db.query(`
            SELECT r.*, d.name as daycare_name
            FROM Requests r
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.parent_id = ?
            ORDER BY r.request_date DESC
        `, [parentId]);

        res.json({
            success: true,
            data: {
                ...parents[0],
                children,
                requests
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a parent (admin)
router.delete("/parents/:id", protectAdmin, async (req, res) => {
    try {
        const parentId = parseInt(req.params.id, 10);

        const [result] = await db.query("DELETE FROM Parents WHERE id = ?", [parentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        res.json({ success: true, message: "Parent deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== REQUEST MANAGEMENT ====================

// Get all requests (admin view)
router.get("/requests", protectAdmin, async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, 
                   p.first_name, p.last_name, p.email as parent_email,
                   c.name as child_name,
                   d.name as daycare_name, d.email as daycare_email
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            ORDER BY r.request_date DESC
        `);
        res.json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get pending requests only
router.get("/requests/pending", protectAdmin, async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, 
                   p.first_name, p.last_name, p.email as parent_email,
                   c.name as child_name,
                   d.name as daycare_name
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.status = 'pending'
            ORDER BY r.request_date ASC
        `);
        res.json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single request details (admin)
router.get("/requests/:id", protectAdmin, async (req, res) => {
    try {
        const requestId = parseInt(req.params.id, 10);

        const [requests] = await db.query(`
            SELECT r.*, 
                   p.first_name, p.last_name, p.email as parent_email, p.phone as parent_phone,
                   c.name as child_name, c.age as child_age, c.gender as child_gender,
                   d.name as daycare_name, d.email as daycare_email, d.phone as daycare_phone
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.id = ?
        `, [requestId]);

        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        res.json({ success: true, data: requests[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== REVIEW MANAGEMENT ====================

// Get all reviews (admin view)
router.get("/reviews", protectAdmin, async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, 
                   p.first_name, p.last_name as parent_name,
                   d.name as daycare_name
            FROM Reviews r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Daycares d ON r.daycare_id = d.id
            ORDER BY r.review_date DESC
        `);
        res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a review (admin)
router.delete("/reviews/:id", protectAdmin, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id, 10);

        const [result] = await db.query("DELETE FROM Reviews WHERE id = ?", [reviewId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ACTIVITY MANAGEMENT ====================

// Get all activities (admin view)
router.get("/activities", protectAdmin, async (req, res) => {
    try {
        const [activities] = await db.query(`
            SELECT a.*, d.name as daycare_name
            FROM Activities a
            JOIN Daycares d ON a.daycare_id = d.id
            ORDER BY a.name ASC
        `);
        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete an activity (admin)
router.delete("/activities/:id", protectAdmin, async (req, res) => {
    try {
        const activityId = parseInt(req.params.id, 10);

        const [result] = await db.query("DELETE FROM Activities WHERE id = ?", [activityId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        res.json({ success: true, message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADMIN MANAGEMENT (Super Admin Only) ====================

// Get all admins
router.get("/admins", protectAdmin, restrictToSuperAdmin, async (req, res) => {
    try {
        const [admins] = await db.query("SELECT id, first_name, last_name, email, role, created_at FROM Admins ORDER BY id ASC");
        res.json({ success: true, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single admin
router.get("/admins/:id", protectAdmin, restrictToSuperAdmin, async (req, res) => {
    try {
        const adminId = parseInt(req.params.id, 10);

        const [admins] = await db.query("SELECT id, first_name, last_name, email, role FROM Admins WHERE id = ?", [adminId]);
        if (admins.length === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.json({ success: true, data: admins[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new admin
router.post("/admins", protectAdmin, restrictToSuperAdmin, async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;

        // Check if email exists
        const [existing] = await db.query("SELECT id FROM Admins WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO Admins (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword, role || "moderator"]
        );

        res.status(201).json({ success: true, message: "Admin created successfully", admin_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update admin
router.put("/admins/:id", protectAdmin, restrictToSuperAdmin, async (req, res) => {
    try {
        const adminId = parseInt(req.params.id, 10);
        const { first_name, last_name, email, role } = req.body;

        const [result] = await db.query(
            "UPDATE Admins SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?",
            [first_name, last_name, email, role, adminId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.json({ success: true, message: "Admin updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete admin (cannot delete yourself)
router.delete("/admins/:id", protectAdmin, restrictToSuperAdmin, async (req, res) => {
    try {
        const adminId = parseInt(req.params.id, 10);

        // Prevent deleting yourself
        if (adminId === req.admin.id) {
            return res.status(400).json({ success: false, message: "Cannot delete your own account" });
        }

        // Prevent deleting last superadmin
        const [superAdmins] = await db.query("SELECT COUNT(*) as count FROM Admins WHERE role = 'superadmin'");
        const [admin] = await db.query("SELECT role FROM Admins WHERE id = ?", [adminId]);

        if (admin[0] && admin[0].role === "superadmin" && superAdmins[0].count === 1) {
            return res.status(400).json({ success: false, message: "Cannot delete the last superadmin" });
        }

        const [result] = await db.query("DELETE FROM Admins WHERE id = ?", [adminId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== SYSTEM SETTINGS ====================
router.put("/settings", protectAdmin, restrictToSuperAdmin, async (req, res) => {
    // This is a placeholder for future system settings
    res.json({ success: true, message: "Settings updated successfully" });
});

module.exports = router;