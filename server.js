const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const db = require('./config/db');

// Import route files (only the ones you have)
const authRoutes = require('./routes/auth');
const parentRoutes = require('./routes/parent');
const daycareRoutes = require('./routes/daycare');
const adminRoutes = require('./routes/admin');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { requestLogger } = require('./middleware/loggerMiddleware');
const { dynamicCors } = require('./middleware/corsMiddleware');

dotenv.config();

const app = express();

// ===== MIDDLEWARES =====
app.use(dynamicCors);
app.use(morgan('dev'));
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== DATABASE CONNECTION =====
db.getConnection()
    .then(() => console.log('🟢 MySQL Connected - hadanati_project'.bgGreen.white))
    .catch(err => console.log('🔴 MySQL Error:'.red, err.message));

// ===== TEST ROUTES =====
app.get('/test', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        uptime: process.uptime(),
        database: 'connected'
    });
});

// ===== API ROUTES =====
// Authentication routes (register, login, verify, forgot/reset password)
app.use('/api/auth', authRoutes);

// Parent routes (profile, children, saved daycares, reviews)
app.use('/api/parents', parentRoutes);

// Daycare routes (profile, activities, requests)
app.use('/api/daycares', daycareRoutes);

// Admin routes (dashboard, management)
app.use('/api/admin', adminRoutes);

// ===== PUBLIC ROUTES (for testing) =====
// GET all Parents (public)
app.get('/api/parents', async (req, res) => {
    try {
        const [results] = await db.query('SELECT id, first_name, last_name, email, phone, is_verified FROM Parents');
        res.json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all Daycares (public - active only)
app.get('/api/daycares', async (req, res) => {
    try {
        const [results] = await db.query('SELECT id, name, email, phone, address, capacity, age_range, price, profile_image, has_activities FROM Daycares WHERE is_active = 1 AND is_verified = 1');
        res.json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET single Daycare (public)
app.get('/api/daycares/:id', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Daycares WHERE id = ? AND is_active = 1 AND is_verified = 1', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Daycare not found' });
        }
        res.json({ success: true, data: results[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET daycare rating
app.get('/api/daycares/:id/rating', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?', [req.params.id]);
        res.json({ success: true, average: parseFloat(rows[0].average) || 0, total_reviews: rows[0].total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all Children (public)
app.get('/api/children', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT c.*, p.first_name as parent_first_name, p.last_name as parent_last_name 
            FROM Children c
            JOIN Parents p ON c.parent_id = p.id
        `);
        res.json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all Requests (public)
app.get('/api/requests', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT r.*, p.first_name as parent_name, c.name as child_name, d.name as daycare_name
            FROM Requests r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Children c ON r.child_id = c.id
            JOIN Daycares d ON r.daycare_id = d.id
            ORDER BY r.request_date DESC
        `);
        res.json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all Reviews (public)
app.get('/api/reviews', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT r.*, p.first_name as parent_name, d.name as daycare_name
            FROM Reviews r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Daycares d ON r.daycare_id = d.id
            ORDER BY r.review_date DESC
        `);
        res.json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ===== ERROR HANDLING (MUST BE LAST) =====
app.use(notFound);
app.use(errorHandler);

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`.bgMagenta);
    console.log(`🚀 SERVER STARTED SUCCESSFULLY`.bgMagenta.white.bold);
    console.log(`${'='.repeat(50)}`.bgMagenta);
    console.log(`📡 Port: ${PORT}`.cyan);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`.cyan);
    console.log(`✅ Test: http://localhost:${PORT}/test`.green);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`.green);
    console.log(`\n📋 Available Routes:`);
    console.log(`   POST   /api/auth/register/parent`.green);
    console.log(`   POST   /api/auth/register/daycare`.green);
    console.log(`   POST   /api/auth/login`.green);
    console.log(`   POST   /api/auth/verify-otp`.green);
    console.log(`   GET    /api/parents/profile/me`.green);
    console.log(`   GET    /api/daycares/profile/me`.green);
    console.log(`   GET    /api/daycares`.green);
    console.log(`   GET    /api/parents`.green);
    console.log(`${'='.repeat(50)}\n`.bgMagenta);
});