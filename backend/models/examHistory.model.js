const mongoose = require('mongoose')
const Schema = mongoose.Schema

const answerSchema = new Schema({
    questionId: { type: String, required: true },
    userAnswer: String,
    audioUrl: String,
    analysis: {
        fluencyScore: Number,
        pronunciationScore: Number,
        vocabularyScore: Number,
        grammarScore: Number,
        feedback: String,
    },
})

const examHistorySchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
        score: { type: Number, required: true },
        feedback: String,
        answers: [answerSchema],
    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
    }
)

module.exports = {
    HistoryModel: mongoose.model('HistoryModel', examHistorySchema),
    AnswerModel: mongoose.model('AnswerModel', answerSchema),
}
