const validator = require('validator')
const mongoose = require('mongoose')

// Validation cho tạo topic
const validateCreateTopic = (req, res, next) => {
    const { name, desc, data } = req.body
    const errors = []

    // Kiểm tra name
    if (!name || name.trim().length === 0) {
        errors.push('Tên chủ đề không được để trống')
    } else if (name.trim().length < 3) {
        errors.push('Tên chủ đề phải có ít nhất 3 ký tự')
    } else if (name.trim().length > 100) {
        errors.push('Tên chủ đề không được quá 100 ký tự')
    }

    if (!desc || desc.trim().length === 0) {
        errors.push('Mô tả không được để trống')
    }
    if (desc && desc.length > 500) {
        errors.push('Mô tả không được quá 500 ký tự')
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
    const { name, slug, desc, isActive, data } = req.body
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

    // Kiểm tra slug (tùy chọn)
    if (slug !== undefined) {
        if (!slug || slug.trim().length === 0) {
            errors.push('Slug không được để trống')
        } else if (slug.trim().length < 3) {
            errors.push('Slug phải có ít nhất 3 ký tự')
        } else if (slug.trim().length > 100) {
            errors.push('Slug không được quá 100 ký tự')
        } else if (!/^[a-z0-9-]+$/.test(slug.trim())) {
            errors.push('Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
        }
    }

    // Kiểm tra desc (tùy chọn)
    if (desc !== undefined && desc.length > 500) {
        errors.push('Mô tả không được quá 500 ký tự')
    }

    // Kiểm tra isActive (tùy chọn)
    if (isActive !== undefined && typeof isActive !== 'boolean') {
        errors.push('Trạng thái hoạt động phải là boolean')
    }

    // // Kiểm tra data (tùy chọn)
    // if (data !== undefined && Array.isArray(data)) {
    //     data.forEach((item, index) => {
    //         const itemErrors = validateDataItem(item, `Dữ liệu ${index + 1}`)
    //         errors.push(...itemErrors)
    //     })
    // }

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

// Validation cho ID params
const validateTopicId = (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID chủ đề không hợp lệ',
        })
    }

    next()
}

// Validation cho question ID params
const validateQuestionId = (req, res, next) => {
    const { topicId, questionId } = req.params

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
        return res.status(400).json({
            success: false,
            message: 'ID chủ đề không hợp lệ',
        })
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({
            success: false,
            message: 'ID câu hỏi không hợp lệ',
        })
    }

    next()
}

module.exports = {
    validateCreateTopic,
    validateUpdateTopic,
    validateAddQuestion,
    validateUpdateQuestion,
    validateTopicId,
    validateQuestionId,
}
