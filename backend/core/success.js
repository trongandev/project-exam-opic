class SuccessResponse {
    constructor(statusCode, message, data = null) {
        this.ok = true
        this.status = "success"
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.timestamp = new Date().toISOString()
    }

    // Helper method để format response
    toJSON() {
        return {
            ok: this.ok,
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp,
        }
    }

    static ok(res, message = "Request successful", data = null) {
        const success = new SuccessResponse(200, message, data)
        return res.status(200).json(success.toJSON())
    }

    static created(res, message = "Resource created successfully", data = null) {
        const success = new SuccessResponse(201, message, data)
        return res.status(201).json(success.toJSON())
    }

    static updated(res, message = "Resource updated successfully", data = null) {
        const success = new SuccessResponse(200, message, data)
        return res.status(200).json(success.toJSON())
    }

    static deleted(res, message = "Resource deleted successfully", data = null) {
        const success = new SuccessResponse(200, message, data)
        return res.status(200).json(success.toJSON())
    }

    static custom(res, statusCode, message, data = null) {
        const success = new SuccessResponse(statusCode, message, data)
        return res.status(statusCode).json(success.toJSON())
    }

    // Method để gửi response
    send(res) {
        return res.status(this.statusCode).json(this.toJSON())
    }

    // Method để thêm metadata vào response
    withMeta(metadata) {
        this.metadata = metadata
        return this
    }

    // Method để thêm pagination vào response
    withPagination(pagination) {
        this.pagination = pagination
        return this
    }
}

module.exports = SuccessResponse
