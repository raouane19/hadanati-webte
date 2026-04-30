const db = require('../config/db');

// @desc    Get saved daycares for logged in parent
// @route   GET /api/saved-daycares
// @access  Private
const getSavedDaycares = async (req, res) => {
    try {
        const [saved] = await db.query(`
            SELECT s.*, d.id as daycare_id, d.name, d.address, d.phone, d.email, d.price, d.age_range, d.capacity, d.profile_image,
            (SELECT AVG(rating) FROM Reviews WHERE daycare_id = d.id) as average_rating
            FROM Saved_Daycares s
            JOIN Daycares d ON s.daycare_id = d.id
            WHERE s.parent_id = ?
            ORDER BY s.saved_date DESC
        `, [req.parent.id]);
        
        res.json({ success: true, count: saved.length, data: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Save a daycare
// @route   POST /api/saved-daycares/:daycareId
// @access  Private
const saveDaycare = async (req, res) => {
    try {
        const daycareId = req.params.daycareId;
        const parentId = req.parent.id;
        
        const [daycare] = await db.query('SELECT id, is_active, is_verified FROM Daycares WHERE id = ?', [daycareId]);
        if (daycare.length === 0) {
            return res.status(404).json({ success: false, message: 'Daycare not found' });
        }
        
        const [existing] = await db.query('SELECT id FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?', [parentId, daycareId]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Daycare already saved' });
        }
        
        await db.query('INSERT INTO Saved_Daycares (parent_id, daycare_id, saved_date) VALUES (?, ?, NOW())', [parentId, daycareId]);
        res.status(201).json({ success: true, message: 'Daycare saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove saved daycare
// @route   DELETE /api/saved-daycares/:daycareId
// @access  Private
const unsaveDaycare = async (req, res) => {
    try {
        const daycareId = req.params.daycareId;
        const parentId = req.parent.id;
        
        const [result] = await db.query('DELETE FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?', [parentId, daycareId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Saved daycare not found' });
        }
        res.json({ success: true, message: 'Daycare removed from saved' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Check if daycare is saved
// @route   GET /api/saved-daycares/check/:daycareId
// @access  Private
const checkSaved = async (req, res) => {
    try {
        const [saved] = await db.query('SELECT id FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?', [req.parent.id, req.params.daycareId]);
        res.json({ success: true, is_saved: saved.length > 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get saved count
// @route   GET /api/saved-daycares/count
// @access  Private
const getSavedCount = async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) as count FROM Saved_Daycares WHERE parent_id = ?', [req.parent.id]);
        res.json({ success: true, count: result[0].count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get most saved daycares (admin)
// @route   GET /api/saved-daycares/most-saved
// @access  Private/Admin
const getMostSavedDaycares = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const [results] = await db.query(`
            SELECT d.id, d.name, d.address, COUNT(s.id) as save_count
            FROM Daycares d
            LEFT JOIN Saved_Daycares s ON d.id = s.daycare_id
            WHERE d.is_active = 1 AND d.is_verified = 1
            GROUP BY d.id
            ORDER BY save_count DESC
            LIMIT ?
        `, [parseInt(limit)]);
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get saved daycare by ID
// @route   GET /api/saved-daycares/:id
// @access  Private
const getSavedDaycareById = async (req, res) => {
    try {
        const [saved] = await db.query(`
            SELECT s.*, d.id as daycare_id, d.name, d.address, d.phone, d.email, d.price, d.age_range, d.capacity, d.education_info, d.healthcare_info, d.profile_image,
            (SELECT AVG(rating) FROM Reviews WHERE daycare_id = d.id) as average_rating
            FROM Saved_Daycares s
            JOIN Daycares d ON s.daycare_id = d.id
            WHERE s.id = ? AND s.parent_id = ?
        `, [req.params.id, req.parent.id]);
        
        if (saved.length === 0) {
            return res.status(404).json({ success: false, message: 'Saved daycare not found' });
        }
        res.json({ success: true, data: saved[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSavedDaycares,
    saveDaycare,
    unsaveDaycare,
    checkSaved,
    getSavedCount,
    getMostSavedDaycares,
    getSavedDaycareById
};