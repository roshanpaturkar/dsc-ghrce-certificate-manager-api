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

certificateTemplateSchema.statics.getEventResponse = (event) => {
    return {
        eventID: event.eventID,
        eventName: event.eventName,
        description: event.description,
        speakerName: event.speakerName,
        eventDate: event.eventDate,
        certificateContent: event.certificateContent,
        certificateTypeCode: event.certificateTypeCode,
        certificateType: event.certificateType,
        certificateIssueDate: event.certificateIssueDate
    }
}

certificateTemplateSchema.statics.getCertificateResponse = (certificate) => {
    return {
        certificateID: certificate.certificateID,
        eventID: certificate.eventID,
        name: certificate.name,
        email: certificate.email
    }
}

certificateTemplateSchema.statics.getLeadResponse = (lead) => {
    return {
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        leadTenure: lead.leadTenure,
    }
}

certificateTemplateSchema.statics.getCertificateTemplateResponse = (certificateTemplate, certificateTemplateImage) => {
    return {
        coordinates: certificateTemplate.coordinates,
        certificateTemplateImage: certificateTemplateImage.certificateTemplateImage,
    }
}

const CertificateTemplate = mongoose.model('certificateTemplate', certificateTemplateSchema)
module.exports = CertificateTemplate