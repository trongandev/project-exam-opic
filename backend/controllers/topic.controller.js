const TopicService = require('../services/topic.service')
const SuccessResponse = require('../core/success')
const ErrorResponse = require('../core/error')
const catchAsync = require('../middlewares/catchAsync')

class TopicController {
    // [GET] /api/topics - Lấy danh sách topics với phân trang
    getAllTopics = catchAsync(async (req, res, next) => {
        const { page = 1, limit = 10, search, isActive } = req.query

        const result = await TopicService.getAllTopics({
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
        })

        return SuccessResponse.ok(
            res,
            'Lấy danh sách chủ đề thành công',
            result
        )
    })

    // [GET] /api/topics/:id - Lấy topic theo ID
    getTopicById = catchAsync(async (req, res, next) => {
        const { id } = req.params

        const result = await TopicService.getTopicById(id)

        return SuccessResponse.ok(
            res,
            'Lấy thông tin chủ đề thành công',
            result
        )
    })

    // [GET] /api/topics/slug/:slug - Lấy topic theo slug
    getTopicBySlug = catchAsync(async (req, res, next) => {
        const { slug } = req.params

        const result = await TopicService.getTopicBySlug(slug)

        return SuccessResponse.ok(
            res,
            'Lấy thông tin chủ đề thành công',
            result
        )
    })

    // [POST] /api/topics - Tạo topic mới
    createTopic = catchAsync(async (req, res, next) => {
        const { name, slug, description, questions } = req.body

        const result = await TopicService.createTopic({
            name,
            slug,
            description,
            questions,
        })

        return SuccessResponse.created(res, 'Tạo chủ đề thành công', result)
    })

    // [PUT] /api/topics/:id - Cập nhật topic
    updateTopic = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const { name, slug, description, isActive, questions } = req.body

        const result = await TopicService.updateTopic(id, {
            name,
            slug,
            description,
            isActive,
            questions,
        })

        return SuccessResponse.ok(res, 'Cập nhật chủ đề thành công', result)
    })

    // [DELETE] /api/topics/:id - Xóa topic (soft delete)
    deleteTopic = catchAsync(async (req, res, next) => {
        const { id } = req.params

        const result = await TopicService.deleteTopic(id)

        return SuccessResponse.ok(res, 'Xóa chủ đề thành công', result)
    })

    // [POST] /api/topics/:id/questions - Thêm câu hỏi vào topic
    addQuestionToTopic = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const { questionText, type, hints, sampleAnswer, keywords } = req.body

        const result = await TopicService.addQuestionToTopic(id, {
            questionText,
            type,
            hints,
            sampleAnswer,
            keywords,
        })

        return SuccessResponse.ok(res, 'Thêm câu hỏi thành công', result)
    })

    // [PUT] /api/topics/:topicId/questions/:questionId - Cập nhật câu hỏi
    updateQuestion = catchAsync(async (req, res, next) => {
        const { topicId, questionId } = req.params
        const { questionText, type, hints, sampleAnswer, keywords } = req.body

        const result = await TopicService.updateQuestion(topicId, questionId, {
            questionText,
            type,
            hints,
            sampleAnswer,
            keywords,
        })

        return SuccessResponse.ok(res, 'Cập nhật câu hỏi thành công', result)
    })

    // [DELETE] /api/topics/:topicId/questions/:questionId - Xóa câu hỏi
    deleteQuestion = catchAsync(async (req, res, next) => {
        const { topicId, questionId } = req.params

        const result = await TopicService.deleteQuestion(topicId, questionId)

        return SuccessResponse.ok(res, 'Xóa câu hỏi thành công', result)
    })
}

module.exports = new TopicController()
