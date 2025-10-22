const express = require('express')
const router = express.Router()
const { generateSlug } = require('../utils/generateSlug')
// ping check server is running
router.use('/ping', (req, res) => {
    res.status(200).json({ message: generateSlug('trời đất quỷ thần ơi, Ldfsdkjffg') })
})

// Authentication routes
router.use('/auth', require('./auth.router'))

router.use('/profile', require('./profile.router'))
// Topic routes
router.use('/topics', require('./topic.router'))

router.use('/categories', require('./category.router'))
router.use('/feedback', require('./feedback.router'))
module.exports = router
