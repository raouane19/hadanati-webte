const express = require('express');
const router = express.Router();
const savedDaycareController = require('../controllers/savedDaycareController');
const { protectParent } = require('../middleware/authMiddleware');

// All routes require parent authentication
router.use(protectParent);

router.get('/', savedDaycareController.getSavedDaycares);
router.get('/count', savedDaycareController.getSavedCount);
router.post('/:daycareId', savedDaycareController.saveDaycare);
router.delete('/:daycareId', savedDaycareController.unsaveDaycare);
router.get('/check/:daycareId', savedDaycareController.checkSaved);

module.exports = router;