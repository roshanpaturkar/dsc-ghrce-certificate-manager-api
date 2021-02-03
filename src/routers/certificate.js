const express = require('express')

const Event = require('../models/event')
const Certificate = require('../models/certificate')

const router = new express.Router()

router.get('/certificates/:id', async (request, response) => {
    try {
        const certificate = await Certificate.findOne({ certificateID: request.params.id })
        const event = await Event.findOne({ eventID: certificate.eventID })
        
        response.send({ event, certificate })
    } catch (error) {
        response.status(404).send({ error: 'Invalid Certificate ID!'})
    }
})

module.exports = router