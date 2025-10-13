const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema(
    {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        desc: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

module.exports = {
    CategoryModel: mongoose.model('CategoryModel', categorySchema),
}
