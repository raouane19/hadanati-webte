const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');
const { protectParent, protectAdmin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protectParent);

router.get('/', childController.getAllChildren);
router.get('/parent/:parentId', childController.getChildrenByParent);
router.get('/:id', childController.getChildById);
router.post('/', childController.createChild);
router.put('/:id', childController.updateChild);
router.delete('/:id', childController.deleteChild);

// Admin routes
router.use(protectAdmin);
router.get('/admin/all', childController.getAllChildrenAdmin);

module.exports = router;