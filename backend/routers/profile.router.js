const express = require('express')

const { authenticateToken } = require('../middlewares/auth.middleware.js')
const profileController = require('../controllers/profile.controller.js')

const router = express.Router()

// Public routes with validation
router.get('', authenticateToken, profileController.getProfile)
router.get('/:id', profileController.getProfileById)
router.patch('/:id', authenticateToken, profileController.updateProfile)

module.exports = router
