const mongoose = require('mongoose')
const validator = require('validator')

const eventSchema = mongoose.Schema({
    eventID: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
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
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    verifiedBy: {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
        },
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate (value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email!')
                }
            }
        }
    }
})

eventSchema.methods.toJSON = function() {
    const event = this
    const eventObject = event.toObject()

    delete eventObject.publishedBy
    delete eventObject.verifiedBy

    return eventObject
}

const Event = mongoose.model('Event', eventSchema)
module.exports = Event