const validateQuestion = (item, prefix = 'Dữ liệu') => {
    const errors = []
    if (!item || typeof item !== 'object') {
        errors.push(`${prefix} phải là một đối tượng`)
        return errors
    }
    if (!item.text) {
        errors.push(`${prefix} tiêu đề không được để trống`)
    } else if (item.text.length > 1000) {
        errors.push(`${prefix} tiêu đề không được vượt quá 1000 ký tự`)
    }

    if (!item.answer) {
        errors.push(`${prefix} trả lời không được để trống`)
    } else if (item.answer.length > 1000) {
        errors.push(`${prefix} trả lời không được vượt quá 1000 ký tự`)
    }

    return errors
}

// Validation cho tạo topic
const validateCreateTopic = (req, res, next) => {
    const { name, data } = req.body
    const errors = []

    // Kiểm tra name
    if (!name || name.trim().length === 0) {
        errors.push('Tên chủ đề không được để trống')
    } else if (name.trim().length < 3) {
        errors.push('Tên chủ đề phải có ít nhất 3 ký tự')
    } else if (name.trim().length > 100) {
        errors.push('Tên chủ đề không được quá 100 ký tự')
    }

    // Kiểm tra data (tùy chọn)
    if (data !== undefined && Array.isArray(data)) {
        data.forEach((item, index) => {
            item.quests.forEach((quest, questIdx) => {
                const itemErrors = validateQuestion(quest, `Câu hỏi ${questIdx + 1}`)
                errors.push(...itemErrors)
            })
        })
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

// Validation cho cập nhật topic
const validateUpdateTopic = (req, res, next) => {
    const { name, data } = req.body
    const errors = []

    // Kiểm tra name (tùy chọn)
    if (name !== undefined) {
        if (!name || name.trim().length === 0) {
            errors.push('Tên chủ đề không được để trống')
        } else if (name.trim().length < 3) {
            errors.push('Tên chủ đề phải có ít nhất 3 ký tự')
        } else if (name.trim().length > 100) {
            errors.push('Tên chủ đề không được quá 100 ký tự')
        }
    }

    // Kiểm tra data (tùy chọn)
    if (data !== undefined && Array.isArray(data)) {
        data.forEach((item, index) => {
            item.quests.forEach((quest, questIdx) => {
                const itemErrors = validateQuestion(quest, `Câu hỏi ${questIdx + 1}`)
                errors.push(...itemErrors)
            })
        })
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

const validateRating = (req, res, next) => {
    const { score, comment } = req.body
    const errors = []

    // Kiểm tra score
    if (score === undefined) {
        errors.push('Điểm không được để trống')
    } else if (typeof score !== 'number' || score < 1 || score > 5) {
        errors.push('Điểm phải là một số từ 1 đến 5')
    }

    // Kiểm tra comment
    if (comment === undefined) {
        errors.push('Nội dung đánh giá không được để trống')
    } else if (typeof comment !== 'string' || comment.trim().length === 0) {
        errors.push('Nội dung đánh giá phải là một chuỗi không rỗng')
    } else if (comment.length > 500) {
        errors.push('Nội dung đánh giá không được quá 500 ký tự')
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

// Validation cho thêm câu hỏi vào topic
const validateAddQuestion = (req, res, next) => {
    const { questionText, type, hints, sampleAnswer, keywords } = req.body
    const errors = validateQuestion({
        questionText,
        type,
        hints,
        sampleAnswer,
        keywords,
    })

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu câu hỏi không hợp lệ',
            errors: errors,
        })
    }

    next()
}

// Validation cho cập nhật câu hỏi
const validateUpdateQuestion = (req, res, next) => {
    const { questionText, type, hints, sampleAnswer, keywords } = req.body
    const errors = []

    // Kiểm tra questionText (tùy chọn khi update)
    if (questionText !== undefined) {
        if (!questionText || questionText.trim().length === 0) {
            errors.push('Nội dung câu hỏi không được để trống')
        } else if (questionText.trim().length < 10) {
            errors.push('Nội dung câu hỏi phải có ít nhất 10 ký tự')
        } else if (questionText.trim().length > 1000) {
            errors.push('Nội dung câu hỏi không được quá 1000 ký tự')
        }
    }

    // Kiểm tra type (tùy chọn)
    if (type !== undefined) {
        const validTypes = ['general', 'specific', 'role-play']
        if (!validTypes.includes(type)) {
            errors.push('Loại câu hỏi không hợp lệ. Chỉ chấp nhận: general, specific, role-play')
        }
    }

    // Kiểm tra hints (tùy chọn)
    if (hints !== undefined) {
        if (!Array.isArray(hints)) {
            errors.push('Gợi ý phải là một mảng')
        } else {
            hints.forEach((hint, index) => {
                if (typeof hint !== 'string' || hint.trim().length === 0) {
                    errors.push(`Gợi ý ${index + 1} phải là chuỗi không rỗng`)
                } else if (hint.length > 200) {
                    errors.push(`Gợi ý ${index + 1} không được quá 200 ký tự`)
                }
            })
        }
    }

    // Kiểm tra sampleAnswer (tùy chọn)
    if (sampleAnswer !== undefined && sampleAnswer.length > 2000) {
        errors.push('Câu trả lời mẫu không được quá 2000 ký tự')
    }

    // Kiểm tra keywords (tùy chọn)
    if (keywords !== undefined) {
        if (!Array.isArray(keywords)) {
            errors.push('Từ khóa phải là một mảng')
        } else {
            keywords.forEach((keyword, index) => {
                if (typeof keyword !== 'string' || keyword.trim().length === 0) {
                    errors.push(`Từ khóa ${index + 1} phải là chuỗi không rỗng`)
                } else if (keyword.length > 50) {
                    errors.push(`Từ khóa ${index + 1} không được quá 50 ký tự`)
                }
            })
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu câu hỏi không hợp lệ',
            errors: errors,
        })
    }

    next()
}

module.exports = {
    validateCreateTopic,
    validateUpdateTopic,
    validateAddQuestion,
    validateUpdateQuestion,
    validateRating,
}
