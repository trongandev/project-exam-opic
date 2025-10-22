const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema(
    {
        _id: { type: String, required: true },
        text: { type: String, required: true, trim: true, max: 1000 },
        note: { type: String, trim: true, max: 1000 },
        answer: { type: String, required: true, trim: true, max: 1000 },
    },
    { _id: false }
)

const ratingSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
        score: { type: Number, required: true },
        comment: { type: String, required: true, trim: true, max: 1000 },
    },
    { timestamps: true }
)

const dataSchema = new Schema({
    dateId: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'CategoryModel', required: true },
    quests: [questionSchema],
})

const topicSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
        name: { type: String, required: true, trim: true, max: 100 },
        slug: { type: String, required: true, lowercase: true },
        desc: { type: String, trim: true, max: 300 },
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
