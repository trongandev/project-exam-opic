const ErrorResponse = require('../core/error')
const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')
const FeedbackService = require('../services/feedback.service')

class FeedbackController {
    getAllFeedbacks = catchAsync(async (req, res, next) => {
        const result = await FeedbackService.getAllFeedbacks()

        return SuccessResponse.ok(res, 'Lấy thông tin phản hồi thành công', result)
    })

    getFeedbackById = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const result = await FeedbackService.getFeedbackById(id)
        if (!result) {
            return ErrorResponse.notFound(res, 'Không tìm thấy phản hồi')
        }

        return SuccessResponse.ok(res, 'Lấy thông tin phản hồi thành công', result)
    })

    createFeedback = catchAsync(async (req, res, next) => {
        const result = await FeedbackService.createFeedback(req)

        return SuccessResponse.ok(res, 'Tạo phản hồi thành công', result)
    })

    updateFeedback = catchAsync(async (req, res, next) => {
        const result = await FeedbackService.updateFeedback(req)
        if (!result) {
            return ErrorResponse.notFound(res, 'Không tìm thấy danh mục')
        }

        return SuccessResponse.ok(res, 'Cập nhật thông tin danh mục thành công', result)
    })

    deleteFeedback = catchAsync(async (req, res, next) => {
        const { id } = req.params
        await FeedbackService.deleteFeedback(id)
        return SuccessResponse.ok(res, 'Xóa phản hồi thành công')
    })
}

module.exports = new FeedbackController()
