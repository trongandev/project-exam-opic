const express = require('express')
const router = express.Router()

// ping check server is running
router.use('/ping', (req, res) => {
    console.log('Pong')
    res.status(200).json({ message: 'Pong' })
})

// Authentication routes
router.use('/auth', require('./auth.router'))

// Topic routes
router.use('/topics', require('./topic.router'))

// Exam History routes
router.use('/exam-histories', require('./examHistory.router'))

module.exports = router
