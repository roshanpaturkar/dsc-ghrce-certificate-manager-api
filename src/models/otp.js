const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const User = require('./user')

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email!')
            }
        }
    },
    otp: {
        type: Number,
        required: true,
        trim: true,
    },
    generateDateTime: {
        type: Date,
        required: true,
    },
    expiryDateTime: {
        type: Date,
        required: true,
    },
    token: {
        type: String
    }
}, {
    timestamps: true
})

otpSchema.methods.verifyOtp = async (email) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error()
    }
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    return token
}

const Otp = mongoose.model('Otp', otpSchema)

module.exports = Otp