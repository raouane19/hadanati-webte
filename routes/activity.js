const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protectDaycare, protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', activityController.getAllActivities);
router.get('/daycare/:daycareId', activityController.getActivitiesByDaycare);
router.get('/age-range/:ageRange', activityController.getActivitiesByAgeRange);
router.get('/:id', activityController.getActivityById);

// Daycare routes (require daycare login)
router.use(protectDaycare);
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.get('/my-daycare/activities', activityController.getMyDaycareActivities);

// Admin routes
router.use(protectAdmin);
router.delete('/admin/:id', activityController.deleteActivityAdmin);

module.exports = router;