const db = require('../config/db');

class Request {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.first_name as parent_first_name, 
                   p.last_name as parent_last_name,
                   p.email as parent_email,
                   c.name as child_name,
                   c.age as child_age,
                   d.name as daycare_name,
                   d.email as daycare_email
            FROM Requests r
            INNER JOIN Parents p ON r.parent_id = p.id
            INNER JOIN Children c ON r.child_id = c.id
            INNER JOIN Daycares d ON r.daycare_id = d.id
            ORDER BY r.request_date DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.first_name as parent_first_name, 
                   p.last_name as parent_last_name,
                   p.email as parent_email,
                   p.phone as parent_phone,
                   c.name as child_name,
                   c.age as child_age,
                   c.gender as child_gender,
                   c.medical_issues as child_medical_issues,
                   d.name as daycare_name,
                   d.email as daycare_email,
                   d.phone as daycare_phone,
                   d.address as daycare_address
            FROM Requests r
            INNER JOIN Parents p ON r.parent_id = p.id
            INNER JOIN Children c ON r.child_id = c.id
            INNER JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.id = ?
        `, [id]);
        return rows[0];
    }

    static async findByParentId(parent_id) {
        const [rows] = await db.query(`
            SELECT r.*, 
                   c.name as child_name,
                   d.name as daycare_name,
                   d.address as daycare_address
            FROM Requests r
            INNER JOIN Children c ON r.child_id = c.id
            INNER JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.parent_id = ?
            ORDER BY r.request_date DESC
        `, [parent_id]);
        return rows;
    }

    static async findByDaycareId(daycare_id) {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.first_name, 
                   p.last_name,
                   p.email as parent_email,
                   p.phone as parent_phone,
                   c.name as child_name,
                   c.age as child_age
            FROM Requests r
            INNER JOIN Parents p ON r.parent_id = p.id
            INNER JOIN Children c ON r.child_id = c.id
            WHERE r.daycare_id = ?
            ORDER BY r.request_date DESC
        `, [daycare_id]);
        return rows;
    }

    static async create(data) {
        const { parent_id, child_id, daycare_id, schedule_type } = data;
        
        // Check for duplicate pending request
        const [existing] = await db.query(
            'SELECT * FROM Requests WHERE child_id = ? AND daycare_id = ? AND status = "pending"',
            [child_id, daycare_id]
        );
        
        if (existing.length > 0) {
            throw new Error('A pending request already exists for this child and daycare');
        }
        
        const [result] = await db.query(
            'INSERT INTO Requests (parent_id, child_id, daycare_id, schedule_type, status, request_date) VALUES (?, ?, ?, ?, "pending", NOW())',
            [parent_id, child_id, daycare_id, schedule_type]
        );
        return result.insertId;
    }

    static async updateStatus(id, status) {
        const validStatuses = ['pending', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status value');
        }
        
        const [result] = await db.query(
            'UPDATE Requests SET status=? WHERE id=?',
            [status, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        // Only allow deletion of pending requests
        const [request] = await db.query(
            'SELECT status FROM Requests WHERE id = ?',
            [id]
        );
        
        if (request[0] && request[0].status !== 'pending') {
            throw new Error('Cannot delete requests that are already accepted or rejected');
        }
        
        const [result] = await db.query('DELETE FROM Requests WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async getRequestsByStatus(status) {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.first_name, p.last_name,
                   c.name as child_name,
                   d.name as daycare_name
            FROM Requests r
            INNER JOIN Parents p ON r.parent_id = p.id
            INNER JOIN Children c ON r.child_id = c.id
            INNER JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.status = ?
            ORDER BY r.request_date DESC
        `, [status]);
        return rows;
    }

    static async countPendingByDaycare(daycare_id) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM Requests WHERE daycare_id = ? AND status = "pending"',
            [daycare_id]
        );
        return rows[0].count;
    }
}

module.exports = Request;