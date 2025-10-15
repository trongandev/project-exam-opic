const express = require('express')

const { authenticateToken, checkRoleAdmin } = require('../middlewares/auth.middleware.js')
const categoryController = require('../controllers/category.controller.js')

const router = express.Router()

// Public routes with validation
router.get('', categoryController.getAllCategories)
router.get('/:id', categoryController.getCategoryById)

router.post('', authenticateToken, categoryController.createCategory)
router.post('/many', authenticateToken, checkRoleAdmin, categoryController.createManyCategory)
router.patch('/:id', authenticateToken, checkRoleAdmin, categoryController.updateCategory)
router.delete('/:id', authenticateToken, checkRoleAdmin, categoryController.deleteCategory)

module.exports = router
