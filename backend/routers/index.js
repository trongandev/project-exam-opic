const express = require('express')
const router = express.Router()
const { generateSlug } = require('../utils/generateSlug')
// ping check server is running
router.use('/ping', (req, res) => {
    console.log('test slug')
    res.status(200).json({ message: generateSlug('trời đất quỷ thần ơi, Ldfsdkjffg') })
})

// Authentication routes
router.use('/auth', require('./auth.router'))

router.use('/profile', require('./profile.router'))
// Topic routes
router.use('/topics', require('./topic.router'))

router.use('/categories', require('./category.router'))

// Exam History routes
// router.use('/exam-histories', require('./examHistory.router'))

module.exports = router
