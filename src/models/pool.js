const mongoose = require('mongoose')
const validator = require('validator')

const poolSchema = mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    speakerName: {
        type: String,
        required: true,
        trim: true
    },
    eventDate: {
        type: String,
        required: true,
        trim: true
    },
    certificateContent: {
        type: String,
        required: true,
        trim: true
    },
    publishedBy: {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
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
        }
    },
    certificates: [{
        certificateID: {
            type: String,
            unique: true,
            requires: true,
            trim: true,
        },
         name: {
            type: String,
            required: true,
            trim: true
        },
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
        }
    }]
})

const Pool = mongoose.model('User', poolSchema)

module.exports = Pool