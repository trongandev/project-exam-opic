const express = require('express')
const router = express.Router()

const ExamHistoryController = require('../controllers/examHistory.controller')
const {
    validateCreateExamHistory,
    validateUpdateExamHistory,
    validateAddAnswer,
    validateUpdateAnswer,
    validateExamHistoryId,
    validateUserId,
    validateAnswerId,
    validateQueryParams,
} = require('../middlewares/examHistory.validation')
const { authenticateToken } = require('../middlewares/auth.middleware')

// Tất cả routes đều cần xác thực
router.use(authenticateToken)

// Personal routes - routes cho user hiện tại
// [GET] /api/exam-histories/my-histories - Lấy lịch sử thi của user hiện tại
router.get(
    '/my-histories',
    validateQueryParams,
    ExamHistoryController.getMyExamHistories
)

// [GET] /api/exam-histories/my-statistics - Lấy thống kê của user hiện tại
router.get('/my-statistics', ExamHistoryController.getMyStatistics)

// Admin routes - quản lý tất cả exam histories
// [GET] /api/exam-histories - Lấy danh sách lịch sử thi (admin)
router.get('/', validateQueryParams, ExamHistoryController.getAllExamHistories)

// [GET] /api/exam-histories/user/:userId - Lấy lịch sử thi theo user (admin)
router.get(
    '/user/:userId',
    validateUserId,
    validateQueryParams,
    ExamHistoryController.getExamHistoriesByUserId
)

// [GET] /api/exam-histories/statistics/:userId - Lấy thống kê theo user (admin)
router.get(
    '/statistics/:userId',
    validateUserId,
    ExamHistoryController.getUserStatistics
)

// [GET] /api/exam-histories/:id - Lấy lịch sử thi theo ID
router.get(
    '/:id',
    validateExamHistoryId,
    ExamHistoryController.getExamHistoryById
)

// CRUD routes
// [POST] /api/exam-histories - Tạo lịch sử thi mới
router.post(
    '/',
    validateCreateExamHistory,
    ExamHistoryController.createExamHistory
)

// [PUT] /api/exam-histories/:id - Cập nhật lịch sử thi
router.put(
    '/:id',
    validateExamHistoryId,
    validateUpdateExamHistory,
    ExamHistoryController.updateExamHistory
)

// [DELETE] /api/exam-histories/:id - Xóa lịch sử thi
router.delete(
    '/:id',
    validateExamHistoryId,
    ExamHistoryController.deleteExamHistory
)

// Answer routes
// [POST] /api/exam-histories/:id/answers - Thêm answer vào exam history
router.post(
    '/:id/answers',
    validateExamHistoryId,
    validateAddAnswer,
    ExamHistoryController.addAnswerToExamHistory
)

// [PUT] /api/exam-histories/:historyId/answers/:answerId - Cập nhật answer
router.put(
    '/:historyId/answers/:answerId',
    validateAnswerId,
    validateUpdateAnswer,
    ExamHistoryController.updateAnswer
)

module.exports = router
