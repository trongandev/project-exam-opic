const validator = require('validator')
const mongoose = require('mongoose')

// Validation cho tạo exam history
const validateCreateExamHistory = (req, res, next) => {
    const { topicId, score, feedback, answers } = req.body
    const errors = []

    // Kiểm tra topicId
    if (!topicId || !mongoose.Types.ObjectId.isValid(topicId)) {
        errors.push('ID chủ đề không hợp lệ')
    }

    // Kiểm tra score
    if (score === undefined || score === null) {
        errors.push('Điểm số không được để trống')
    } else if (typeof score !== 'number') {
        errors.push('Điểm số phải là một số')
    } else if (score < 0 || score > 100) {
        errors.push('Điểm số phải từ 0 đến 100')
    }

    // Kiểm tra feedback (tùy chọn)
    if (feedback && typeof feedback !== 'string') {
        errors.push('Phản hồi phải là chuỗi')
    } else if (feedback && feedback.length > 1000) {
        errors.push('Phản hồi không được quá 1000 ký tự')
    }

    // Kiểm tra answers (tùy chọn)
    if (answers && Array.isArray(answers)) {
        answers.forEach((answer, index) => {
            const answerErrors = validateAnswer(
                answer,
                `Câu trả lời ${index + 1}`
            )
            errors.push(...answerErrors)
        })
    } else if (answers && !Array.isArray(answers)) {
        errors.push('Danh sách câu trả lời phải là một mảng')
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors,
        })
    }

    next()
}

// Validation cho cập nhật exam history
const validateUpdateExamHistory = (req, res, next) => {
    const { score, feedback, answers } = req.body
    const errors = []

    // Kiểm tra score (tùy chọn)
    if (score !== undefined) {
        if (typeof score !== 'number') {
            errors.push('Điểm số phải là một số')
        } else if (score < 0 || score > 100) {
            errors.push('Điểm số phải từ 0 đến 100')
        }
    }

    // Kiểm tra feedback (tùy chọn)
    if (feedback !== undefined) {
        if (typeof feedback !== 'string') {
            errors.push('Phản hồi phải là chuỗi')
        } else if (feedback.length > 1000) {
            errors.push('Phản hồi không được quá 1000 ký tự')
        }
    }

    // Kiểm tra answers (tùy chọn)
    if (answers !== undefined) {
        if (!Array.isArray(answers)) {
            errors.push('Danh sách câu trả lời phải là một mảng')
        } else {
            answers.forEach((answer, index) => {
                const answerErrors = validateAnswer(
                    answer,
                    `Câu trả lời ${index + 1}`
                )
                errors.push(...answerErrors)
            })
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors,
        })
    }

    next()
}

// Validation cho thêm answer vào exam history
const validateAddAnswer = (req, res, next) => {
    const { questionId, userAnswer, audioUrl, analysis } = req.body
    const errors = validateAnswer({
        questionId,
        userAnswer,
        audioUrl,
        analysis,
    })

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu câu trả lời không hợp lệ',
            errors: errors,
        })
    }

    next()
}

// Validation cho cập nhật answer
const validateUpdateAnswer = (req, res, next) => {
    const { userAnswer, audioUrl, analysis } = req.body
    const errors = []

    // Kiểm tra userAnswer (tùy chọn)
    if (userAnswer !== undefined) {
        if (typeof userAnswer !== 'string') {
            errors.push('Câu trả lời phải là chuỗi')
        } else if (userAnswer.length > 5000) {
            errors.push('Câu trả lời không được quá 5000 ký tự')
        }
    }

    // Kiểm tra audioUrl (tùy chọn)
    if (audioUrl !== undefined) {
        if (typeof audioUrl !== 'string') {
            errors.push('URL audio phải là chuỗi')
        } else if (audioUrl && !validator.isURL(audioUrl)) {
            errors.push('URL audio không hợp lệ')
        }
    }

    // Kiểm tra analysis (tùy chọn)
    if (analysis !== undefined) {
        const analysisErrors = validateAnalysis(analysis)
        errors.push(...analysisErrors)
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu câu trả lời không hợp lệ',
            errors: errors,
        })
    }

    next()
}

// Validation cho ID params
const validateExamHistoryId = (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID lịch sử thi không hợp lệ',
        })
    }

    next()
}

// Validation cho user ID params
const validateUserId = (req, res, next) => {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: 'ID người dùng không hợp lệ',
        })
    }

    next()
}

