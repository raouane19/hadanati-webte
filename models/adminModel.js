const db = require('../config/db');

class Admin {
    static async findAll() {
        const [rows] = await db.query('SELECT id, first_name, last_name, email, role FROM Admins ORDER BY id ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, first_name, last_name, email, role FROM Admins WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM Admins WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(data) {
        const { first_name, last_name, email, password, role } = data;
        const [result] = await db.query(
            'INSERT INTO Admins (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, password, role || 'moderator']
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { first_name, last_name, email, role } = data;
        const [result] = await db.query(
            'UPDATE Admins SET first_name=?, last_name=?, email=?, role=? WHERE id=?',
            [first_name, last_name, email, role, id]
        );
        return result.affectedRows;
    }

    static async updatePassword(id, password) {
        const [result] = await db.query(
            'UPDATE Admins SET password=? WHERE id=?',
            [password, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        // Prevent deleting the last superadmin
        const [superAdmins] = await db.query(
            'SELECT COUNT(*) as count FROM Admins WHERE role = "superadmin"'
        );
        
        const [admin] = await db.query('SELECT role FROM Admins WHERE id = ?', [id]);
        
        if (admin[0] && admin[0].role === 'superadmin' && superAdmins[0].count === 1) {
            throw new Error('Cannot delete the last superadmin');
        }
        
        const [result] = await db.query('DELETE FROM Admins WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async countByRole(role) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM Admins WHERE role = ?',
            [role]
        );
        return rows[0].count;
    }
}

module.exports = Admin;