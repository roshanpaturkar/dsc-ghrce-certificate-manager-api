const express = require('express')

const Lead = require('../models/lead')
const Pool = require('../models/pool')
const apiKey = require('../middleware/apiKey')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const router = new express.Router()

router.post('/leads', apiKey, auth, admin, async (request, response) => {
    try {
        const lead = Lead(request.body)
        await lead.save()
        response.status(201).send({message: 'New lead information added successfully!'})
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.get('/leads', apiKey, auth, admin, async (request, response) => {
    try {
        const id = request.query.id
        if (id) {
            const lead = await Lead.findById(id)
            return response.send(lead? lead: {message: `No data found for Id '${id}'!`})
        }
        const leads = await Lead.find()
        response.send(leads)
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.patch('/leads/link/:eventID/:leadID', apiKey, auth, admin, async (request, response) => {
    try {
        const eventID = request.params.eventID
        const leadID = request.params.leadID
        if (!eventID || !leadID) {
            return response.status(400).send('eventID or leadID is missing!')
        }
        const pool = await Pool.findOne({eventID: eventID})
        const lead = await Lead.findById(leadID)
        if (!pool) {
            return response.status(400).send(`Event with eventId '${eventID}' is not exists!`)
        }
        if (!lead) {
            return response.status(400).send(`Lead with ID '${leadID}' is not found!`)
        }
        if (pool.verified) {
            return response.status(400).send(`Event with eventId '${eventID}' is already verified!`)
        }

        const eventData = {
            eventID: eventID,
            eventName: pool.eventName
        }
        const leadCheck = await Lead.findOne({'events.eventID': eventID})
        if (leadCheck) {
            return response.status(400).send('Lead information already linked with this event!')
        }
        lead.events = lead.events.concat(eventData)
        await lead.save()
        response.send({message: `Lead ID is successfully linked to ${pool.eventName}!`})
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.delete('/leads/:id', apiKey, auth, admin, async (request, response) => {
    const id = request.params.id
    try {
        if (!id) {
            throw new Error('ID is missing!')
        }
        const lead = await Lead.findById(id)
        if (!lead) {
            return response.status(404).send(`Lead ID '${id}' is not found!`)
        }
        if (lead.events.length != 0 && lead) {
            return response.status(400).send({message: 'Unable to delete, lead data is linked with events!'})
        }
        await Lead.deleteOne({_id: id})
        response.send(`Lead data is deleted for ID '${id}'!`)
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

module.exports = router