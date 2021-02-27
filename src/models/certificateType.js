const mongoose = require("mongoose");

const certificateTypeSchema = mongoose.Schema({
    typeCode: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 3
    },
    certificateType: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

certificateTypeSchema.pre('save', async function (next) {
    const certificateType = this
    if (certificateType.isModified('typeCode')) {
        certificateType.typeCode = await certificateType.typeCode.toUpperCase()
    }
    next()
})

const CertificateType = mongoose.model('CertificateType', certificateTypeSchema)
module.exports = CertificateType