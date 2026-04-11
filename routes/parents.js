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


// Helper: compute age from birth_date (YYYY-MM-DD)
function computeAgeFromBirthDate(birth_date) {
    if (!birth_date) return null;
    const birth = new Date(birth_date);
    if (isNaN(birth)) return null;
    const diffMs = Date.now() - birth.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

// Add a child for a parent (protected)
router.post("/:parentId/children", authenticateToken, (req, res) => {
    const requestedParentId = parseInt(req.params.parentId, 10);
    const { name, age, birth_date, gender, medical_issues } = req.body;

    // Determine the actual parentId: parent role always uses token ID
    const parentId = req.user.role === "parent" ? req.user.id : requestedParentId;

    // Role-based checks
    if (req.user.role === "parent") {
        if (isNaN(requestedParentId) || requestedParentId <= 0 || requestedParentId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Cannot add child for another parent" });
        }
    } else {
        // Admin must provide a valid parentId
        if (isNaN(parentId) || parentId <= 0) {
            return res.status(400).json({ message: "Invalid parentId" });
        }
    }

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "Missing or invalid required field: name" });
    }

    // Compute final age safely
    let finalAge;
    if (birth_date) {
        finalAge = computeAgeFromBirthDate(birth_date);
        if (finalAge === null || finalAge < 0) {
            return res.status(400).json({ message: "Invalid birth_date" });
        }
    } else if (age !== undefined && age !== null) {
        finalAge = parseInt(age, 10);
        if (isNaN(finalAge) || finalAge < 0) {
            return res.status(400).json({ message: "Invalid age" });
        }
    } else {
        return res.status(400).json({ message: "Missing age or birth_date" });
    }

    // Insert child into database
    const sql = `
        INSERT INTO Children (parent_id, name, age, birth_date, gender, medical_issues)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [parentId, name.trim(), finalAge, birth_date || null, gender || null, medical_issues || null],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({
                message: "Child added successfully",
                child: {
                    id: result.insertId,
                    parent_id: parentId,
                    name: name.trim(),
                    age: finalAge,
                    birth_date: birth_date || null,
                    gender: gender || null,
                    medical_issues: medical_issues || null,
                }
            });
        }
    );
});



// Update parent profile (parents can update their own; admin can update any)
router.put("/profile", authenticateToken, (req, res) => {
    if (req.user.role !== "parent" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }

    const parentId = req.user.role === "parent" ? req.user.id : req.body.parent_id;
    const { first_name, last_name, phone, lat, lon } = req.body;

    if (req.user.role === "admin" && (!parentId || Number.isNaN(parseInt(parentId, 10)))) {
        return res.status(400).json({ message: "Missing or invalid parent_id" });
    }

    const fields = [];
    const values = [];

    if (first_name) {
        fields.push("first_name = ?");
        values.push(first_name);
    }
    if (last_name) {
        fields.push("last_name = ?");
        values.push(last_name);
    }
    if (phone) {
        fields.push("phone = ?");
        values.push(phone);
    }
    if (lat !== undefined) {
        fields.push("lat = ?");
        values.push(lat);
    }
    if (lon !== undefined) {
        fields.push("lon = ?");
        values.push(lon);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "No updatable fields provided" });
    }

    values.push(parentId);
    const sql = `UPDATE Parents SET ${fields.join(", ")} WHERE id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Profile updated successfully" });
    });
});

