const express = require('express')

const { authenticateToken } = require('../middlewares/auth.middleware.js')
const categoryController = require('../controllers/category.controller.js')

const router = express.Router()

// Public routes with validation
router.get('', authenticateToken, categoryController.getAllCategories)
router.get('/:id', authenticateToken, categoryController.getCategoryById)

router.post('', authenticateToken, categoryController.createCategory)
router.patch('/:id', authenticateToken, categoryController.updateCategory)

module.exports = router