// Validation cho answer ID params
const validateAnswerId = (req, res, next) => {
    const { historyId, answerId } = req.params

    if (!mongoose.Types.ObjectId.isValid(historyId)) {
        return res.status(400).json({
            success: false,
            message: 'ID lịch sử thi không hợp lệ',
        })
    }

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(400).json({
            success: false,
            message: 'ID câu trả lời không hợp lệ',
        })
    }

    next()
}

// Validation cho query parameters
const validateQueryParams = (req, res, next) => {
    const { page, limit, sortBy, sortOrder } = req.query
    const errors = []

    // Kiểm tra page
    if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
        errors.push('Trang phải là số nguyên dương')
    }

    // Kiểm tra limit
    if (
        limit &&
        (!Number.isInteger(Number(limit)) ||
            Number(limit) < 1 ||
            Number(limit) > 100)
    ) {
        errors.push('Số lượng items phải là số nguyên từ 1 đến 100')
    }

    // Kiểm tra sortBy
    if (sortBy) {
        const validSortFields = ['createdAt', 'score', 'updatedAt']
        if (!validSortFields.includes(sortBy)) {
            errors.push(
                'Trường sắp xếp không hợp lệ. Chỉ chấp nhận: createdAt, score, updatedAt'
            )
        }
    }

    // Kiểm tra sortOrder
    if (sortOrder) {
        const validSortOrders = ['asc', 'desc']
        if (!validSortOrders.includes(sortOrder)) {
            errors.push('Thứ tự sắp xếp không hợp lệ. Chỉ chấp nhận: asc, desc')
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Tham số truy vấn không hợp lệ',
            errors: errors,
        })
    }

    next()
}

// Helper function để validate answer
function validateAnswer(answer, prefix = 'Câu trả lời') {
    const errors = []
    const { questionId, userAnswer, audioUrl, analysis } = answer

    // Kiểm tra questionId (bắt buộc)
    if (
        !questionId ||
        typeof questionId !== 'string' ||
        questionId.trim().length === 0
    ) {
        errors.push(`${prefix}: ID câu hỏi không được để trống`)
    }

    // Kiểm tra userAnswer (tùy chọn)
    if (userAnswer !== undefined) {
        if (typeof userAnswer !== 'string') {
            errors.push(`${prefix}: Câu trả lời phải là chuỗi`)
        } else if (userAnswer.length > 5000) {
            errors.push(`${prefix}: Câu trả lời không được quá 5000 ký tự`)
        }
    }

    // Kiểm tra audioUrl (tùy chọn)
    if (audioUrl !== undefined) {
        if (typeof audioUrl !== 'string') {
            errors.push(`${prefix}: URL audio phải là chuỗi`)
        } else if (audioUrl && !validator.isURL(audioUrl)) {
            errors.push(`${prefix}: URL audio không hợp lệ`)
        }
    }

    // Kiểm tra analysis (tùy chọn)
    if (analysis !== undefined) {
        const analysisErrors = validateAnalysis(analysis, prefix)
        errors.push(...analysisErrors)
    }

    return errors
}

// Helper function để validate analysis
function validateAnalysis(analysis, prefix = 'Phân tích') {
    const errors = []
    const {
        fluencyScore,
        pronunciationScore,
        vocabularyScore,
        grammarScore,
        feedback,
    } = analysis

    // Kiểm tra các điểm số (tùy chọn)
    const scores = {
        fluencyScore: 'Điểm độ trôi chảy',
        pronunciationScore: 'Điểm phát âm',
        vocabularyScore: 'Điểm từ vựng',
        grammarScore: 'Điểm ngữ pháp',
    }

    Object.entries(scores).forEach(([key, label]) => {
        const score = analysis[key]
        if (score !== undefined) {
            if (typeof score !== 'number') {
                errors.push(`${prefix}: ${label} phải là số`)
            } else if (score < 0 || score > 100) {
                errors.push(`${prefix}: ${label} phải từ 0 đến 100`)
            }
        }
    })

    // Kiểm tra feedback (tùy chọn)
    if (feedback !== undefined) {
        if (typeof feedback !== 'string') {
            errors.push(`${prefix}: Phản hồi phải là chuỗi`)
        } else if (feedback.length > 2000) {
            errors.push(`${prefix}: Phản hồi không được quá 2000 ký tự`)
        }
    }

    return errors
}

module.exports = {
    validateCreateExamHistory,
    validateUpdateExamHistory,
    validateAddAnswer,
    validateUpdateAnswer,
    validateExamHistoryId,
    validateUserId,
    validateAnswerId,
    validateQueryParams,
}
