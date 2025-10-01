const { HistoryModel } = require('../models/examHistory.model')
const { TopicModel } = require('../models/topic.model')
const ErrorResponse = require('../core/error')

class ExamHistoryService {
    // Lấy danh sách lịch sử thi với phân trang và filter
    async getAllExamHistories({
        page = 1,
        limit = 10,
        userId,
        topicId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    }) {
        const skip = (page - 1) * limit
        const query = {}

        // Filter theo userId
        if (userId) {
            query.userId = userId
        }

        // Filter theo topicId
        if (topicId) {
            query.topicId = topicId
        }

        // Xác định thứ tự sắp xếp
        const sort = {}
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1

        const [examHistories, total] = await Promise.all([
            HistoryModel.find(query)
                .populate('userId', 'displayName email')
                .populate('topicId', 'name slug')
                .skip(skip)
                .limit(limit)
                .sort(sort)
                .lean(),
            HistoryModel.countDocuments(query),
        ])

        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        return {
            examHistories,
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

    // Lấy lịch sử thi theo ID
    async getExamHistoryById(id) {
        const examHistory = await HistoryModel.findById(id)
            .populate('userId', 'displayName email')
            .populate('topicId', 'name slug questions')
            .lean()

        if (!examHistory) {
            throw new ErrorResponse('Không tìm thấy lịch sử thi', 404)
        }

        return examHistory
    }

    // Lấy lịch sử thi theo userId
    async getExamHistoriesByUserId(
        userId,
        {
            page = 1,
            limit = 10,
            topicId,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        }
    ) {
        const skip = (page - 1) * limit
        const query = { userId }

        // Filter theo topicId
        if (topicId) {
            query.topicId = topicId
        }

        // Xác định thứ tự sắp xếp
        const sort = {}
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1

        const [examHistories, total] = await Promise.all([
            HistoryModel.find(query)
                .populate('topicId', 'name slug')
                .skip(skip)
                .limit(limit)
                .sort(sort)
                .lean(),
            HistoryModel.countDocuments(query),
        ])

        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        return {
            examHistories,
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

    // Tạo lịch sử thi mới
    async createExamHistory({
        userId,
        topicId,
        score,
        feedback,
        answers = [],
    }) {
        // Kiểm tra topic có tồn tại không
        const topic = await TopicModel.findById(topicId)
        if (!topic) {
            throw new ErrorResponse('Không tìm thấy chủ đề thi', 404)
        }

        const examHistory = new HistoryModel({
            userId,
            topicId,
            score,
            feedback,
            answers,
        })

        await examHistory.save()

        // Populate thông tin để trả về
        await examHistory.populate('userId', 'displayName email')
        await examHistory.populate('topicId', 'name slug')

        return examHistory
    }

    // Cập nhật lịch sử thi
    async updateExamHistory(id, { score, feedback, answers }) {
        const examHistory = await HistoryModel.findById(id)

        if (!examHistory) {
            throw new ErrorResponse('Không tìm thấy lịch sử thi', 404)
        }

        // Cập nhật các trường
        if (score !== undefined) examHistory.score = score
        if (feedback !== undefined) examHistory.feedback = feedback
        if (answers !== undefined) examHistory.answers = answers

        await examHistory.save()

        // Populate thông tin để trả về
        await examHistory.populate('userId', 'displayName email')
        await examHistory.populate('topicId', 'name slug')

        return examHistory
    }

    // Xóa lịch sử thi
    async deleteExamHistory(id) {
        const examHistory = await HistoryModel.findById(id)

        if (!examHistory) {
            throw new ErrorResponse('Không tìm thấy lịch sử thi', 404)
        }

        await HistoryModel.findByIdAndDelete(id)

        return { message: 'Đã xóa lịch sử thi thành công' }
    }

    // Lấy thống kê điểm của user
    async getUserStatistics(userId) {
        const pipeline = [
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalExams: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' },
                    totalScore: { $sum: '$score' },
                },
            },
        ]

        const [statistics] = await HistoryModel.aggregate(pipeline)

        if (!statistics) {
            return {
                totalExams: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                totalScore: 0,
            }
        }

        // Lấy thống kê theo từng chủ đề
        const topicStatistics = await HistoryModel.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$topicId',
                    count: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lastExam: { $max: '$createdAt' },
                },
            },
            {
                $lookup: {
                    from: 'topicmodels',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'topic',
                },
            },
            {
                $unwind: '$topic',
            },
            {
                $project: {
                    topicName: '$topic.name',
                    topicSlug: '$topic.slug',
                    count: 1,
                    averageScore: 1,
                    highestScore: 1,
                    lastExam: 1,
                },
            },
        ])

        return {
            ...statistics,
            averageScore: Math.round(statistics.averageScore * 100) / 100,
            topicStatistics,
        }
    }

    // Thêm answer vào exam history
    async addAnswerToExamHistory(historyId, answerData) {
        const examHistory = await HistoryModel.findById(historyId)

        if (!examHistory) {
            throw new ErrorResponse('Không tìm thấy lịch sử thi', 404)
        }

        examHistory.answers.push(answerData)
        await examHistory.save()

        return examHistory
    }

    // Cập nhật answer trong exam history
    async updateAnswer(historyId, answerId, answerData) {
        const examHistory = await HistoryModel.findById(historyId)

        if (!examHistory) {
            throw new ErrorResponse('Không tìm thấy lịch sử thi', 404)
        }

        const answer = examHistory.answers.id(answerId)
        if (!answer) {
            throw new ErrorResponse('Không tìm thấy câu trả lời', 404)
        }

        // Cập nhật các trường
        if (answerData.userAnswer !== undefined)
            answer.userAnswer = answerData.userAnswer
        if (answerData.audioUrl !== undefined)
            answer.audioUrl = answerData.audioUrl
        if (answerData.analysis !== undefined)
            answer.analysis = answerData.analysis

        await examHistory.save()

        return examHistory
    }
}

module.exports = new ExamHistoryService()
