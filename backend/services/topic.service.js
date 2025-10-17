const { TopicModel } = require('../models/topic.model')
const ErrorResponse = require('../core/error')

class TopicService {
    // Lấy danh sách topics với phân trang và tìm kiếm
    async getAllTopics({ page = 1, limit = 6, search, isActive }) {
        const skip = (page - 1) * limit
        const query = {}

        // Tìm kiếm theo tên hoặc mô tả
        if (search) {
            query.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]
        }

        // Lọc theo trạng thái active
        query.isActive = true

        const [topics, total] = await Promise.all([
            TopicModel.find(query)
                .populate('userId', '_id displayName email')
                .populate({ path: 'data.categoryId', model: 'CategoryModel', select: '_id icon title desc' })
                .populate('rating.userId', '_id')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            TopicModel.countDocuments(query),
        ])

        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        return {
            data: topics,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage,
            },
        }
    }

    // Lấy topic theo ID
    async getTopicById(id) {
        const topic = await TopicModel.findById(id)
            .populate('userId', '_id displayName email')
            .populate('rating.userId', '_id displayName email')
            .populate({ path: 'data.categoryId', model: 'CategoryModel', select: '_id icon title desc' })
            .lean()

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        await TopicModel.findByIdAndUpdate(topic._id, { $inc: { viewCount: 1 } })

        return topic
    }

    // Lấy topic theo slug
    async getTopicBySlug(slug) {
        const topic = await TopicModel.findOne({ slug })
            .populate('userId', '_id displayName email')
            .populate('rating.userId', '_id displayName email')
            .populate({ path: 'data.categoryId', model: 'CategoryModel', select: '_id icon title desc' })
            .lean()
        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        await TopicModel.findByIdAndUpdate(topic._id, { $inc: { viewCount: 1 } })

        return topic
    }

    // Lấy topic theo slug
    async getTopicByIdToEdit(userId, id) {
        const topic = await TopicModel.findById(id).populate('userId', '_id').populate({ path: 'data.categoryId', model: 'CategoryModel', select: '_id icon title desc' })
        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        if (!topic.isActive) {
            throw new ErrorResponse('Chủ đề đã bị vô hiệu hóa', 400)
        }

        if (topic.userId._id.toString() !== userId.toString()) {
            throw new ErrorResponse('Bạn không có quyền chỉnh sửa chủ đề này', 403)
        }

        return topic
    }

    async getTopicPopulated() {
        const topics = await TopicModel.findOne({ isPopular: true })
            .populate('userId', '_id displayName email')
            .populate({ path: 'data.categoryId', model: 'CategoryModel', select: '_id icon title desc' })
            .populate('rating.userId', '_id displayName email')
            .lean()
        return topics
    }

    // Tạo topic mới
    async createTopic(data) {
        const topic = new TopicModel(data)

        await topic.save()

        return topic
    }

    // Cập nhật topic
    async updateTopic(id, dataTopic) {
        const { name, slug, desc, isActive, data } = dataTopic
        const topic = await TopicModel.findById(id)

        if (!topic) {
            return false
        }

        // Cập nhật các trường
        if (name !== undefined) topic.name = name
        if (slug !== undefined) topic.slug = slug
        if (desc !== undefined) topic.desc = desc
        if (isActive !== undefined) topic.isActive = isActive
        if (data !== undefined) topic.data = data

        await topic.save()

        return topic
    }

    // Xóa topic (soft delete)
    async deleteTopic(id) {
        const topic = await TopicModel.findById(id)

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        topic.isActive = false
        await topic.save()

        return { message: 'Đã xóa chủ đề thành công' }
    }

    // Thêm câu hỏi vào topic
    async addQuestionToTopic(topicId, questionData) {
        const topic = await TopicModel.findById(topicId)

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        topic.questions.push(questionData)
        await topic.save()

        return topic
    }

    // Cập nhật câu hỏi trong topic
    async updateQuestion(topicId, questionId, questionData) {
        const topic = await TopicModel.findById(topicId)

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        const question = topic.questions.id(questionId)
        if (!question) {
            throw new ErrorResponse('Không tìm thấy câu hỏi', 404)
        }

        // Cập nhật các trường
        if (questionData.questionText !== undefined) question.questionText = questionData.questionText
        if (questionData.type !== undefined) question.type = questionData.type
        if (questionData.hints !== undefined) question.hints = questionData.hints
        if (questionData.sampleAnswer !== undefined) question.sampleAnswer = questionData.sampleAnswer
        if (questionData.keywords !== undefined) question.keywords = questionData.keywords

        await topic.save()

        return topic
    }

    // Xóa câu hỏi khỏi topic
    async deleteQuestion(topicId, questionId) {
        const topic = await TopicModel.findById(topicId)

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        const question = topic.questions.id(questionId)
        if (!question) {
            throw new ErrorResponse('Không tìm thấy câu hỏi', 404)
        }

        topic.questions.pull(questionId)
        await topic.save()

        return { message: 'Đã xóa câu hỏi thành công' }
    }

    async ratingTopic(topicSlug, data) {
        const topic = await TopicModel.findOne({ slug: topicSlug })

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        topic.rating.push(data)
        await topic.save()

        return topic
    }
}

module.exports = new TopicService()
