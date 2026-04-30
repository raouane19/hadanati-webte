const db = require('../config/db');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, p.first_name, p.last_name, d.name as daycare_name
            FROM Reviews r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Daycares d ON r.daycare_id = d.id
            ORDER BY r.review_date DESC
        `);
        res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, p.first_name, p.last_name, d.name as daycare_name
            FROM Reviews r
            JOIN Parents p ON r.parent_id = p.id
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.id = ?
        `, [req.params.id]);
        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.json({ success: true, data: reviews[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews by daycare
// @route   GET /api/reviews/daycare/:daycareId
// @access  Public
const getReviewsByDaycare = async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, p.first_name, p.last_name, p.Profile_image as parent_image
            FROM Reviews r
            JOIN Parents p ON r.parent_id = p.id
            WHERE r.daycare_id = ?
            ORDER BY r.review_date DESC
        `, [req.params.daycareId]);
        
        const [avgRating] = await db.query('SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?', [req.params.daycareId]);
        
        res.json({ 
            success: true, 
            data: reviews,
            stats: {
                average: parseFloat(avgRating[0].average) || 0,
                total: avgRating[0].total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my reviews (logged in parent)
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT r.*, d.name as daycare_name, d.address
            FROM Reviews r
            JOIN Daycares d ON r.daycare_id = d.id
            WHERE r.parent_id = ?
            ORDER BY r.review_date DESC
        `, [req.parent.id]);
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/reviews/:daycareId
// @access  Private
const createReview = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const daycare_id = req.params.daycareId;
        const parent_id = req.parent.id;
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        
        const [existing] = await db.query('SELECT id FROM Reviews WHERE parent_id = ? AND daycare_id = ?', [parent_id, daycare_id]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this daycare' });
        }
        
        const [result] = await db.query('INSERT INTO Reviews (parent_id, daycare_id, comment, rating, review_date) VALUES (?, ?, ?, ?, NOW())', [parent_id, daycare_id, comment, rating]);
        
        const [newReview] = await db.query('SELECT * FROM Reviews WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, message: 'Review submitted successfully', data: newReview[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        
        const [review] = await db.query('SELECT parent_id FROM Reviews WHERE id = ?', [req.params.id]);
        if (review.length === 0) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        if (review[0].parent_id !== req.parent.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
        }
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        
        const [result] = await db.query('UPDATE Reviews SET comment = ?, rating = ? WHERE id = ?', [comment, rating, req.params.id]);
        const [updated] = await db.query('SELECT * FROM Reviews WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Review updated successfully', data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const [review] = await db.query('SELECT parent_id FROM Reviews WHERE id = ?', [req.params.id]);
        if (review.length === 0) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        if (review[0].parent_id !== req.parent.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }
        const [result] = await db.query('DELETE FROM Reviews WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a review (admin)
// @route   DELETE /api/reviews/admin/:id
// @access  Private/Admin
const deleteReviewAdmin = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Reviews WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.json({ success: true, message: 'Review deleted successfully by admin' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get daycare rating summary
// @route   GET /api/reviews/daycare/:daycareId/rating
// @access  Public
const getDaycareRating = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT AVG(rating) as average, COUNT(*) as total FROM Reviews WHERE daycare_id = ?', [req.params.daycareId]);
        const [distribution] = await db.query('SELECT rating, COUNT(*) as count FROM Reviews WHERE daycare_id = ? GROUP BY rating ORDER BY rating DESC', [req.params.daycareId]);
        
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        distribution.forEach(row => { ratingDistribution[row.rating] = row.count; });
        
        res.json({ 
            success: true, 
            data: {
                average: parseFloat(rows[0].average) || 0,
                total_reviews: rows[0].total,
                distribution: ratingDistribution
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByDaycare,
    getMyReviews,
    createReview,
    updateReview,
    deleteReview,
    deleteReviewAdmin,
    getDaycareRating};