const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protectParent, protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/daycare/:daycareId', reviewController.getReviewsByDaycare);
router.get('/daycare/:daycareId/rating', reviewController.getDaycareRating);

// Parent routes (require login)
router.use(protectParent);
router.get('/my-reviews', reviewController.getMyReviews);
router.post('/:daycareId', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

// Admin routes
router.use(protectAdmin);
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.delete('/admin/:id', reviewController.deleteReviewAdmin);

module.exports = router;