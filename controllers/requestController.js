const db = require('../config/db');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Public
const getAllRequests = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, 
                   p.first_name as parent_first_name, p.last_name as parent_last_name,
                   c.name as child_name,
                   d.name as daycare_name
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
};

// @desc    Get request by ID
// @route   GET /api/requests/:id
// @access  Public
const getRequestById = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, p.first_name, p.last_name, c.name as child_name, d.name as daycare_name
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.id = ?
        `, [req.params.id]);
        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        res.json({ success: true, data: requests[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get requests by parent
// @route   GET /api/requests/parent/:parentId
// @access  Public
const getRequestsByParent = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, c.name as child_name, d.name as daycare_name
            FROM Requests r
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.parent_id = ?
            ORDER BY r.request_date DESC
        `, [req.params.parentId]);
        res.json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my requests (logged in parent)
// @route   GET /api/requests/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, c.name as child_name, d.name as daycare_name, d.address
            FROM Requests r
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.parent_id = ?
            ORDER BY r.request_date DESC
        `, [req.parent.id]);
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get requests by daycare
// @route   GET /api/requests/daycare/:daycareId
// @access  Public
const getRequestsByDaycare = async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, p.first_name, p.last_name, c.name as child_name
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            WHERE r.daycare_id = ?
            ORDER BY r.request_date DESC
        `, [req.params.daycareId]);
        res.json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
    try {
        const { child_id, daycare_id, schedule_type } = req.body;
        const parent_id = req.parent.id;
        
        const [childCheck] = await db.query('SELECT id FROM Children WHERE id = ? AND parent_id = ?', [child_id, parent_id]);
        if (childCheck.length === 0) {
            return res.status(403).json({ success: false, message: 'Child does not belong to you' });
        }
        
        const [existing] = await db.query('SELECT id FROM Requests WHERE child_id = ? AND daycare_id = ? AND status = "pending"', [child_id, daycare_id]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'A pending request already exists' });
        }
        
        const [result] = await db.query(
            'INSERT INTO Requests (parent_id, child_id, daycare_id, schedule_type, status, request_date) VALUES (?, ?, ?, ?, "pending", NOW())',
            [parent_id, child_id, daycare_id, schedule_type || 'full-time']
        );
        
        res.status(201).json({ success: true, message: 'Request submitted successfully', request_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Accept a request
// @route   PUT /api/requests/:id/accept
// @access  Private/Daycare
const acceptRequest = async (req, res) => {
    try {
        const [result] = await db.query('UPDATE Requests SET status = "accepted" WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        res.json({ success: true, message: 'Request accepted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reject a request
// @route   PUT /api/requests/:id/reject
// @access  Private/Daycare
const rejectRequest = async (req, res) => {
    try {
        const [result] = await db.query('UPDATE Requests SET status = "rejected" WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        res.json({ success: true, message: 'Request rejected' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel a request (parent)
// @route   PUT /api/requests/:id/cancel
// @access  Private
const cancelRequest = async (req, res) => {
    try {
        const [request] = await db.query('SELECT status, parent_id FROM Requests WHERE id = ?', [req.params.id]);
        if (request.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        if (request[0].parent_id !== req.parent.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
        }
        if (request[0].status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending requests can be cancelled' });
        }
        const [result] = await db.query('DELETE FROM Requests WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Request cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = async (req, res) => {
    try {
        const [request] = await db.query('SELECT status FROM Requests WHERE id = ?', [req.params.id]);
        if (request.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        if (request[0].status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Cannot delete requests that are already accepted or rejected' });
        }
        const [result] = await db.query('DELETE FROM Requests WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get requests by status
// @route   GET /api/requests/status/:status
// @access  Public
const getRequestsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const [requests] = await db.query(`
            SELECT r.*, p.first_name, p.last_name, c.name as child_name, d.name as daycare_name
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.status = ?
            ORDER BY r.request_date DESC
        `, [status]);
        res.json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllRequests,
    getRequestById,
    getRequestsByParent,
    getMyRequests,
    getRequestsByDaycare,
    createRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    deleteRequest,
    getRequestsByStatus
};