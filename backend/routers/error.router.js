const express = require('express')
const ErrorResponse = require('../core/error')
const router = express.Router()
router.use((req, res, next) => {
    next(
        new ErrorResponse(
            404,
            `Cannot ${req.method} ${req.originalUrl} - Route not found`
        )
    )
})

module.exports = router
