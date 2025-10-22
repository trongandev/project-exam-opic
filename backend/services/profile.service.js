const { UserModel } = require('../models/user.model')

class ProfileService {
    async getProfileById(id) {
        const profile = await UserModel.findById(id).select('-password').lean()

        if (!profile) {
            throw new ErrorResponse('Không tìm thấy người dùng', 404)
        }

        return profile
    }

    async updateProfile(req) {
        const userId = req.user.id
        const { displayName } = req.body
        const profile = await UserModel.findById(userId)
        if (!profile) {
            throw new ErrorResponse('Không tìm thấy người dùng', 404)
        }
        // Cập nhật các trường
        if (displayName !== undefined) profile.displayName = displayName
        await profile.save()
        delete profile.password
        return profile
    }
}

module.exports = new ProfileService()
