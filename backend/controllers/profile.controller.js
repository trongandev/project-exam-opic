const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')
const profileService = require('../services/profile.service')

class ProfileController {
    getProfile = catchAsync(async (req, res, next) => {
        const userId = req.user.id
        const result = await profileService.getProfileById(userId)

        return SuccessResponse.ok(res, 'Lấy thông tin người dùng thành công', result)
    })

    getProfileById = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const result = await profileService.getProfileById(id)

        return SuccessResponse.ok(res, 'Lấy thông tin người dùng thành công', result)
    })

    updateProfile = catchAsync(async (req, res, next) => {
        const result = await profileService.updateProfile(req)

        return SuccessResponse.ok(res, 'Cập nhật thông tin người dùng thành công', result)
    })
}

module.exports = new ProfileController()
