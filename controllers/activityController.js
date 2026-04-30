const db = require('../config/db');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
const getAllActivities = async (req, res) => {
    try {
        const [activities] = await db.query(`
            SELECT a.*, d.name as daycare_name, d.address as daycare_address
            FROM Activities a
            JOIN Daycares d ON a.daycare_id = d.id
            WHERE d.is_active = 1 AND d.is_verified = 1
            ORDER BY a.name ASC
        `);
        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Public
const getActivityById = async (req, res) => {
    try {
        const [activities] = await db.query(`
            SELECT a.*, d.name as daycare_name, d.email, d.phone, d.address
            FROM Activities a
            JOIN Daycares d ON a.daycare_id = d.id
            WHERE a.id = ?
        `, [req.params.id]);
        if (activities.length === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, data: activities[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get activities by daycare
// @route   GET /api/activities/daycare/:daycareId
// @access  Public
const getActivitiesByDaycare = async (req, res) => {
    try {
        const [activities] = await db.query('SELECT * FROM Activities WHERE daycare_id = ? ORDER BY name ASC', [req.params.daycareId]);
        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get activities by age range
// @route   GET /api/activities/age-range/:ageRange
// @access  Public
const getActivitiesByAgeRange = async (req, res) => {
    try {
        const [activities] = await db.query(`
            SELECT a.*, d.name as daycare_name
            FROM Activities a
            JOIN Daycares d ON a.daycare_id = d.id
            WHERE a.age_range = ? AND d.is_active = 1 AND d.is_verified = 1
        `, [req.params.ageRange]);
        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get activities by schedule
// @route   GET /api/activities/schedule/:schedule
// @access  Public
const getActivitiesBySchedule = async (req, res) => {
    try {
        const [activities] = await db.query(`
            SELECT a.*, d.name as daycare_name
            FROM Activities a
            JOIN Daycares d ON a.daycare_id = d.id
            WHERE a.schedule LIKE ? AND d.is_active = 1 AND d.is_verified = 1
        `, [`%${req.params.schedule}%`]);
        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create activity (Daycare only)
// @route   POST /api/activities
// @access  Private/Daycare
const createActivity = async (req, res) => {
    try {
        const { name, description, schedule, age_range, capacity } = req.body;
        const [result] = await db.query(
            'INSERT INTO Activities (daycare_id, name, description, schedule, age_range, capacity) VALUES (?, ?, ?, ?, ?, ?)',
            [req.daycare.id, name, description, schedule, age_range, capacity]
        );
        await db.query('UPDATE Daycares SET has_activities = 1 WHERE id = ?', [req.daycare.id]);
        res.status(201).json({ success: true, message: 'Activity created', activity_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update activity (Daycare only)
// @route   PUT /api/activities/:id
// @access  Private/Daycare
const updateActivity = async (req, res) => {
    try {
        const { name, description, schedule, age_range, capacity } = req.body;
        const [result] = await db.query(
            'UPDATE Activities SET name = ?, description = ?, schedule = ?, age_range = ?, capacity = ? WHERE id = ? AND daycare_id = ?',
            [name, description, schedule, age_range, capacity, req.params.id, req.daycare.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, message: 'Activity updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete activity (Daycare only)
// @route   DELETE /api/activities/:id
// @access  Private/Daycare
const deleteActivity = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Activities WHERE id = ? AND daycare_id = ?', [req.params.id, req.daycare.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        const [remaining] = await db.query('SELECT COUNT(*) as count FROM Activities WHERE daycare_id = ?', [req.daycare.id]);
        if (remaining[0].count === 0) {
            await db.query('UPDATE Daycares SET has_activities = 0 WHERE id = ?', [req.daycare.id]);
        }
        res.json({ success: true, message: 'Activity deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my daycare activities
// @route   GET /api/activities/my-daycare
// @access  Private/Daycare
const getMyDaycareActivities = async (req, res) => {
    try {
        const [activities] = await db.query('SELECT * FROM Activities WHERE daycare_id = ? ORDER BY name ASC', [req.daycare.id]);
        res.json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete activity (Admin only)
// @route   DELETE /api/activities/admin/:id
// @access  Private/Admin
const deleteActivityAdmin = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Activities WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, message: 'Activity deleted by admin' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllActivities,
    getActivityById,
    getActivitiesByDaycare,
    getActivitiesByAgeRange,
    getActivitiesBySchedule,
    createActivity,
    updateActivity,
    deleteActivity,
    getMyDaycareActivities,
    deleteActivityAdmin
};