const db = require('../config/db');

class Review {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.first_name, 
                   p.last_name,
                   d.name as daycare_name
            FROM Reviews r
            INNER JOIN Parents p ON r.parent_id = p.id
            INNER JOIN Daycares d ON r.daycare_id = d.id
            ORDER BY r.review_date DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.first_name, 
                   p.last_name,
                   p.email as parent_email,
                   d.name as daycare_name,
                   d.email as daycare_email
            FROM Reviews r
            INNER JOIN Parents p ON r.parent_id = p.id
            INNER JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.id = ?
        `, [id]);
        return rows[0];
    }

    static async findByDaycareId(daycare_id) {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.first_name, 
                   p.last_name,
                   p.Profile_image as parent_image
            FROM Reviews r
            INNER JOIN Parents p ON r.parent_id = p.id
            WHERE r.daycare_id = ?
            ORDER BY r.review_date DESC
        `, [daycare_id]);
        return rows;
    }

    static async findByParentId(parent_id) {
        const [rows] = await db.query(`
            SELECT r.*, 
                   d.name as daycare_name,
                   d.address as daycare_address
            FROM Reviews r
            INNER JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.parent_id = ?
            ORDER BY r.review_date DESC
        `, [parent_id]);
        return rows;
    }

    static async create(data) {
        const { parent_id, daycare_id, comment, rating } = data;
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        
        // Check if parent has already reviewed this daycare
        const [existing] = await db.query(
            'SELECT * FROM Reviews WHERE parent_id = ? AND daycare_id = ?',
            [parent_id, daycare_id]
        );
        
        if (existing.length > 0) {
            throw new Error('You have already reviewed this daycare');
        }
        
        const [result] = await db.query(
            'INSERT INTO Reviews (parent_id, daycare_id, comment, rating, review_date) VALUES (?, ?, ?, ?, NOW())',
            [parent_id, daycare_id, comment, rating]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { comment, rating } = data;
        
        if (rating && (rating < 1 || rating > 5)) {
            throw new Error('Rating must be between 1 and 5');
        }
        
        const [result] = await db.query(
            'UPDATE Reviews SET comment=?, rating=? WHERE id=?',
            [comment, rating, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM Reviews WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async getAverageRating(daycare_id) {
        const [rows] = await db.query(
            'SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?',
            [daycare_id]
        );
        return {
            average: parseFloat(rows[0].average) || 0,
            total: rows[0].total
        };
    }

    static async getRatingDistribution(daycare_id) {
        const [rows] = await db.query(
            `SELECT rating, COUNT(*) as count 
             FROM Reviews 
             WHERE daycare_id = ? 
             GROUP BY rating 
             ORDER BY rating DESC`,
            [daycare_id]
        );
        
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        rows.forEach(row => {
            distribution[row.rating] = row.count;
        });
        
        return distribution;
    }
}

module.exports = Review;