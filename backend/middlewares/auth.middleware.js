const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp hoặc không đúng định dạng',
            })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp',
            })
        }

        // Xác thực token với ACCESS_TOKEN_SECRET
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Tìm user và kiểm tra trạng thái
        const user = await UserModel.findById(decoded.userId || decoded.id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại',
            })
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản đã bị khóa',
            })
        }

        // Gán thông tin user vào req
        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            displayName: user.displayName,
        }

        next()
    } catch (error) {
        console.error('Auth middleware error:', error)

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn, vui lòng đăng nhập lại',
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ',
            })
        } else {
            return res.status(500).json({
                success: false,
                message: 'Lỗi xác thực',
            })
        }
    }
}

const checkRoleAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập (yêu cầu quyền admin)',
        })
    }
}

// Kiểm tra role admin hoặc collab
const checkRoleAdminOrCollab = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'collab') {
        next()
    } else {
        res.status(403).json({
            success: false,
            message:
                'Bạn không có quyền truy cập (yêu cầu quyền admin hoặc cộng tác viên)',
        })
    }
}

// Kiểm tra có phải user sở hữu resource không (hoặc admin)
const checkOwnerOrAdmin = (req, res, next) => {
    const resourceUserId = req.params.userId || req.body.userId || req.user.id

    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: 'Bạn chỉ có thể truy cập dữ liệu của chính mình',
        })
    }
}

// Middleware kiểm tra role tùy chỉnh
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) {
            next()
        } else {
            res.status(403).json({
                success: false,
                message: `Bạn không có quyền truy cập (yêu cầu quyền: ${allowedRoles.join(
                    ', '
                )})`,
            })
        }
    }
}

module.exports = {
    authenticateToken,
    checkRoleAdmin,
    checkRoleAdminOrCollab,
    checkOwnerOrAdmin,
    checkRole,
}
