const express = require('express')
const {
    registerUser,
    loginUser,
    forgetPassword,
    changePassword,
    logoutUser,
    refreshToken,
} = require('../controllers/auth.controller.js')
const {
    checkRoleAdmin,
    authenticateToken,
} = require('../middlewares/auth.middleware.js')
const {
    validateRegister,
    validateLogin,
    validateForgetPassword,
    validateOTP,
    validateChangePassword,
    validateRefreshToken,
} = require('../middlewares/auth.validation.js')

const router = express.Router()

// Public routes with validation
router.post('/register', validateRegister, registerUser)
router.post('/login', validateLogin, loginUser)
router.post('/forget-password', validateForgetPassword, forgetPassword)
router.post('/refresh-token', validateRefreshToken, refreshToken)

// Protected routes (require authentication)
router.post(
    '/change-password',
    authenticateToken,
    validateChangePassword,
    changePassword
)
router.post('/logout', authenticateToken, validateRefreshToken, logoutUser)

module.exports = router
