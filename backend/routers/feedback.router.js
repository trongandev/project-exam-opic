const express = require('express')

const { authenticateToken, checkRoleAdmin } = require('../middlewares/auth.middleware.js')
const FeedbackController = require('../controllers/feedback.controller.js')

const router = express.Router()

// Public routes with validation
router.get('', FeedbackController.getAllFeedbacks)
router.get('/:id', FeedbackController.getFeedbackById)

router.post('', authenticateToken, FeedbackController.createFeedback)
router.patch('/:feedbackId', authenticateToken, checkRoleAdmin, FeedbackController.updateFeedback)
router.delete('/:id', authenticateToken, checkRoleAdmin, FeedbackController.deleteFeedback)

module.exports = router
