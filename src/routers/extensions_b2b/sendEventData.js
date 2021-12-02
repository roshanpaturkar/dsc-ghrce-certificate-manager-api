const express = require('express')
const cryptoRandomString = require('crypto-random-string');

const Pool = require('../../models/pool');

const apiKey = require('../../middleware/apiKey')

const router = new express.Router()

router.post('/b2b/certificate/manager/sendEventData', apiKey, async (request, response) => {
    try {
        request.body.publishedBy.userID = '61a8e841d9a7c200161be3d2'
        request.body.certificateTypeCode = 'NA'
        request.body.certificateType = 'NONE'

        certificates = []
        request.body.attendeesList.forEach(attendee => {
            certificates.push({
                eventID: request.body.eventID,
                certificateID: cryptoRandomString({length: 20}),
                name: attendee.name,
                email: attendee.email,
            })
        })
        request.body.certificates = certificates

        const pool = new Pool(request.body)
        await pool.save()
    }  catch (error) {
        console.log(error)
        response.status(500).send(error)
    }

    response.send('Event data received at certificate server!')
})

module.exports = router