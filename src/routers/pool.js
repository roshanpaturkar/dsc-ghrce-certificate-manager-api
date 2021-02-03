const express = require('express')
const multer = require('multer')
const csv = require('csvtojson')

const Pool = require('../models/pool')
const Event = require('../models/event')
const Certificates = require('../models/certificate')
const auth = require('../middleware/auth')

const router = new express.Router()

const upload = multer({
        fileFilter (request, file, callback) {
            if (!file.originalname.match(/\.(csv)$/)) {
                return callback(new Error ('Please upload a csv'))
            }
            callback(undefined, true)
        }
    })

router.post('/publishCertificates', auth, upload.single('certificatesData'), async (request, response) => {
    const userData = {
        userID: request.user._id,
        name: request.user.name,
        email: request.user.email
    }

    try {
        const rawData = await csv().fromString(request.file.buffer.toString())
        const poolData = Pool.getPoolData(rawData, userData)
        const pool = new Pool(poolData)
        await pool.save()
        response.send(pool)
    } catch (error) {
        response.status(400).send({ error: error})
    }
})

router.post('/verifyCertificates/:eventID', auth, async (request, response) => {
    const verifiedBy = {
        userID: request.user._id,
        name: request.user.name,
        email: request.user.email
    }

    try {
        var pool = await Pool.findOne({eventID: request.params.eventID})

        if (!pool) {
            throw new Error()
        }

        if (pool.verified === true) {
            return response.status(208).send({error: 'This data is already verified by ' + pool.verifiedBy.name})
        }
        
        pool.verified = true
        pool.verifiedBy = verifiedBy
        
        const {eventID, eventName, description, speakerName, eventDate, certificateContent, publishedBy, verified, certificates} = pool
        const eventData = { eventID, eventName, description, speakerName, eventDate, certificateContent, publishedBy, verified, verifiedBy }
        const event = new Event(eventData)
        
        await event.save()
        await Certificates.insertMany(certificates)
        await pool.save()
        
        response.status(201).send()
    } catch (error) {
        response.status(400).send(error)
    }
})

module.exports = router