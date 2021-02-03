const mongoose = require('mongoose')
const validator = require('validator')

const certificateSchema = mongoose.Schema({
    eventID: {
        type: String,
        required: true,
        trim: true
    },
    certificateID: {
        type: String,
        unique: true,
        required: true,
        trim: true
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
})

const Certificate = mongoose.model('Certificates', certificateSchema)
module.exports = Certificate