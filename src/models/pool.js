const mongoose = require('mongoose')
const validator = require('validator')
const cryptoRandomString = require('crypto-random-string')

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
            unique: true,
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

poolSchema.statics.getPoolData = (rawData, userData) => {
    const eventData = {
        eventName: rawData[0].eventName,
        description: rawData[0].description,
        speakerName: rawData[0].speakerName,
        eventDate: rawData[0].eventDate,
        certificateContent: rawData[0].certificateContent,
        publishedBy: userData
    }
    const certificates = []
    rawData.forEach((value) => {
        certificates.push({
            certificateID: value.certificateId === ""? cryptoRandomString({length: 15}): value.certificateId,
            name: `${value.firstName} ${value.lastName}`,
            email: value.email
        })
    })

    eventData.publishedBy = userData
    eventData.certificates = certificates

    return eventData
}

const Pool = mongoose.model('Pool', poolSchema)

module.exports = Pool