const AuthService = require('../services/auth.service')
const SuccessResponse = require('../core/success')
const ErrorResponse = require('../core/error')
const catchAsync = require('../middlewares/catchAsync')

class AuthController {
    // [POST] /api/auth/register
    registerUser = catchAsync(async (req, res, next) => {
        const { displayName, email, password } = req.body

        const result = await AuthService.registerUser({
            displayName,
            email,
            password,
        })

        return SuccessResponse.created(res, result.message, {
            user: result.user,
        })
    })

    // [POST] /api/auth/login
    loginUser = catchAsync(async (req, res, next) => {
        const { email, password } = req.body

        const result = await AuthService.loginUser({
            email,
            password,
        })

        return SuccessResponse.ok(res, result.message, {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        })
    })

    // [POST] /api/auth/forget-password
    forgetPassword = catchAsync(async (req, res, next) => {
        const { email } = req.body

        const result = await AuthService.forgetPassword({ email })

        return SuccessResponse.ok(res, result.message)
    })

    // [POST] /api/auth/change-password
    changePassword = catchAsync(async (req, res, next) => {
        const { old_password, new_password } = req.body

        const result = await AuthService.changePassword({
            userId: req.user.id,
            oldPassword: old_password,
            newPassword: new_password,
        })

        return SuccessResponse.ok(res, result.message)
    })

    // [POST] /api/auth/logout
    logoutUser = catchAsync(async (req, res, next) => {
        const { refreshToken } = req.body

        const result = await AuthService.logoutUser({ refreshToken })

        return SuccessResponse.ok(res, result.message)
    })

    // [POST] /api/auth/refresh-token
    refreshToken = catchAsync(async (req, res, next) => {
        const { refreshToken } = req.body

        const result = await AuthService.refreshAccessToken({ refreshToken })

        return SuccessResponse.ok(res, result.message, {
            accessToken: result.accessToken,
        })
    })
}

module.exports = new AuthController()
