const mongoose = require('mongoose')
const validator = require('validator')

const rejectPoolSchema = mongoose.Schema({
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
            required: true,
            trim: true
        },
        certificateID: {
            type: String,
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
}, {
    timestamps: true
})

const RejectPool = mongoose.model('RejectPool', rejectPoolSchema)

module.exports = RejectPool