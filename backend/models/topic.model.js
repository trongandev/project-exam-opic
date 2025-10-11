const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema(
    {
        _id: { type: String, required: true },
        text: { type: String, required: true },
        note: { type: String },
        answer: { type: String, required: true },
    },
    { _id: false }
)

const ratingSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
        score: { type: Number, required: true },
        comment: { type: String, required: true },
    },
    { timestamps: true }
)

const dataSchema = new Schema(
    {
        _id: { type: String, required: true },
        icon: String,
        title: String,
        desc: String,
        quests: [questionSchema],
    },
    { _id: false }
)

const topicSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true, lowercase: true },
        desc: { type: String, required: true },
        viewCount: { type: Number, default: 0 },
        rating: [ratingSchema],
        data: [dataSchema],
        isPopular: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

module.exports = {
    TopicModel: mongoose.model('TopicModel', topicSchema),
    DataModel: mongoose.model('DataModel', dataSchema),
    QuestionModel: mongoose.model('QuestionModel', questionSchema),
    RatingModel: mongoose.model('RatingModel', ratingSchema),
}
