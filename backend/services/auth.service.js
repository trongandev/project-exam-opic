const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const { sendNewPasswordMail } = require('../utils/nodemailer')

class AuthService {
    // Đăng ký người dùng mới
    async registerUser({ displayName, email, password }) {
        // Validate input
        if (!displayName || !email || !password) {
            throw new Error('Vui lòng nhập đầy đủ thông tin')
        }

        if (!validator.isEmail(email)) {
            throw new Error('Email không hợp lệ')
        }

        if (password.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            throw new Error('Email đã được sử dụng')
        }

        // Hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Tạo user mới
        const newUser = new UserModel({
            displayName,
            email,
            password: hashedPassword,
        })

        const savedUser = await newUser.save()
        // Tạo tokens
        const accessToken = generateAccessToken(savedUser._id, savedUser.role)
        const refreshToken = generateRefreshToken(savedUser._id)
        // Loại bỏ password khỏi response
        const userResponse = savedUser.toObject()
        delete userResponse.password

        return {
            user: userResponse,
            message: 'Đăng ký thành công',
            accessToken,
            refreshToken,
        }
    }

    // Đăng nhập người dùng
    async loginUser({ email, password }) {
        // Tìm user theo email
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng')
        }

        // So sánh password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error('Email hoặc mật khẩu không đúng')
        }

        // Tạo tokens
        const accessToken = generateAccessToken(user._id, user.role)
        const refreshToken = generateRefreshToken(user._id)

        // Loại bỏ password khỏi response
        const userResponse = user.toObject()
        delete userResponse.password

        return {
            user: userResponse,
            accessToken,
            refreshToken,
            message: 'Đăng nhập thành công',
        }
    }

    // Quên mật khẩu
    async forgetPassword({ email }) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw new Error('Email không tồn tại trong hệ thống')
        }

        // tạo mật khẩu mới ngẫu nhiên
        const new_password = Math.random().toString(36).slice(-8)

        // Hash mật khẩu mới
        const saltRounds = 10
        const hashedNewPassword = await bcrypt.hash(new_password, saltRounds)

        // Cập nhật mật khẩu mới vào database
        await UserModel.findByIdAndUpdate(user._id, {
            password: hashedNewPassword,
        })

        // TODO: Gửi mật khẩu mới qua email
        // await sendNewPasswordMail(user, new_password)

        return {
            message: 'Mật khẩu mới đã được gửi đến email của bạn',
        }
    }

    // Đổi mật khẩu
    async changePassword({ userId, password }) {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new Error('Người dùng không tồn tại')
        }

        // Hash mật khẩu mới
        const saltRounds = 10
        const hashedNewPassword = await bcrypt.hash(password, saltRounds)

        // Cập nhật mật khẩu
        await UserModel.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
            isChangePassword: true,
        })

        return {
            message: 'Đổi mật khẩu thành công',
        }
    }

    // Làm mới access token
    async refreshAccessToken({ refreshToken }) {
        if (!refreshToken) {
            throw new Error('Refresh token không được cung cấp')
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const user = await UserModel.findById(decoded.userId)

            if (!user) {
                throw new Error('Người dùng không tồn tại')
            }

            // Tạo access token mới
            const newAccessToken = generateAccessToken(user._id, user.role)

            return {
                accessToken: newAccessToken,
                message: 'Làm mới token thành công',
            }
        } catch (error) {
            throw new Error('Refresh token không hợp lệ')
        }
    }

    // Đăng xuất
    async logoutUser({ refreshToken }) {
        // TODO: Thêm refresh token vào blacklist nếu cần
        return {
            message: 'Đăng xuất thành công',
        }
    }
}

module.exports = new AuthService()
