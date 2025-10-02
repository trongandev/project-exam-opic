const validator = require('validator')

// Validation cho đăng ký
const validateRegister = (req, res, next) => {
    const { displayName, email, password } = req.body
    const errors = []

    // Kiểm tra displayName
    if (!displayName || displayName.trim().length === 0) {
        errors.push('Tên hiển thị không được để trống')
    } else if (displayName.trim().length < 3) {
        errors.push('Tên hiển thị phải có ít nhất 3 ký tự')
    } else if (displayName.trim().length > 20) {
        errors.push('Tên hiển thị không được quá 20 ký tự')
    }

    // Kiểm tra email
    if (!email || email.trim().length === 0) {
        errors.push('Email không được để trống')
    } else if (!validator.isEmail(email)) {
        errors.push('Email không hợp lệ')
    }

    // Kiểm tra password
    if (!password || password.length === 0) {
        errors.push('Mật khẩu không được để trống')
    } else if (password.length < 6) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự')
    } else if (password.length > 150) {
        errors.push('Mật khẩu không được quá 150 ký tự')
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

// Validation cho đăng nhập
const validateLogin = (req, res, next) => {
    const { email, password } = req.body
    const errors = []

    // Kiểm tra email
    if (!email || email.trim().length === 0) {
        errors.push('Email không được để trống')
    } else if (!validator.isEmail(email)) {
        errors.push('Email không hợp lệ')
    }

    // Kiểm tra password
    if (!password || password.length === 0) {
        errors.push('Mật khẩu không được để trống')
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

// Validation cho quên mật khẩu
const validateForgetPassword = (req, res, next) => {
    const { email } = req.body
    const errors = []

    // Kiểm tra email
    if (!email || email.trim().length === 0) {
        errors.push('Email không được để trống')
    } else if (!validator.isEmail(email)) {
        errors.push('Email không hợp lệ')
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

// Validation cho OTP
const validateOTP = (req, res, next) => {
    const { email, otp } = req.body
    const errors = []

    // Kiểm tra email
    if (!email || email.trim().length === 0) {
        errors.push('Email không được để trống')
    } else if (!validator.isEmail(email)) {
        errors.push('Email không hợp lệ')
    }

    // Kiểm tra OTP
    if (!otp) {
        errors.push('OTP không được để trống')
    } else if (!/^\d{6}$/.test(otp)) {
        errors.push('OTP phải là 6 chữ số')
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

// Validation cho refresh token
const validateRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body
    const errors = []

    // Kiểm tra refresh token
    if (!refreshToken || refreshToken.trim().length === 0) {
        errors.push('Refresh token không được để trống')
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

module.exports = {
    validateRegister,
    validateLogin,
    validateForgetPassword,
    validateOTP,
    validateRefreshToken,
}
