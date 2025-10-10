// const nodemailer = require('nodemailer')
// const { google } = require('googleapis')
// const HTML_TEMPLATE = require('./html-template')
// const catchAsync = require('../middlewares/catchAsync')

// const OAuth2 = google.auth.OAuth2

// const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, GOOGLE_REFRESH_TOKEN, MAIL_SERVER } = process.env

// const OAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, REDIRECT_URI)

// OAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })

// const accessToken = OAuth2Client.getAccessToken()

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//         type: 'OAuth2',
//         user: MAIL_SERVER,
//         clientId: CLIENT_ID,
//         accessToken,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: GOOGLE_REFRESH_TOKEN,
//     },
// })

// const sendNewPasswordMail = catchAsync(async (user, new_password) => {
//     const options = {
//         to: user.email,
//         subject: 'Quên mật khẩu',
//         html: HTML_TEMPLATE(user.displayName || 'Người ẩn danh', new_password, 'Mật khẩu tạm thời', 'Vui lòng đăng nhập để thay đổi mật khẩu mới'),
//     }

//     await transporter.sendMail(options)
// })

// const sendOTPMail = catchAsync(async (user) => {
//     const options = {
//         to: user.email,
//         subject: 'Xác thực OTP',
//         html: HTML_TEMPLATE(user.displayName || 'Người ẩn danh', user.otp, 'Mã OTP', 'Mã OTP chỉ có hiệu lực trong 10 phút'),
//     }

//     await transporter.sendMail(options)
// })

// module.exports = { sendNewPasswordMail, sendOTPMail }
