const db = require('../config/db');

// @desc    Get all children
// @route   GET /api/children
// @access  Public
const getAllChildren = async (req, res) => {
    try {
        const [children] = await db.query(`
            SELECT c.*, p.first_name as parent_first_name, p.last_name as parent_last_name 
            FROM Children c
            JOIN Parents p ON c.parent_id = p.id
            ORDER BY c.id DESC
        `);
        res.json({ success: true, count: children.length, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get child by ID
// @route   GET /api/children/:id
// @access  Public
const getChildById = async (req, res) => {
    try {
        const [children] = await db.query(`
            SELECT c.*, p.first_name as parent_first_name, p.last_name as parent_last_name 
            FROM Children c
            JOIN Parents p ON c.parent_id = p.id
            WHERE c.id = ?
        `, [req.params.id]);
        if (children.length === 0) {
            return res.status(404).json({ success: false, message: 'Child not found' });
        }
        res.json({ success: true, data: children[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get children by parent ID
// @route   GET /api/children/parent/:parentId
// @access  Public
const getChildrenByParent = async (req, res) => {
    try {
        const [children] = await db.query('SELECT * FROM Children WHERE parent_id = ? ORDER BY age ASC', [req.params.parentId]);
        res.json({ success: true, count: children.length, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my children (logged in parent)
// @route   GET /api/children/my-children
// @access  Private
const getMyChildren = async (req, res) => {
    try {
        const [children] = await db.query('SELECT * FROM Children WHERE parent_id = ? ORDER BY age ASC', [req.parent.id]);
        res.json({ success: true, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a child
// @route   POST /api/children
// @access  Private
const createChild = async (req, res) => {
    try {
        const { name, age, gender, medical_issues } = req.body;
        const parent_id = req.parent.id;
        
        const [result] = await db.query(
            'INSERT INTO Children (parent_id, name, age, gender, medical_issues) VALUES (?, ?, ?, ?, ?)',
            [parent_id, name, age, gender, medical_issues]
        );
        
        const [newChild] = await db.query('SELECT * FROM Children WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, message: 'Child added successfully', data: newChild[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a child
// @route   PUT /api/children/:id
// @access  Private
const updateChild = async (req, res) => {
    try {
        const { name, age, gender, medical_issues } = req.body;
        
        const [result] = await db.query(
            'UPDATE Children SET name = ?, age = ?, gender = ?, medical_issues = ? WHERE id = ?',
            [name, age, gender, medical_issues, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Child not found' });
        }
        
        const [updated] = await db.query('SELECT * FROM Children WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Child updated successfully', data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a child
// @route   DELETE /api/children/:id
// @access  Private
const deleteChild = async (req, res) => {
    try {
        const [requests] = await db.query('SELECT id FROM Requests WHERE child_id = ? AND status = "pending"', [req.params.id]);
        if (requests.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete child with pending requests' });
        }
        
        const [result] = await db.query('DELETE FROM Children WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Child not found' });
        }
        res.json({ success: true, message: 'Child deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all children (admin)
// @route   GET /api/children/admin/all
// @access  Private/Admin
const getAllChildrenAdmin = async (req, res) => {
    try {
        const [children] = await db.query(`
            SELECT c.*, p.first_name, p.last_name, p.email as parent_email
            FROM Children c
            JOIN Parents p ON c.parent_id = p.id
            ORDER BY c.id DESC
        `);
        res.json({ success: true, count: children.length, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllChildren,
    getChildById,
    getChildrenByParent,
    getMyChildren,
    createChild,
    updateChild,
    deleteChild,
    getAllChildrenAdmin
};