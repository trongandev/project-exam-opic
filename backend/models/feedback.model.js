const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedbackSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
            required: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        helpfulCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

module.exports = {
    FeedbackModel: mongoose.model('FeedbackModel', feedbackSchema),
}
