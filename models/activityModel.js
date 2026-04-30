const db = require('../config/db');

class Activity {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT a.*, 
                   d.name as daycare_name,
                   d.address as daycare_address
            FROM Activities a
            INNER JOIN Daycares d ON a.daycare_id = d.id
            ORDER BY a.name ASC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT a.*, 
                   d.name as daycare_name,
                   d.email as daycare_email,
                   d.phone as daycare_phone
            FROM Activities a
            INNER JOIN Daycares d ON a.daycare_id = d.id
            WHERE a.id = ?
        `, [id]);
        return rows[0];
    }

    static async findByDaycareId(daycare_id) {
        const [rows] = await db.query(`
            SELECT * FROM Activities 
            WHERE daycare_id = ? 
            ORDER BY name ASC
        `, [daycare_id]);
        return rows;
    }

    static async create(data) {
        const { daycare_id, name, description, schedule, age_range, capacity } = data;
        
        const [result] = await db.query(
            `INSERT INTO Activities 
            (daycare_id, name, description, schedule, age_range, capacity) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [daycare_id, name, description, schedule, age_range, capacity]
        );
        
        // Update daycare has_activities flag
        await db.query('UPDATE Daycares SET has_activities = 1 WHERE id = ?', [daycare_id]);
        
        return result.insertId;
    }

    static async update(id, data) {
        const { name, description, schedule, age_range, capacity } = data;
        
        const [result] = await db.query(
            `UPDATE Activities SET 
            name=?, description=?, schedule=?, age_range=?, capacity=? 
            WHERE id=?`,
            [name, description, schedule, age_range, capacity, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        // Get daycare_id before deleting
        const [activity] = await db.query('SELECT daycare_id FROM Activities WHERE id = ?', [id]);
        
        if (!activity[0]) {
            return 0;
        }
        
        const daycare_id = activity[0].daycare_id;
        
        // Delete the activity
        const [result] = await db.query('DELETE FROM Activities WHERE id = ?', [id]);
        
        // Check if daycare has any remaining activities
        const [remaining] = await db.query(
            'SELECT COUNT(*) as count FROM Activities WHERE daycare_id = ?',
            [daycare_id]
        );
        
        if (remaining[0].count === 0) {
            await db.query('UPDATE Daycares SET has_activities = 0 WHERE id = ?', [daycare_id]);
        }
        
        return result.affectedRows;
    }

    static async findByAgeRange(age_range) {
        const [rows] = await db.query(`
            SELECT a.*, d.name as daycare_name
            FROM Activities a
            INNER JOIN Daycares d ON a.daycare_id = d.id
            WHERE a.age_range = ? AND d.is_active = 1 AND d.is_verified = 1
        `, [age_range]);
        return rows;
    }

    static async getActivitiesBySchedule(schedule) {
        const [rows] = await db.query(`
            SELECT a.*, d.name as daycare_name
            FROM Activities a
            INNER JOIN Daycares d ON a.daycare_id = d.id
            WHERE a.schedule LIKE ? AND d.is_active = 1 AND d.is_verified = 1
        `, [`%${schedule}%`]);
        return rows;
    }
}

module.exports = Activity;