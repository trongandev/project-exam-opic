class ErrorResponse extends Error {
    constructor(statusCode, message, errors = null) {
        super(message)
        this.ok = false
        this.status = "error"
        this.statusCode = statusCode

        // Cải thiện xử lý errors
        if (errors) {
            // Nếu errors là string
            if (typeof errors === "string") {
                this.errors = errors
            }
            // Nếu errors là Error object
            else if (errors instanceof Error) {
                this.errors = errors.message
                this.stack = errors.stack
            }
            // Nếu errors là array
            else if (Array.isArray(errors)) {
                this.errors = errors
            }
            // Nếu errors là object
            else if (typeof errors === "object") {
                this.errors = errors.message || errors
            } else {
                this.errors = null
            }
        }

        this.timestamp = new Date().toISOString()
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }

    // Helper method để format response
    toJSON() {
        return {
            ok: this.ok,
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors,
            timestamp: this.timestamp,
            ...(process.env.NODE_ENV === "development" && {
                stack: this.stack,
            }),
        }
    }

    static badRequest(res, message = "Bad Request", errors = null) {
        const error = new ErrorResponse(400, message, errors)
        return res.status(400).json(error.toJSON())
    }

    static unauthorized(res, message = "Unauthorized", errors = null) {
        const error = new ErrorResponse(401, message, errors)
        return res.status(401).json(error.toJSON())
    }

    static forbidden(res, message = "Forbidden", errors = null) {
        const error = new ErrorResponse(403, message, errors)
        return res.status(403).json(error.toJSON())
    }

    static notFound(res, message = "Not Found", errors = null) {
        const error = new ErrorResponse(404, message, errors)
        return res.status(404).json(error.toJSON())
    }

    static conflict(res, message = "Conflict", errors = null) {
        const error = new ErrorResponse(409, message, errors)
        return res.status(409).json(error.toJSON())
    }

    static internal(res, message = "Internal Server Error", errors = null) {
        const error = new ErrorResponse(500, message, errors)
        return res.status(500).json(error.toJSON())
    }

    static custom(res, statusCode, message, errors = null) {
        const error = new ErrorResponse(statusCode, message, errors)
        return res.status(statusCode).json(error.toJSON())
    }

    // Method để gửi response
    send(res) {
        return res.status(this.statusCode).json(this.toJSON())
    }
}

module.exports = ErrorResponse
