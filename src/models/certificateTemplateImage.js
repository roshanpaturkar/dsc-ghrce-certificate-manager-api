const mongoose = require('mongoose')

const certificateTemplateImageSchema = mongoose.Schema({
    certificateTemplateImage: {
        type: Buffer
    }
}, {
    timestamps: true
})

const CertificateTemplateImage = mongoose.model('CertificateTemplateImage', certificateTemplateImageSchema)
module.exports = CertificateTemplateImage