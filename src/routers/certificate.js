const express = require('express')

const apiKey = require('../middleware/apiKey')

const auth = require('../middleware/auth')
const Event = require('../models/event')
const Certificate = require('../models/certificate')
const Lead = require('../models/lead')
const CertificateTemplate = require('../models/certificateTemplateTest')
const CertificateTemplateImage = require('../models/certificateTemplateImage')
const sendCertificate = require('../emails/sendCertificate')
const admin = require('../middleware/admin')

const router = new express.Router()

router.get('/certificates/:id', apiKey, async (request, response) => {
    legacyEventIds = ['82cf194df831b2979522409a048ae0', 'c89414443fc7a42aca659b2fcf8ada', 'cf53a49eb74d25a981dcf7c5b17cd5', '57b7583ac04e94853283477ee1ca4c', '36072924de276a1d6d4cbe2f57a498']
    try {
        const certificate = await Certificate.findOne({ certificateID: request.params.id })
        const event = await Event.findOne({ eventID: certificate.eventID })

        if (legacyEventIds.includes(event.eventID)) {
            return response.send({ event, certificate })
        }

        const lead = await Lead.findOne({ 'events.eventID': event.eventID })
        const certificateTemplate = await CertificateTemplate.findOne({ linkedEvent: event.eventID })
        const certificateTemplateImage = await CertificateTemplateImage.findById(certificateTemplate.certificateTemplateImageId)

        response.send({
            event: CertificateTemplate.getEventResponse(event),
            certificate: CertificateTemplate.getCertificateResponse(certificate),
            lead: CertificateTemplate.getLeadResponse(lead),
            certificateTemplate: CertificateTemplate.getCertificateTemplateResponse(certificateTemplate, certificateTemplateImage)
        })
        
    } catch (error) {
        console.log(error);
        response.status(404).send({ error: 'Invalid Certificate ID!'})
    }
})

router.get('/sendCertificate/:id', apiKey, auth, admin, async (request, response) => {
    try {
        const certificate = await Certificate.findOne({ certificateID: request.params.id })
        const event = await Event.findOne({ eventID: certificate.eventID })
        sendCertificate(certificate, event.eventName)

        response.send({message: `Certificate sent to ${certificate.name} on ${certificate.email}`})
    } catch (error) {
        console.log(error);
        response.status(404).send({ error: 'Invalid Certificate ID!'})
    }
})

module.exports = router