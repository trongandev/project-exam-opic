const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema({
    questionText: { type: String, required: true },
    type: { type: String, default: 'general' }, // general, specific, role-play
    hints: [String],
    sampleAnswer: String,
    keywords: [String],
})

const topicSchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    isActive: { type: Boolean, default: true },
    questions: [questionSchema],
})

module.exports = {
    TopicModel: mongoose.model('TopicModel', topicSchema),
    QuestionModel: mongoose.model('QuestionModel', questionSchema),
}
