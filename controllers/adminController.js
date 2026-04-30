const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Setup initial super admin (run once)
// @route   POST /api/admins/setup
// @access  Public
const setupSuperAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const [existing] = await db.query('SELECT id FROM Admins LIMIT 1');
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO Admins (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, "superadmin")', [first_name, last_name, email, hashedPassword]);
        res.status(201).json({ success: true, message: 'Super admin created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin login
// @route   POST /api/admins/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [admins] = await db.query('SELECT * FROM Admins WHERE email = ?', [email]);
        if (admins.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const admin = admins[0];
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(admin.id, 'admin');
        res.json({ success: true, token, data: { id: admin.id, first_name: admin.first_name, last_name: admin.last_name, email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/Admin
const getAllAdmins = async (req, res) => {
    try {
        const [admins] = await db.query('SELECT id, first_name, last_name, email, role FROM Admins');
        res.json({ success: true, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get admin by ID
// @route   GET /api/admins/:id
// @access  Private/Admin
const getAdminById = async (req, res) => {
    try {
        const [admins] = await db.query('SELECT id, first_name, last_name, email, role FROM Admins WHERE id = ?', [req.params.id]);
        if (admins.length === 0) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.json({ success: true, data: admins[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my profile
// @route   GET /api/admins/me
// @access  Private/Admin
const getMyProfile = async (req, res) => {
    res.json({ success: true, data: req.admin });
};

// @desc    Create admin
// @route   POST /api/admins
// @access  Private/SuperAdmin
const createAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        const [existing] = await db.query('SELECT id FROM Admins WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO Admins (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, role || 'moderator']);
        res.status(201).json({ success: true, message: 'Admin created', admin_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/SuperAdmin
const updateAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, role } = req.body;
        const [result] = await db.query('UPDATE Admins SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?', [first_name, last_name, email, role, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.json({ success: true, message: 'Admin updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private/SuperAdmin
const deleteAdmin = async (req, res) => {
    try {
        if (parseInt(req.params.id) === req.admin.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
        }
        const [result] = await db.query('DELETE FROM Admins WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.json({ success: true, message: 'Admin deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/admins/change-password
// @access  Private/Admin
const changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const [admins] = await db.query('SELECT password FROM Admins WHERE id = ?', [req.admin.id]);
        const isValid = await bcrypt.compare(current_password, admins[0].password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await db.query('UPDATE Admins SET password = ? WHERE id = ?', [hashedPassword, req.admin.id]);
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const [totalParents] = await db.query('SELECT COUNT(*) as count FROM Parents WHERE is_verified = 1');
        const [totalDaycares] = await db.query('SELECT COUNT(*) as count FROM Daycares WHERE is_verified = 1');
        const [totalRequests] = await db.query('SELECT COUNT(*) as count FROM Requests');
        const [pendingRequests] = await db.query('SELECT COUNT(*) as count FROM Requests WHERE status = "pending"');
        const [totalReviews] = await db.query('SELECT COUNT(*) as count FROM Reviews');
        const [avgRating] = await db.query('SELECT AVG(rating) as average FROM Reviews');
        
        res.json({ success: true, data: { parents: totalParents[0].count, daycares: totalDaycares[0].count, requests: { total: totalRequests[0].count, pending: pendingRequests[0].count }, reviews: totalReviews[0].count, average_rating: parseFloat(avgRating[0].average) || 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDaycareStats = async (req, res) => {
    try {
        const [total] = await db.query('SELECT COUNT(*) as count FROM Daycares');
        const [active] = await db.query('SELECT COUNT(*) as count FROM Daycares WHERE is_active = 1');
        const [pending] = await db.query('SELECT COUNT(*) as count FROM Daycares WHERE is_verified = 0');
        res.json({ success: true, data: { total: total[0].count, active: active[0].count, pending: pending[0].count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getParentStats = async (req, res) => {
    try {
        const [total] = await db.query('SELECT COUNT(*) as count FROM Parents');
        const [verified] = await db.query('SELECT COUNT(*) as count FROM Parents WHERE is_verified = 1');
        res.json({ success: true, data: { total: total[0].count, verified: verified[0].count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRequestStats = async (req, res) => {
    try {
        const [pending] = await db.query('SELECT COUNT(*) as count FROM Requests WHERE status = "pending"');
        const [accepted] = await db.query('SELECT COUNT(*) as count FROM Requests WHERE status = "accepted"');
        const [rejected] = await db.query('SELECT COUNT(*) as count FROM Requests WHERE status = "rejected"');
        res.json({ success: true, data: { pending: pending[0].count, accepted: accepted[0].count, rejected: rejected[0].count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPendingDaycares = async (req, res) => {
    try {
        const [daycares] = await db.query('SELECT * FROM Daycares WHERE is_verified = 0 OR is_active = 0');
        res.json({ success: true, data: daycares });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyDaycare = async (req, res) => {
    try {
        await db.query('UPDATE Daycares SET is_verified = 1, is_active = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Daycare verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllParents = async (req, res) => {
    try {
        const [parents] = await db.query('SELECT id, first_name, last_name, email, phone, is_verified, Profile_image FROM Parents');
        res.json({ success: true, data: parents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getParentByIdAdmin = async (req, res) => {
    try {
        const [parents] = await db.query('SELECT * FROM Parents WHERE id = ?', [req.params.id]);
        if (parents.length === 0) {
            return res.status(404).json({ success: false, message: 'Parent not found' });
        }
        res.json({ success: true, data: parents[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteParent = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Parents WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Parent not found' });
        }
        res.json({ success: true, message: 'Parent deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const [requests] = await db.query(`SELECT r.*, p.first_name, p.last_name, c.name as child_name, d.name as daycare_name FROM Requests r JOIN Parents p ON r.parent_id = p.id JOIN Children c ON r.child_id = c.id JOIN Daycares d ON r.daycare_id = d.id WHERE r.status = "pending"`);
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSettings = async (req, res) => {
    res.json({ success: true, message: 'Settings updated' });
};

module.exports = {
    setupSuperAdmin,
    login,
    getAllAdmins,
    getAdminById,
    getMyProfile,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    changePassword,
    getDashboardStats,
    getDaycareStats,
    getParentStats,
    getRequestStats,
    getPendingDaycares,
    verifyDaycare,
    getAllParents,
    getParentByIdAdmin,
    deleteParent,
    getPendingRequests,
    updateSettings
};