const ErrorResponse = require('../core/error')

// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
    let { statusCode, message, errors, stack } = err
    if (!statusCode) statusCode = 500 // Mặc định là 500 (Internal Server Error)

    // 🖥️ Hiển thị lỗi trên terminal
    console.error('🔥🔥 ERROR LOG 🔥🔥')
    console.error(`🔢 Status: ${statusCode}`)
    console.error(`🎭 Message: ${message}`)
    if (errors) console.error(`📌 Details: ${JSON.stringify(errors, null, 2)}`)
    console.error(`🎁 Stack Trace:\n${stack}`)

    ErrorResponse.custom(res, statusCode, message, errors)
}

module.exports = errorHandler
