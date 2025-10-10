const express = require('express')
const router = express.Router()

const TopicController = require('../controllers/topic.controller')
const { validateCreateTopic, validateUpdateTopic, validateAddQuestion, validateUpdateQuestion, validateTopicId, validateQuestionId } = require('../middlewares/topic.validation')
const { authenticateToken } = require('../middlewares/auth.middleware')

// Public routes - không cần xác thực
// [GET] /api/topics - Lấy danh sách topics (public để user có thể xem)
router.get('/', TopicController.getAllTopics)

// [GET] /api/topics/slug/:slug - Lấy topic theo slug (public)
router.get('/slug/:slug', TopicController.getTopicBySlug)

// [GET] /api/topics/:id - Lấy topic theo ID (public)
router.get('/:id', validateTopicId, TopicController.getTopicById)

// Protected routes - cần xác thực
// [POST] /api/topics - Tạo topic mới (chỉ admin)
router.post('/', authenticateToken, validateCreateTopic, TopicController.createTopic)

// [PUT] /api/topics/:id - Cập nhật topic (chỉ admin)
router.patch('/:id', authenticateToken, validateTopicId, validateUpdateTopic, TopicController.updateTopic)

// [DELETE] /api/topics/:id - Xóa topic (chỉ admin)
router.delete('/:id', authenticateToken, validateTopicId, TopicController.deleteTopic)

module.exports = router
