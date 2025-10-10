const { UserModel } = require('../models/user.model')

class ProfileService {
    async getProfileById(id) {
        const profile = await UserModel.findById(id).select('-password').lean()

        if (!profile) {
            throw new ErrorResponse('Không tìm thấy người dùng', 404)
        }

        return profile
    }

    async updateProfile(id, dataProfile) {
        const { displayName } = dataProfile
        const profile = await UserModel.findById(id)
        if (!profile) {
            throw new ErrorResponse('Không tìm thấy người dùng', 404)
        }
        // Cập nhật các trường
        if (displayName !== undefined) profile.displayName = displayName
        await profile.save()

        return profile
    }
}

module.exports = new ProfileService()
