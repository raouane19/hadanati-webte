const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protectParent, protectDaycare, protectAdmin } = require('../middleware/authMiddleware');

// Parent routes
router.use(protectParent);
router.get('/my-requests', requestController.getParentRequests);
router.post('/', requestController.createRequest);
router.delete('/:id', requestController.deleteRequest);

// Daycare routes
router.use(protectDaycare);
router.get('/daycare-requests', requestController.getDaycareRequests);
router.put('/:id/accept', requestController.acceptRequest);
router.put('/:id/reject', requestController.rejectRequest);

// Admin routes
router.use(protectAdmin);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.get('/status/:status', requestController.getRequestsByStatus);

module.exports = router;