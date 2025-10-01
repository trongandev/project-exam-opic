const { TopicModel } = require('../models/topic.model')
const ErrorResponse = require('../core/error')

class TopicService {
    // Lấy danh sách topics với phân trang và tìm kiếm
    async getAllTopics({ page = 1, limit = 10, search, isActive }) {
        const skip = (page - 1) * limit
        const query = {}

        // Tìm kiếm theo tên hoặc mô tả
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]
        }

        // Lọc theo trạng thái active
        if (isActive !== undefined) {
            query.isActive = isActive
        }

        const [topics, total] = await Promise.all([
            TopicModel.find(query)
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
            topics,
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
        const topic = await TopicModel.findById(id).lean()

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        return topic
    }

    // Lấy topic theo slug
    async getTopicBySlug(slug) {
        const topic = await TopicModel.findOne({ slug, isActive: true }).lean()

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        return topic
    }

    // Tạo topic mới
    async createTopic({ name, slug, description, questions = [] }) {
        // Kiểm tra xem tên hoặc slug đã tồn tại chưa
        const existingTopic = await TopicModel.findOne({
            $or: [{ name: name }, { slug: slug }],
        })

        if (existingTopic) {
            if (existingTopic.name === name) {
                throw new ErrorResponse('Tên chủ đề đã tồn tại', 400)
            }
            if (existingTopic.slug === slug) {
                throw new ErrorResponse('Slug chủ đề đã tồn tại', 400)
            }
        }

        const topic = new TopicModel({
            name,
            slug: slug.toLowerCase(),
            description,
            questions,
        })

        await topic.save()

        return topic
    }

    // Cập nhật topic
    async updateTopic(id, { name, slug, description, isActive, questions }) {
        const topic = await TopicModel.findById(id)

        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề', 404)
        }

        // Kiểm tra trùng lặp tên hoặc slug (ngoại trừ chính nó)
        if (name || slug) {
            const query = { _id: { $ne: id } }
            if (name) query.name = name
            if (slug) query.slug = slug.toLowerCase()

            const existingTopic = await TopicModel.findOne({
                _id: { $ne: id },
                $or: [],
            })

            if (name) {
                existingTopic?.$or?.push({ name: name })
            }
            if (slug) {
                existingTopic?.$or?.push({ slug: slug.toLowerCase() })
            }

            if (
                name &&
                (await TopicModel.findOne({ _id: { $ne: id }, name: name }))
            ) {
                throw new ErrorResponse('Tên chủ đề đã tồn tại', 400)
            }
            if (
                slug &&
                (await TopicModel.findOne({
                    _id: { $ne: id },
                    slug: slug.toLowerCase(),
                }))
            ) {
                throw new ErrorResponse('Slug chủ đề đã tồn tại', 400)
            }
        }

        // Cập nhật các trường
        if (name !== undefined) topic.name = name
        if (slug !== undefined) topic.slug = slug.toLowerCase()
        if (description !== undefined) topic.description = description
        if (isActive !== undefined) topic.isActive = isActive
        if (questions !== undefined) topic.questions = questions

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
        if (questionData.questionText !== undefined)
            question.questionText = questionData.questionText
        if (questionData.type !== undefined) question.type = questionData.type
        if (questionData.hints !== undefined)
            question.hints = questionData.hints
        if (questionData.sampleAnswer !== undefined)
            question.sampleAnswer = questionData.sampleAnswer
        if (questionData.keywords !== undefined)
            question.keywords = questionData.keywords

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
}

module.exports = new TopicService()
