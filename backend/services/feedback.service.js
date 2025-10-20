const { FeedbackModel } = require('../models/feedback.model')

class FeedbackService {
    async getAllFeedbacks() {
        const feedbacks = await FeedbackModel.find().populate('userId', '_id displayName email').sort({ createdAt: -1 }).lean()
        return feedbacks
    }

    async getFeedbackById(id) {
        const feedback = await FeedbackModel.findById(id).lean()

        return feedback
    }

    async createFeedback(req) {
        const { id } = req.user
        const { comment, rating } = req.body

        const newFeedback = new FeedbackModel({ userId: id, comment, rating })
        await newFeedback.save()

        return newFeedback
    }

    async updateFeedback(req) {
        const { feedbackId } = req.params
        const { comment, rating } = req.body

        const feedback = await FeedbackModel.findById(feedbackId)

        if (!feedback) {
            return false
        }
        // Cập nhật các trường
        if (comment !== undefined) feedback.comment = comment
        if (rating !== undefined) feedback.rating = rating
        await feedback.save()

        return feedback
    }

    async deleteFeedback(id) {
        const feedback = await FeedbackModel.findById(id)

        if (!feedback) {
            return false
        }

        await FeedbackModel.deleteOne({ _id: id })
        return true
    }
}

module.exports = new FeedbackService()