// Get a parent's children (protected)
router.get("/:parentId/children", authenticateToken, (req, res) => {
    const requestedParentId = parseInt(req.params.parentId, 10);

    if (req.user.role === "parent" && (Number.isNaN(requestedParentId) || requestedParentId !== req.user.id)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const parentId = req.user.role === "parent" ? req.user.id : requestedParentId;
    if (Number.isNaN(parentId) || parentId <= 0) {
        return res.status(400).json({ message: "Invalid parentId" });
    }

    const sql = "SELECT id, name, age, birth_date, gender, medical_issues FROM Children WHERE parent_id = ?";
    db.query(sql, [parentId], (err, results) => {
        if (err) return res.status(500).json(err);

        const children = results.map((child) => {
            const computedAge = child.birth_date ? computeAgeFromBirthDate(child.birth_date) : child.age;
            return {
                ...child,
                age: computedAge,
            };
        });
        res.json(children);
    });
});

// Update an existing child (parents can update their own; admin can update any)
router.put("/:parentId/children/:childId", authenticateToken, (req, res) => {
    const requestedParentId = parseInt(req.params.parentId, 10);
    const childId = parseInt(req.params.childId, 10);
    const { name, age, birth_date, gender, medical_issues } = req.body;

    // Parent role must match token
    if (req.user.role === "parent") {
        if (Number.isNaN(requestedParentId) || requestedParentId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
    }

    const parentId = req.user.role === "parent" ? req.user.id : requestedParentId;

    if (Number.isNaN(parentId) || parentId <= 0 || Number.isNaN(childId) || childId <= 0) {
        return res.status(400).json({ message: "Invalid parentId or childId" });
    }

    const fields = [];
    const values = [];

    if (name) {
        fields.push("name = ?");
        values.push(name);
    }
    let computedAge;
    if (birth_date !== undefined) {
        computedAge = computeAgeFromBirthDate(birth_date);
        if (computedAge === null || computedAge < 0) {
            return res.status(400).json({ message: "Invalid birth_date" });
        }
        fields.push("birth_date = ?");
        values.push(birth_date);
        fields.push("age = ?");
        values.push(computedAge);
    } else if (age !== undefined) {
        fields.push("age = ?");
        values.push(age);
    }

    if (gender !== undefined) {
        fields.push("gender = ?");
        values.push(gender);
    }
    if (medical_issues !== undefined) {
        fields.push("medical_issues = ?");
        values.push(medical_issues);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "No updatable fields provided" });
    }

    values.push(parentId, childId);
    const sql = `UPDATE Children SET ${fields.join(", ")} WHERE id = ? AND parent_id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Child not found or does not belong to this parent" });
        }
    });
});
// routes/parents.js
router.get("/search-daycares", authenticateToken, (req, res) => {
    if (req.user.role !== "parent") {
        return res.status(403).json({ message: "Forbidden: Only parents can search daycares" });
    }

    const {
        name,
        lat_min, lat_max,
        lon_min, lon_max,
        capacity_min, capacity_max,
        age_range,
        price_min, price_max,
        education_info,
        healthcare_info,
        has_activities
    } = req.query;

    // 🔹 1. Search by NAME only
    if (name) {
        const sql = `
            SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price,
                   education_info, healthcare_info, social_media, profile_image, has_activities
            FROM Daycares
            WHERE is_active = 1 
              AND is_verified = 1
              AND name LIKE ?
        `;
        return db.query(sql, [`%${name}%`], (err, results) => {
            if (err) return res.status(500).json(err);
            return res.json(results);
        });
    }

    // 🔹 2. Search by filters with match_score
    const sql = `
        SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price,
               education_info, healthcare_info, social_media, profile_image, has_activities,
        (
            (lat >= ? OR ? IS NULL) +
            (lat <= ? OR ? IS NULL) +
            (lon >= ? OR ? IS NULL) +
            (lon <= ? OR ? IS NULL) +
            (capacity >= ? OR ? IS NULL) +
            (capacity <= ? OR ? IS NULL) +
            (age_range LIKE ? OR ? IS NULL) +
            (price >= ? OR ? IS NULL) +
            (price <= ? OR ? IS NULL) +
            (education_info LIKE ? OR ? IS NULL) +
            (healthcare_info LIKE ? OR ? IS NULL) +
            (has_activities = ? OR ? IS NULL)
        ) AS match_score
        FROM Daycares
        WHERE is_active = 1 AND is_verified = 1
        ORDER BY match_score DESC
    `;

    const values = [
        lat_min ? parseFloat(lat_min) : null, lat_min ? parseFloat(lat_min) : null,
        lat_max ? parseFloat(lat_max) : null, lat_max ? parseFloat(lat_max) : null,
        lon_min ? parseFloat(lon_min) : null, lon_min ? parseFloat(lon_min) : null,
        lon_max ? parseFloat(lon_max) : null, lon_max ? parseFloat(lon_max) : null,
        capacity_min ? parseInt(capacity_min) : null, capacity_min ? parseInt(capacity_min) : null,
        capacity_max ? parseInt(capacity_max) : null, capacity_max ? parseInt(capacity_max) : null,
        age_range ? `%${age_range}%` : null, age_range ? `%${age_range}%` : null,
        price_min ? parseFloat(price_min) : null, price_min ? parseFloat(price_min) : null,
        price_max ? parseFloat(price_max) : null, price_max ? parseFloat(price_max) : null,
        education_info ? `%${education_info}%` : null, education_info ? `%${education_info}%` : null,
        healthcare_info ? `%${healthcare_info}%` : null, healthcare_info ? `%${healthcare_info}%` : null,
        has_activities !== undefined ? parseInt(has_activities) : null,
        has_activities !== undefined ? parseInt(has_activities) : null
    ];

    db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
// ==================== ADD REVIEW (100% Working) ====================
router.post('/:parentId/review-daycare/:daycareId', authenticateToken, (req, res) => {
    console.log('🔥 Review request - Token ID:', req.user.id);
    
    // 🛡️ Get parent ID (SAME as save)
    const requestedParentId = parseInt(req.params.parentId, 10);
    const parentId = req.user.role === "parent" ? req.user.id : requestedParentId;
    const daycareId = parseInt(req.params.daycareId, 10);
    
    // 📝 Get review data
    const { rating, comment } = req.body;

    console.log('📊 Requested:', requestedParentId, 'Token:', req.user.id, 'Final:', parentId);
    console.log('⭐ Rating:', rating, 'Comment:', comment);

    // 🛡️ Parent security check (SAME as save)
    if (req.user.role === "parent") {
        if (isNaN(requestedParentId) || requestedParentId !== req.user.id) {
            return res.status(403).json({ 
                message: "❌ You can only review for yourself! Use /parents/" + req.user.id + "/review-daycare/..." 
            });
        }
    }

    // 🛑 Validation
    if (isNaN(parentId) || parentId <= 0) {
        return res.status(400).json({ message: "❌ Bad parent ID" });
    }
    if (isNaN(daycareId) || daycareId <= 0) {
        return res.status(400).json({ message: "❌ Bad daycare ID" });
    }
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return res.status(400).json({ message: "❌ Rating must be integer 1-5" });
    }
    
    const trimmedComment = comment ? comment.trim() : null;
    console.log('✅ Review data validated!');

    // 🚫 Check if already reviewed
    db.query(
        'SELECT id FROM Reviews WHERE parent_id = ? AND daycare_id = ?', 
        [parentId, daycareId], 
        (err, results) => {
            if (err) {
                console.error('❌ Check error:', err);
                return res.status(500).json({ message: "Database check failed" });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ 
                    message: "⚠️ You already reviewed this daycare!" 
                });
            }
            
            // ✅ Save review
            const sql = `
                INSERT INTO Reviews (parent_id, daycare_id, rating, comment) 
                VALUES (?, ?, ?, ?)
            `;
            db.query(sql, [parentId, daycareId, rating, trimmedComment], (err, result) => {
                if (err) {
                    console.error('❌ Review error:', err);
                    return res.status(500).json({ message: "Review failed" });
                }
                
                console.log('🎉 Review SAVED! ID:', result.insertId);
                res.status(201).json({
                    message: "✅ Review saved!",
                    reviewId: result.insertId,
                    parentId: parentId,
                    daycareId: daycareId,
                    rating: rating
                });
            });
        }
    );
});
// ==================== SAVE DAYCARE (100% Working) ====================
router.post('/:parentId/save-daycare/:daycareId', authenticateToken, (req, res) => {
    console.log('🔥 Save request - Token ID:', req.user.id);
    
    // 🛡️ Get parent ID (exact copy from your children route)
    const requestedParentId = parseInt(req.params.parentId, 10);
    const parentId = req.user.role === "parent" ? req.user.id : requestedParentId;
    const daycareId = parseInt(req.params.daycareId, 10);

    console.log('📊 Requested:', requestedParentId, 'Token:', req.user.id, 'Final:', parentId);

    // 🛡️ Parent security check (exact copy from children)
    if (req.user.role === "parent") {
        if (isNaN(requestedParentId) || requestedParentId !== req.user.id) {
            return res.status(403).json({ 
                message: "❌ You can only save for yourself! Use /parents/" + req.user.id + "/save-daycare/..." 
            });
        }
    }

    // 🛑 Basic validation
    if (isNaN(parentId) || parentId <= 0) {
        return res.status(400).json({ message: "❌ Bad parent ID" });
    }
    if (isNaN(daycareId) || daycareId <= 0) {
        return res.status(400).json({ message: "❌ Bad daycare ID" });
    }
    
    console.log('✅ Data validated!');

    // 🚫 Check if already saved
    db.query(
        'SELECT id FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?', 
        [parentId, daycareId], 
        (err, results) => {
            if (err) {
                console.error('❌ Check error:', err);
                return res.status(500).json({ message: "Database check failed" });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ 
                    message: "⚠️ Already saved this daycare!" 
                });
            }
            
            // ✅ Save to database
            const sql = `
                INSERT INTO Saved_Daycares (parent_id, daycare_id) 
                VALUES (?, ?)
            `;
            db.query(sql, [parentId, daycareId], (err, result) => {
                if (err) {
                    console.error('❌ Save error:', err);
                    return res.status(500).json({ message: "Save failed" });
                }
                
                console.log('🎉 Daycare SAVED! ID:', result.insertId);
                res.status(201).json({
                    message: "✅ Daycare saved to favorites!",
                    savedId: result.insertId,
                    parentId: parentId,
                    daycareId: daycareId
                });
            });
        }
    );
});


router.delete("/:parentId/delete", authenticateToken, (req,res)=>{
    const requestedParentId = parseInt(req.params.parentId, 10);
    const parentId = req.user.role === "parent" ? req.user.id : requestedParentId;
    if (req.user.role === "parent" && parentId !== req.user.id) {
        return res.status(403).json({
            message:"Forbidden"
        })
    }
    const sql = "DELETE FROM Parents WHERE id = ?"
;
db.query(sql, [parentId],(err, result)=>{
    if (err){
        console.error("Error deleting parent:", err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
    if (result.affectedRows === 0){
        return res.status(404).json({
            message:"Parent not found"
        })
    }
    res.json({
        message:"Parent deleted successfully"
    })

})})

module.exports = router;