const db = require('../config/db');

class Child {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT c.*, 
                   p.first_name as parent_first_name, 
                   p.last_name as parent_last_name, 
                   p.email as parent_email,
                   p.phone as parent_phone
            FROM Children c
            INNER JOIN Parents p ON c.parent_id = p.id
            ORDER BY c.id DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT c.*, 
                   p.first_name as parent_first_name, 
                   p.last_name as parent_last_name, 
                   p.email as parent_email,
                   p.phone as parent_phone
            FROM Children c
            INNER JOIN Parents p ON c.parent_id = p.id
            WHERE c.id = ?
        `, [id]);
        return rows[0];
    }

    static async findByParentId(parent_id) {
        const [rows] = await db.query(`
            SELECT * FROM Children 
            WHERE parent_id = ? 
            ORDER BY age ASC
        `, [parent_id]);
        return rows;
    }

    static async create(data) {
        const { parent_id, name, age, gender, medical_issues } = data;
        const [result] = await db.query(
            'INSERT INTO Children (parent_id, name, age, gender, medical_issues) VALUES (?, ?, ?, ?, ?)',
            [parent_id, name, age, gender, medical_issues]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { name, age, gender, medical_issues } = data;
        const [result] = await db.query(
            'UPDATE Children SET name=?, age=?, gender=?, medical_issues=? WHERE id=?',
            [name, age, gender, medical_issues, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        // Check if child has any pending requests first
        const [requests] = await db.query(
            'SELECT * FROM Requests WHERE child_id = ? AND status = "pending"',
            [id]
        );
        
        if (requests.length > 0) {
            throw new Error('Cannot delete child with pending requests');
        }
        
        const [result] = await db.query('DELETE FROM Children WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async countByParent(parent_id) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM Children WHERE parent_id = ?',
            [parent_id]
        );
        return rows[0].count;
    }
}

module.exports = Child;