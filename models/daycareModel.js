const db = require('../config/db');

class Daycare {
    static async findAll() {
        const [rows] = await db.query('SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, is_active, has_activities, is_verified FROM Daycares');
        return rows;
    }

    static async findActive() {
        const [rows] = await db.query('SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, is_active, has_activities FROM Daycares WHERE is_active = 1 AND is_verified = 1');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, name, email, phone, address, lat, lon, capacity, age_range, price, education_info, healthcare_info, social_media, profile_image, is_active, has_activities, is_verified FROM Daycares WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM Daycares WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(data) {
        const { 
            name, email, password, phone, address, lat, lon, 
            capacity, age_range, price, education_info, healthcare_info, 
            social_media, profile_image, verification_code 
        } = data;
        
        const [result] = await db.query(
            `INSERT INTO Daycares 
            (name, email, password, phone, address, lat, lon, capacity, age_range, 
             price, education_info, healthcare_info, social_media, profile_image, verification_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, password, phone, address, lat, lon, capacity, age_range, 
             price, education_info, healthcare_info, social_media, profile_image, verification_code]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { 
            name, email, phone, address, lat, lon, capacity, age_range, price, 
            education_info, healthcare_info, social_media, profile_image 
        } = data;
        
        const [result] = await db.query(
            `UPDATE Daycares SET 
            name=?, email=?, phone=?, address=?, lat=?, lon=?, 
            capacity=?, age_range=?, price=?, education_info=?, 
            healthcare_info=?, social_media=?, profile_image=? 
            WHERE id=?`,
            [name, email, phone, address, lat, lon, capacity, age_range, price, 
             education_info, healthcare_info, social_media, profile_image, id]
        );
        return result.affectedRows;
    }

    static async updatePassword(id, password) {
        const [result] = await db.query(
            'UPDATE Daycares SET password=? WHERE id=?',
            [password, id]
        );
        return result.affectedRows;
    }

    static async verifyDaycare(email, verification_code) {
        const [result] = await db.query(
            'UPDATE Daycares SET is_verified=1, verification_code=NULL WHERE email=? AND verification_code=?',
            [email, verification_code]
        );
        return result.affectedRows;
    }

    static async setVerificationCode(email, code) {
        const [result] = await db.query(
            'UPDATE Daycares SET verification_code=? WHERE email=?',
            [code, email]
        );
        return result.affectedRows;
    }

    static async setResetCode(email, code) {
        const [result] = await db.query(
            'UPDATE Daycares SET reset_code=? WHERE email=?',
            [code, email]
        );
        return result.affectedRows;
    }

    static async checkResetCode(email, code) {
        const [rows] = await db.query(
            'SELECT * FROM Daycares WHERE email=? AND reset_code=?',
            [email, code]
        );
        return rows[0];
    }

    static async clearResetCode(email) {
        const [result] = await db.query(
            'UPDATE Daycares SET reset_code=NULL WHERE email=?',
            [email]
        );
        return result.affectedRows;
    }

    static async activate(id) {
        const [result] = await db.query(
            'UPDATE Daycares SET is_active=1 WHERE id=?',
            [id]
        );
        return result.affectedRows;
    }

    static async deactivate(id) {
        const [result] = await db.query(
            'UPDATE Daycares SET is_active=0 WHERE id=?',
            [id]
        );
        return result.affectedRows;
    }

    static async updateHasActivities(id, hasActivities) {
        const [result] = await db.query(
            'UPDATE Daycares SET has_activities=? WHERE id=?',
            [hasActivities, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM Daycares WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Daycare;