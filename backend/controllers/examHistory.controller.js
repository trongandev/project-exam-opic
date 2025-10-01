const ExamHistoryService = require('../services/examHistory.service')
const SuccessResponse = require('../core/success')
const ErrorResponse = require('../core/error')
const catchAsync = require('../middlewares/catchAsync')

class ExamHistoryController {
    // [GET] /api/exam-histories - Lấy danh sách lịch sử thi với phân trang
    getAllExamHistories = catchAsync(async (req, res, next) => {
        const {
            page = 1,
            limit = 10,
            userId,
            topicId,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query

        const result = await ExamHistoryService.getAllExamHistories({
            page: parseInt(page),
            limit: parseInt(limit),
            userId,
            topicId,
            sortBy,
            sortOrder,
        })

        return SuccessResponse.ok(
            res,
            'Lấy danh sách lịch sử thi thành công',
            result
        )
    })

    // [GET] /api/exam-histories/:id - Lấy lịch sử thi theo ID
    getExamHistoryById = catchAsync(async (req, res, next) => {
        const { id } = req.params

        const result = await ExamHistoryService.getExamHistoryById(id)

        return SuccessResponse.ok(
            res,
            'Lấy thông tin lịch sử thi thành công',
            result
        )
    })

    // [GET] /api/exam-histories/user/:userId - Lấy lịch sử thi theo user
    getExamHistoriesByUserId = catchAsync(async (req, res, next) => {
        const { userId } = req.params
        const {
            page = 1,
            limit = 10,
            topicId,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query

        const result = await ExamHistoryService.getExamHistoriesByUserId(
            userId,
            {
                page: parseInt(page),
                limit: parseInt(limit),
                topicId,
                sortBy,
                sortOrder,
            }
        )

        return SuccessResponse.ok(
            res,
            'Lấy lịch sử thi của user thành công',
            result
        )
    })

    // [GET] /api/exam-histories/my-histories - Lấy lịch sử thi của user hiện tại
    getMyExamHistories = catchAsync(async (req, res, next) => {
        const userId = req.user.id
        const {
            page = 1,
            limit = 10,
            topicId,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query

        const result = await ExamHistoryService.getExamHistoriesByUserId(
            userId,
            {
                page: parseInt(page),
                limit: parseInt(limit),
                topicId,
                sortBy,
                sortOrder,
            }
        )

        return SuccessResponse.ok(
            res,
            'Lấy lịch sử thi của bạn thành công',
            result
        )
    })

    // [POST] /api/exam-histories - Tạo lịch sử thi mới
    createExamHistory = catchAsync(async (req, res, next) => {
        const { topicId, score, feedback, answers } = req.body
        const userId = req.user.id

        const result = await ExamHistoryService.createExamHistory({
            userId,
            topicId,
            score,
            feedback,
            answers,
        })

        return SuccessResponse.created(
            res,
            'Tạo lịch sử thi thành công',
            result
        )
    })

    // [PUT] /api/exam-histories/:id - Cập nhật lịch sử thi
    updateExamHistory = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const { score, feedback, answers } = req.body

        const result = await ExamHistoryService.updateExamHistory(id, {
            score,
            feedback,
            answers,
        })

        return SuccessResponse.ok(
            res,
            'Cập nhật lịch sử thi thành công',
            result
        )
    })

    // [DELETE] /api/exam-histories/:id - Xóa lịch sử thi
    deleteExamHistory = catchAsync(async (req, res, next) => {
        const { id } = req.params

        const result = await ExamHistoryService.deleteExamHistory(id)

        return SuccessResponse.ok(res, 'Xóa lịch sử thi thành công', result)
    })

    // [GET] /api/exam-histories/statistics/:userId - Lấy thống kê điểm của user
    getUserStatistics = catchAsync(async (req, res, next) => {
        const { userId } = req.params

        const result = await ExamHistoryService.getUserStatistics(userId)

        return SuccessResponse.ok(res, 'Lấy thống kê thành công', result)
    })

    // [GET] /api/exam-histories/my-statistics - Lấy thống kê điểm của user hiện tại
    getMyStatistics = catchAsync(async (req, res, next) => {
        const userId = req.user.id

        const result = await ExamHistoryService.getUserStatistics(userId)

        return SuccessResponse.ok(
            res,
            'Lấy thống kê của bạn thành công',
            result
        )
    })

    // [POST] /api/exam-histories/:id/answers - Thêm answer vào exam history
    addAnswerToExamHistory = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const { questionId, userAnswer, audioUrl, analysis } = req.body

        const result = await ExamHistoryService.addAnswerToExamHistory(id, {
            questionId,
            userAnswer,
            audioUrl,
            analysis,
        })

        return SuccessResponse.ok(res, 'Thêm câu trả lời thành công', result)
    })

    // [PUT] /api/exam-histories/:historyId/answers/:answerId - Cập nhật answer
    updateAnswer = catchAsync(async (req, res, next) => {
        const { historyId, answerId } = req.params
        const { userAnswer, audioUrl, analysis } = req.body

        const result = await ExamHistoryService.updateAnswer(
            historyId,
            answerId,
            {
                userAnswer,
                audioUrl,
                analysis,
            }
        )

        return SuccessResponse.ok(
            res,
            'Cập nhật câu trả lời thành công',
            result
        )
    })
}

module.exports = new ExamHistoryController()
