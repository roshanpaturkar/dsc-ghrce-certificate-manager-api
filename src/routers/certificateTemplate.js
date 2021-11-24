const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const apiKey = require('../middleware/apiKey')

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const CertificateTemplate = require('../models/certificateTemplateSafe')
const CertificateTemplateImage = require('../models/certificateTemplateImage')
const Pool = require('../models/pool')
const Lead = require('../models/lead')

const router = new express.Router()

const upload = multer ({
        limits: {
            fileSize: 400000
        },
        fileFilter (request, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new Error ('Please upload an image'))
            }
            callback(undefined, true)
        }
    })

router.post('/certificate/uploadTemplateImage', apiKey, auth, admin, upload.single('certificateTemplateImage'), async (request, response) => {
    try {
        const buffer = await sharp(request.file.buffer).toBuffer()
        request.certificateTemplateImage = new CertificateTemplateImage({
            certificateTemplateImage: buffer
        })
    } catch (error) {
        console.log(error);
        return response.status(400).send({ error: 'Image data not found!'})
    }
    const data = await request.certificateTemplateImage.save()
    response.send({id: data.id, message: 'Certificate Template Image uploaded successfully!'})
}, (error, request, response, next) => {
    console.log(error);
    response.status(400).send({ error: error.message })
})

router.delete('/certificate/templateImage/:id', apiKey, auth, admin, async (request, response) => {
    try {
        const certificateTemplateImage = await CertificateTemplateImage.findById(request.params.id)
        if (!certificateTemplateImage) {
            return response.status(404).send({ error: 'Certificate Template Image not found!'})
        }
        const certificateTemplate = await CertificateTemplate.findOne({certificateTemplateImageId: request.params.id})
        if (certificateTemplate) {
            return response.status(400).send({ error: 'Certificate Template Image is in use!'})
        }
        await certificateTemplateImage.remove()
        response.send({message: 'Certificate Template Image deleted successfully!'})
    } catch (error) {
        console.log(error);
        response.status(400).send({ error: error.message })
    }
})

router.get('/certificate/templateImage/:id', async (request, response) => {
    try {
        const certificateTemplateImage = await CertificateTemplateImage.findById(request.params.id)

        if (!certificateTemplateImage.certificateTemplateImage) {
            throw new Error()
        }
        response.set('Content-Type', 'image/png')
        response.send(certificateTemplateImage.certificateTemplateImage)
    } catch (error) {
        console.log(error);
        response.status(404).send()
    }
})

router.post('/certificate/template', apiKey, auth, admin, async (request, response) => {
    try {
        const certificateTemplateImage = await CertificateTemplateImage.findById(request.body.certificateTemplateImageId)
        if (!certificateTemplateImage) {
            return response.status(404).send({error: 'Invalid certificate template image ID!'})
        }
        const certificateTemplate = new CertificateTemplate(request.body)
        const data = await certificateTemplate.save()
        response.send({id: data.id, message: 'Certificate Template created successfully!'})
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.get('/certificate/template/:id', apiKey, async (request, response) => {
    try {
        const certificateTemplate = await CertificateTemplate.findById(request.params.id)
        if (!certificateTemplate) {
            return response.status(404).send({error: 'Invalid certificate template ID!'})
        } 
        const certificateTemplateImage = await CertificateTemplateImage.findById(certificateTemplate.certificateTemplateImageId)
        if (!certificateTemplateImage) {
            return response.status(404).send({error: 'Invalid certificate template image ID!'})
        }
        response.send({certificateTemplate, certificateTemplateImage: {
            binaryData: certificateTemplateImage.certificateTemplateImage,
            uri: `/certificate/templateImage/${certificateTemplateImage.id}`
        }})
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.get('/certificate/template', auth, apiKey, async (request, response) => {
    try {
        const certificateTemplates = await CertificateTemplate.find().sort( { "_id": -1 })
        if (request.query.all === 'true') {
            const certificateTemplatesArray = []
            certificateTemplates.forEach(certificateTemplate => {
                certificateTemplatesArray.push(CertificateTemplate.getAllCertificateTemplateResponse(certificateTemplate))
            })
            response.send(certificateTemplatesArray)
        } else {
            const certificateTemplateArray = []
            certificateTemplates.forEach(certificateTemplate => {
                certificateTemplateArray.push({
                    id: certificateTemplate.id,
                    templateName: certificateTemplate.templateName,
                    createdAt: certificateTemplate.createdAt,
                    certificateTemplateImage: {
                        id: certificateTemplate.certificateTemplateImageId,
                        uri: `/certificate/templateImage/${certificateTemplate.certificateTemplateImageId}`
                    }
                })
            })
            response.send(certificateTemplateArray)
        }
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.delete('/certificate/template/:id', apiKey, auth, admin, async (request, response) => {
    try {
        const certificateTemplate = await CertificateTemplate.findById(request.params.id)
        if (!certificateTemplate) {
            return response.status(404).send({error: 'Invalid certificate template ID!'})
        }
        if (certificateTemplate.linkedEvent.length != 0) {
            return response.status(400).send({error: 'Certificate template is linked to an event!'})
        }
        await certificateTemplate.remove()
        response.send({message: 'Certificate Template deleted successfully!'})
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.patch('/certificate/linkedEvent/:templateId/:eventId', apiKey, auth, admin, async (request, response) => {
    try {
        const certificateTemplate = await CertificateTemplate.findById(request.params.templateId)
        const pool = await Pool.findOne({eventID: request.params.eventId}, {_id: 0, eventID: 1, verified: 1})

        if (pool.verified) {
            return response.status(400).send({error: 'Event is already verified!'})
        }

        if (!certificateTemplate || !pool) {
            return response.status(404).send({ error: 'Invalid Certificate Template ID or Event ID!'})
        }
        const checkCertificateTemplate = await CertificateTemplate.findOne({linkedEvent: request.params.eventId})
        if (checkCertificateTemplate) {
            return response.status(400).send({ error: 'Event already has a certificate template!'})
        }
        !certificateTemplate.linkedEvent.includes(request.params.eventId)? certificateTemplate.linkedEvent.push(request.params.eventId): certificateTemplate.linkedEvent
        await certificateTemplate.save()
        response.send({message: 'Certificate Template linked to event successfully!'})
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.get('/certificate/metadataStatus/:eventId', apiKey, auth, admin, async (request, response) => {
    try {
        const certificateTemplate = await CertificateTemplate.findOne({linkedEvent: request.params.eventId})
        const lead = await Lead.findOne({'events.eventID': request.params.eventId})
        response.send({
            certificateOK: certificateTemplate? true: false,
            leadOK: lead? true: false
        })
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

module.exports = router