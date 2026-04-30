const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Register a new daycare
// @route   POST /api/daycares/register
// @access  Public
const registerDaycare = async (req, res) => {
    try {
        const { name, email, password, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media } = req.body;
        
        const [existing] = await db.query('SELECT id FROM Daycares WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        const [result] = await db.query(
            `INSERT INTO Daycares (name, email, password, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, verification_code) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, address, lat || null, lon || null, capacity, age_range, price, education_info, healthcare_info, social_media, verificationCode]
        );
        
        const token = generateToken(result.insertId, 'daycare');
        
        res.status(201).json({ success: true, message: 'Daycare registered successfully', token, verification_code: verificationCode });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login daycare
// @route   POST /api/daycares/login
// @access  Public
const loginDaycare = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [daycares] = await db.query('SELECT * FROM Daycares WHERE email = ?', [email]);
        if (daycares.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const daycare = daycares[0];
        const isPasswordValid = await bcrypt.compare(password, daycare.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        if (!daycare.is_verified) {
            return res.status(401).json({ success: false, message: 'Please verify your email first' });
        }
        
        if (!daycare.is_active) {
            return res.status(401).json({ success: false, message: 'Your account is pending admin approval' });
        }
        
        const token = generateToken(daycare.id, 'daycare');
        
        res.json({ success: true, message: 'Login successful', token, data: { id: daycare.id, name: daycare.name, email: daycare.email, phone: daycare.phone, address: daycare.address, is_active: daycare.is_active, is_verified: daycare.is_verified } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all daycares
// @route   GET /api/daycares
// @access  Public
const getAllDaycares = async (req, res) => {
    try {
        const [daycares] = await db.query('SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, is_active, has_activities FROM Daycares WHERE is_active = 1 AND is_verified = 1 ORDER BY name ASC');
        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get daycare by ID
// @route   GET /api/daycares/:id
// @access  Public
const getDaycareById = async (req, res) => {
    try {
        const [daycares] = await db.query('SELECT * FROM Daycares WHERE id = ?', [req.params.id]);
        if (daycares.length === 0) {
            return res.status(404).json({ success: false, message: 'Daycare not found' });
        }
        
        const [rating] = await db.query('SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?', [req.params.id]);
        
        res.json({ success: true, data: daycares[0], rating: { average: parseFloat(rating[0].average) || 0, total: rating[0].total } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get daycare profile (own)
// @route   GET /api/daycares/profile/me
// @access  Private/Daycare
const getMyProfile = async (req, res) => {
    res.json({ success: true, data: req.daycare });
};

// @desc    Update daycare profile
// @route   PUT /api/daycares/profile/me
// @access  Private/Daycare
const updateMyProfile = async (req, res) => {
    try {
        const { name, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image } = req.body;
        const daycareId = req.daycare.id;
        
        await db.query(`UPDATE Daycares SET name = ?, phone = ?, address = ?, lat = ?, lon = ?, capacity = ?, age_range = ?, price = ?, education_info = ?, healthcare_info = ?, social_media = ?, profile_image = ? WHERE id = ?`,
            [name || req.daycare.name, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, daycareId]);
        
        const [updated] = await db.query('SELECT * FROM Daycares WHERE id = ?', [daycareId]);
        res.json({ success: true, message: 'Profile updated successfully', data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/daycares/change-password
// @access  Private/Daycare
const changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const daycareId = req.daycare.id;
        
        const [daycares] = await db.query('SELECT password FROM Daycares WHERE id = ?', [daycareId]);
        const isValid = await bcrypt.compare(current_password, daycares[0].password);
        
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await db.query('UPDATE Daycares SET password = ? WHERE id = ?', [hashedPassword, daycareId]);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get active daycares
// @route   GET /api/daycares/active
// @access  Public
const getActiveDaycares = async (req, res) => {
    try {
        const [daycares] = await db.query('SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, profile_image FROM Daycares WHERE is_active = 1 AND is_verified = 1');
        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get nearby daycares
// @route   GET /api/daycares/nearby?lat=...&lon=...&radius=...
// @access  Public
const getNearbyDaycares = async (req, res) => {
    try {
        const { lat, lon, radius = 10 } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
        }
        
        const [daycares] = await db.query(`SELECT *, (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance FROM Daycares WHERE is_active = 1 AND is_verified = 1 AND lat IS NOT NULL AND lon IS NOT NULL HAVING distance < ? ORDER BY distance ASC`, [lat, lon, lat, radius]);
        
        res.json({ success: true, count: daycares.length, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get daycare rating
// @route   GET /api/daycares/:id/rating
// @access  Public
const getDaycareRating = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?', [req.params.id]);
        res.json({ success: true, average: parseFloat(rows[0].average) || 0, total_reviews: rows[0].total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get daycare requests
// @route   GET /api/daycares/my-requests
// @access  Private/Daycare
const getMyRequests = async (req, res) => {
    try {
        const [requests] = await db.query(`SELECT r.*, p.first_name, p.last_name, p.email, p.phone, c.name as child_name, c.age as child_age FROM Requests r JOIN Parents p ON r.parent_id = p.id JOIN Children c ON r.child_id = c.id WHERE r.daycare_id = ? ORDER BY r.request_date DESC`, [req.daycare.id]);
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/daycares/requests/:requestId/:status
// @access  Private/Daycare
const updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.params;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const [result] = await db.query('UPDATE Requests SET status = ? WHERE id = ? AND daycare_id = ?', [status, requestId, req.daycare.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        res.json({ success: true, message: `Request ${status} successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my activities
// @route   GET /api/daycares/my-activities
// @access  Private/Daycare
const getMyActivities = async (req, res) => {
    try {
        const [activities] = await db.query('SELECT * FROM Activities WHERE daycare_id = ?', [req.daycare.id]);
        res.json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add activity
// @route   POST /api/daycares/my-activities
// @access  Private/Daycare
const addActivity = async (req, res) => {
    try {
        const { name, description, schedule, age_range, capacity } = req.body;
        const [result] = await db.query('INSERT INTO Activities (daycare_id, name, description, schedule, age_range, capacity) VALUES (?, ?, ?, ?, ?, ?)', [req.daycare.id, name, description, schedule, age_range, capacity]);
        await db.query('UPDATE Daycares SET has_activities = 1 WHERE id = ?', [req.daycare.id]);
        res.status(201).json({ success: true, message: 'Activity added', activity_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update activity
// @route   PUT /api/daycares/my-activities/:activityId
// @access  Private/Daycare
const updateActivity = async (req, res) => {
    try {
        const { name, description, schedule, age_range, capacity } = req.body;
        const [result] = await db.query('UPDATE Activities SET name = ?, description = ?, schedule = ?, age_range = ?, capacity = ? WHERE id = ? AND daycare_id = ?', [name, description, schedule, age_range, capacity, req.params.activityId, req.daycare.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, message: 'Activity updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete activity
// @route   DELETE /api/daycares/my-activities/:activityId
// @access  Private/Daycare
const deleteActivity = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Activities WHERE id = ? AND daycare_id = ?', [req.params.activityId, req.daycare.id]);
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

// @desc    Get my reviews
// @route   GET /api/daycares/my-reviews
// @access  Private/Daycare
const getMyReviews = async (req, res) => {
    try {
        const [reviews] = await db.query(`SELECT r.*, p.first_name, p.last_name FROM Reviews r JOIN Parents p ON r.parent_id = p.id WHERE r.daycare_id = ? ORDER BY r.review_date DESC`, [req.daycare.id]);
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin functions
const activateDaycare = async (req, res) => {
    try {
        await db.query('UPDATE Daycares SET is_active = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Daycare activated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deactivateDaycare = async (req, res) => {
    try {
        await db.query('UPDATE Daycares SET is_active = 0 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Daycare deactivated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteDaycare = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Daycares WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Daycare not found' });
        }
        res.json({ success: true, message: 'Daycare deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDaycare = async (req, res) => {
    try {
        const { name, email, phone, address, capacity, age_range, price } = req.body;
        await db.query('UPDATE Daycares SET name = ?, email = ?, phone = ?, address = ?, capacity = ?, age_range = ?, price = ? WHERE id = ?', [name, email, phone, address, capacity, age_range, price, req.params.id]);
        res.json({ success: true, message: 'Daycare updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerDaycare,
    loginDaycare,
    getAllDaycares,
    getDaycareById,
    getMyProfile,
    updateMyProfile,
    changePassword,
    getActiveDaycares,
    getNearbyDaycares,
    getDaycareRating,
    getMyRequests,
    updateRequestStatus,
    getMyActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    getMyReviews,
    activateDaycare,
    deactivateDaycare,
    deleteDaycare,
    updateDaycare
};