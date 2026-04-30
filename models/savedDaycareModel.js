const db = require('../config/db');

class SavedDaycare {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT s.*, 
                   p.first_name, 
                   p.last_name,
                   p.email as parent_email,
                   d.name as daycare_name,
                   d.address as daycare_address,
                   d.price as daycare_price,
                   d.age_range as daycare_age_range
            FROM Saved_Daycares s
            INNER JOIN Parents p ON s.parent_id = p.id
            INNER JOIN Daycares d ON s.daycare_id = d.id
            ORDER BY s.saved_date DESC
        `);
        return rows;
    }

    static async findByParentId(parent_id) {
        const [rows] = await db.query(`
            SELECT s.*, 
                   d.name, 
                   d.address, 
                   d.price, 
                   d.age_range,
                   d.phone,
                   d.email,
                   d.profile_image,
                   d.is_active,
                   (SELECT AVG(rating) FROM Reviews WHERE daycare_id = d.id) as average_rating
            FROM Saved_Daycares s
            INNER JOIN Daycares d ON s.daycare_id = d.id
            WHERE s.parent_id = ?
            ORDER BY s.saved_date DESC
        `, [parent_id]);
        return rows;
    }

    static async findSaved(parent_id, daycare_id) {
        const [rows] = await db.query(
            'SELECT * FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?',
            [parent_id, daycare_id]
        );
        return rows[0];
    }

    static async create(parent_id, daycare_id) {
        // Check if already saved
        const existing = await this.findSaved(parent_id, daycare_id);
        if (existing) {
            throw new Error('Daycare already saved');
        }
        
        const [result] = await db.query(
            'INSERT INTO Saved_Daycares (parent_id, daycare_id, saved_date) VALUES (?, ?, NOW())',
            [parent_id, daycare_id]
        );
        return result.insertId;
    }

    static async delete(parent_id, daycare_id) {
        const [result] = await db.query(
            'DELETE FROM Saved_Daycares WHERE parent_id = ? AND daycare_id = ?',
            [parent_id, daycare_id]
        );
        return result.affectedRows;
    }

    static async countSavedByParent(parent_id) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM Saved_Daycares WHERE parent_id = ?',
            [parent_id]
        );
        return rows[0].count;
    }

    static async getMostSavedDaycares(limit = 10) {
        const [rows] = await db.query(`
            SELECT d.id, d.name, d.address, COUNT(s.id) as save_count
            FROM Daycares d
            LEFT JOIN Saved_Daycares s ON d.id = s.daycare_id
            WHERE d.is_active = 1 AND d.is_verified = 1
            GROUP BY d.id
            ORDER BY save_count DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }
}

module.exports = SavedDaycare;