const db = require('../config/db');

class Parent {
    static async findAll() {
        const [rows] = await db.query('SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, first_name, last_name, email, phone, Profile_image, is_verified FROM Parents WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM Parents WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(data) {
        const { first_name, last_name, email, password, phone, Profile_image, verification_code } = data;
        const [result] = await db.query(
            'INSERT INTO Parents (first_name, last_name, email, password, phone, Profile_image, verification_code, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
            [first_name, last_name, email, password, phone, Profile_image, verification_code]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { first_name, last_name, email, phone, Profile_image } = data;
        const [result] = await db.query(
            'UPDATE Parents SET first_name=?, last_name=?, email=?, phone=?, Profile_image=? WHERE id=?',
            [first_name, last_name, email, phone, Profile_image, id]
        );
        return result.affectedRows;
    }

    static async updatePassword(id, password) {
        const [result] = await db.query(
            'UPDATE Parents SET password=? WHERE id=?',
            [password, id]
        );
        return result.affectedRows;
    }

    static async verifyEmail(email, verification_code) {
        const [result] = await db.query(
            'UPDATE Parents SET is_verified=1, verification_code=NULL WHERE email=? AND verification_code=?',
            [email, verification_code]
        );
        return result.affectedRows;
    }

    static async setVerificationCode(email, code) {
        const [result] = await db.query(
            'UPDATE Parents SET verification_code=? WHERE email=?',
            [code, email]
        );
        return result.affectedRows;
    }

    static async setResetCode(email, code) {
        const [result] = await db.query(
            'UPDATE Parents SET reset_code=? WHERE email=?',
            [code, email]
        );
        return result.affectedRows;
    }

    static async checkResetCode(email, code) {
        const [rows] = await db.query(
            'SELECT * FROM Parents WHERE email=? AND reset_code=?',
            [email, code]
        );
        return rows[0];
    }

    static async clearResetCode(email) {
        const [result] = await db.query(
            'UPDATE Parents SET reset_code=NULL WHERE email=?',
            [email]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM Parents WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Parent;