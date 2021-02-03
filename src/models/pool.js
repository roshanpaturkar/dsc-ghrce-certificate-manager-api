const mongoose = require('mongoose')
const validator = require('validator')
const cryptoRandomString = require('crypto-random-string')

const poolSchema = mongoose.Schema({
    eventID: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    eventName: {
        type: String,
        unique: true,
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
        trim: true,
        validate (value) {
            if (!value.match(/^(\d{2})-(\d{2})-(\d{4})$/)) {
                throw new Error('Invalid Date!')
            }
        }
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
        eventID: {
            type: String,
            unique: true,
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
    }],
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    rejected: {
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
    },
    rollbackBy: {
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
    },
    rejectedBy: {
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
    },
    rejectRollbackBy: {
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

poolSchema.statics.getPoolData = (rawData, userData) => {
    const eventId = rawData[0].eventId === ""? cryptoRandomString({length: 30}) : rawData[0].eventId
    const eventData = {
        eventID: eventId,
        eventName: rawData[0].eventName,
        description: rawData[0].description,
        speakerName: rawData[0].speakerName === ""? 'NA': rawData[0].speakerName,
        eventDate: rawData[0].eventDate,
        certificateContent: rawData[0].certificateContent,
        publishedBy: userData
    }
    const certificates = []
    rawData.forEach((value) => {
        certificates.push({
            eventID: eventId,
            certificateID: value.certificateId === ""? cryptoRandomString({length: 20}): value.certificateId,
            name: `${value.firstName} ${value.lastName}`,
            email: value.email
        })
    })

    eventData.certificates = certificates

    return eventData
}

const Pool = mongoose.model('Pool', poolSchema)

module.exports = Pool