const mongoose = require('mongoose')

const certificateTemplateSchema = mongoose.Schema({
    coordinates: {
        userName: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        },
        content: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        },
        leadName: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        },
        certificateId: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        },
        issuedDate: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        },
        verificationUrl: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        }
    },
    certificateTemplateImageId: {
        type: String,
        required: true,
        trim: true
    },
    linkedEvent: [{
        type: String,
        required: true,
        trim: true
    }]
}, {
    timestamps: true
})

const CertificateTemplate = mongoose.model('certificateTemplate', certificateTemplateSchema)
module.exports = CertificateTemplate