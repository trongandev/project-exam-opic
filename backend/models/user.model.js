const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            min: 6,
            max: 150,
        },
    },
    { timestamps: true }
)

module.exports = { UserModel: mongoose.model('UserModel', UserSchema) }
