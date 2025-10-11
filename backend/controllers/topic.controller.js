const TopicService = require('../services/topic.service')
const SuccessResponse = require('../core/success')
const ErrorResponse = require('../core/error')
const catchAsync = require('../middlewares/catchAsync')
const { generateSlug } = require('../utils/generateSlug')
class TopicController {
    // [GET] /api/topics - Lấy danh sách topics với phân trang
    getAllTopics = catchAsync(async (req, res, next) => {
        const { page = 1, limit = 6, search, isActive } = req.query

        const result = await TopicService.getAllTopics({
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            isActive,
        })

        return SuccessResponse.ok(res, 'Lấy danh sách chủ đề thành công', result)
    })

    // [GET] /api/topics/:id - Lấy topic theo ID
    getTopicById = catchAsync(async (req, res, next) => {
        const { id } = req.params

        const result = await TopicService.getTopicById(id)

        return SuccessResponse.ok(res, 'Lấy thông tin chủ đề thành công', result)
    })

    // [GET] /api/topics/slug/:slug - Lấy topic theo slug
    getTopicBySlug = catchAsync(async (req, res, next) => {
        const { slug } = req.params

        const result = await TopicService.getTopicBySlug(slug)

        return SuccessResponse.ok(res, 'Lấy thông tin chủ đề thành công', result)
    })

    // [GET] /api/topics/slug/:slug - Lấy topic theo slug
    getTopicByIdToEdit = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const userId = req.user.id
        const result = await TopicService.getTopicByIdToEdit(userId, id)

        return SuccessResponse.ok(res, 'Lấy thông tin chủ đề thành công', result)
    })

    // [POST] /api/topics - Tạo topic mới
    createTopic = catchAsync(async (req, res, next) => {
        const { name, desc, data } = req.body
        const result = await TopicService.createTopic({
            userId: req.user.id,
            name,
            slug: generateSlug(name),
            desc,
            data,
        })

        return SuccessResponse.created(res, 'Tạo chủ đề thành công', result)
    })

    // [PUT] /api/topics/:id - Cập nhật topic
    updateTopic = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const { name, desc, isActive, data } = req.body

        const result = await TopicService.updateTopic(id, {
            userId: req.user.id,
            name,
            slug: generateSlug(name),
            desc,
            isActive,
            data,
        })

        return SuccessResponse.ok(res, 'Cập nhật chủ đề thành công', result)
    })

    // [DELETE] /api/topics/:id - Xóa topic (soft delete)
    deleteTopic = catchAsync(async (req, res, next) => {
        const { id } = req.params

        const result = await TopicService.deleteTopic(id)

        return SuccessResponse.ok(res, '', result)
    })

    // [POST] /api/topics/:id/rating - Đánh giá topic
    ratingTopic = catchAsync(async (req, res, next) => {
        const { topicSlug } = req.params
        const { score, comment } = req.body

        const result = await TopicService.ratingTopic(topicSlug, {
            userId: req.user.id,
            score,
            comment,
        })

        return SuccessResponse.ok(res, 'Đánh giá chủ đề thành công', result)
    })
}

module.exports = new TopicController()
