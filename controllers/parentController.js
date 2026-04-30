const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Register a new parent
// @route   POST /api/parents/register
// @access  Public
const registerParent = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone } = req.body;
        
        const [existing] = await db.query('SELECT id FROM Parents WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        const [result] = await db.query(
            'INSERT INTO Parents (first_name, last_name, email, password, phone, verification_code) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone, verificationCode]
        );
        
        const token = generateToken(result.insertId, 'parent');
        
        res.status(201).json({
            success: true,
            message: 'Parent registered successfully',
            token,
            verification_code: verificationCode
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login parent
// @route   POST /api/parents/login
// @access  Public
const loginParent = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [parents] = await db.query('SELECT * FROM Parents WHERE email = ?', [email]);
        if (parents.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const parent = parents[0];
        const isPasswordValid = await bcrypt.compare(password, parent.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        if (!parent.is_verified) {
            return res.status(401).json({ success: false, message: 'Please verify your email first' });
        }
        
        const token = generateToken(parent.id, 'parent');
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: parent.id,
                first_name: parent.first_name,
                last_name: parent.last_name,
                email: parent.email,
                phone: parent.phone,
                profile_image: parent.Profile_image,
                is_verified: parent.is_verified
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all parents
// @route   GET /api/parents
// @access  Public
const getAllParents = async (req, res) => {
    try {
        const [parents] = await db.query('SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents ORDER BY id DESC');
        res.json({ success: true, count: parents.length, data: parents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get parent by ID
// @route   GET /api/parents/:id
// @access  Public
const getParentById = async (req, res) => {
    try {
        const [parents] = await db.query('SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents WHERE id = ?', [req.params.id]);
        if (parents.length === 0) {
            return res.status(404).json({ success: false, message: 'Parent not found' });
        }
        res.json({ success: true, data: parents[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get parent profile (own)
// @route   GET /api/parents/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
    res.json({ success: true, data: req.parent });
};

// @desc    Update parent profile
// @route   PUT /api/parents/profile/me
// @access  Private
const updateMyProfile = async (req, res) => {
    try {
        const { first_name, last_name, email, phone } = req.body;
        const parentId = req.parent.id;
        
        if (email && email !== req.parent.email) {
            const [existing] = await db.query('SELECT id FROM Parents WHERE email = ? AND id != ?', [email, parentId]);
            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }
        
        await db.query('UPDATE Parents SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?', 
            [first_name || req.parent.first_name, last_name || req.parent.last_name, email || req.parent.email, phone || req.parent.phone, parentId]);
        
        const [updated] = await db.query('SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents WHERE id = ?', [parentId]);
        
        res.json({ success: true, message: 'Profile updated successfully', data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/parents/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const parentId = req.parent.id;
        
        const [parents] = await db.query('SELECT password FROM Parents WHERE id = ?', [parentId]);
        const isValid = await bcrypt.compare(current_password, parents[0].password);
        
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await db.query('UPDATE Parents SET password = ? WHERE id = ?', [hashedPassword, parentId]);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete parent account
// @route   DELETE /api/parents/profile/me
// @access  Private
const deleteMyAccount = async (req, res) => {
    try {
        await db.query('DELETE FROM Parents WHERE id = ?', [req.parent.id]);
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify email
// @route   POST /api/parents/verify
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const [result] = await db.query('UPDATE Parents SET is_verified = 1, verification_code = NULL WHERE email = ? AND verification_code = ?', [email, code]);
        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }
        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/parents/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const [parents] = await db.query('SELECT id FROM Parents WHERE email = ?', [email]);
        if (parents.length === 0) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        await db.query('UPDATE Parents SET reset_code = ? WHERE email = ?', [resetCode, email]);
        res.json({ success: true, message: 'Reset code sent', reset_code: resetCode });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reset password
// @route   POST /api/parents/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, code, new_password } = req.body;
        const [parents] = await db.query('SELECT id FROM Parents WHERE email = ? AND reset_code = ?', [email, code]);
        if (parents.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid reset code' });
        }
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await db.query('UPDATE Parents SET password = ?, reset_code = NULL WHERE id = ?', [hashedPassword, parents[0].id]);
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Resend verification code
// @route   POST /api/parents/resend-verification
// @access  Public
const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await db.query('UPDATE Parents SET verification_code = ? WHERE email = ?', [verificationCode, email]);
        res.json({ success: true, message: 'Verification code resent', verification_code: verificationCode });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerParent,
    loginParent,
    getAllParents,
    getParentById,
    getMyProfile,
    updateMyProfile,
    changePassword,
    deleteMyAccount,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerificationCode
};