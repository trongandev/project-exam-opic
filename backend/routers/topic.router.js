const express = require('express')
const router = express.Router()

const TopicController = require('../controllers/topic.controller')
const { validateCreateTopic, validateUpdateTopic, validateRating } = require('../middlewares/topic.validation')
const { authenticateToken, checkIdIsValid } = require('../middlewares/auth.middleware')

// Public routes - không cần xác thực
// [GET] /api/topics - Lấy danh sách topics (public để user có thể xem)
router.get('/', TopicController.getAllTopics)

// [GET] /api/topics/slug/:slug - Lấy topic theo slug (public)
router.get('/slug/:slug', TopicController.getTopicBySlug)

// [GET] /api/topics/:id - Lấy topic theo ID (public)
router.get('/:id', checkIdIsValid, TopicController.getTopicById)

// Protected routes - cần xác thực
// [POST] /api/topics - Tạo topic mới
// [GET] /api/topics/:id - Lấy topic theo ID (public)
router.get('/:id/edit', authenticateToken, checkIdIsValid, TopicController.getTopicByIdToEdit)
router.post('/', authenticateToken, validateCreateTopic, TopicController.createTopic)

// [PUT] /api/topics/:id - Cập nhật topic
router.patch('/:id', authenticateToken, checkIdIsValid, validateUpdateTopic, TopicController.updateTopic)

// [DELETE] /api/topics/:id - Xóa topic
router.delete('/:id', authenticateToken, checkIdIsValid, TopicController.deleteTopic)

// [POST] /api/topics/:topicSlug/rating - Đánh giá topic
router.post('/:topicSlug/rating', authenticateToken, validateRating, TopicController.ratingTopic)

module.exports = router
