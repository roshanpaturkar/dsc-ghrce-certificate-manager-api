const mongoose = require('mongoose')
const validator = require('validator')

const certificatesSchema = mongoose.Schema({
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

const Certificates = mongoose.model('Certificates', certificatesSchema)
module.exports = Certificates