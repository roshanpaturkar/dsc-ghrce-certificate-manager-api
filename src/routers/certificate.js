const express = require('express')

const apiKey = require('../middleware/apiKey')

const auth = require('../middleware/auth')
const Event = require('../models/event')
const Certificate = require('../models/certificate')
const sendCertificate = require('../emails/sendCertificate')

const router = new express.Router()

router.get('/certificates/:id', apiKey, async (request, response) => {
    try {
        const certificate = await Certificate.findOne({ certificateID: request.params.id })
        const event = await Event.findOne({ eventID: certificate.eventID })
        
        response.send({ event, certificate })
    } catch (error) {
        response.status(404).send({ error: 'Invalid Certificate ID!'})
    }
})

router.get('/sendCertificate/:id', apiKey, auth, async (request, response) => {
    try {
        const certificate = await Certificate.findOne({ certificateID: request.params.id })
        const event = await Event.findOne({ eventID: certificate.eventID })
        sendCertificate(certificate, event.eventName)

        response.send({message: `Certificate sent to ${certificate.name} on ${certificate.email}`})
    } catch (error) {
        response.status(404).send({ error: 'Invalid Certificate ID!'})
    }
})

module.exports = router