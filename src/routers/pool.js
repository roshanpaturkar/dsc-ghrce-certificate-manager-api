const express = require('express')
const multer = require('multer')
const csv = require('csvtojson')

const apiKey = require('../middleware/apiKey')
const admin = require('../middleware/admin')

const Pool = require('../models/pool')
const RejectPool = require('../models/rejectPool')
const Event = require('../models/event')
const Certificates = require('../models/certificate')
const auth = require('../middleware/auth')

const certificateIssueDate = require('../utility/getDate')
const sendCertificate = require('../emails/sendCertificate')

const router = new express.Router()

const upload = multer({
        fileFilter (request, file, callback) {
            if (!file.originalname.match(/\.(csv)$/)) {
                return callback(new Error ('Please upload a csv'))
            }
            callback(undefined, true)
        }
    })

router.post('/publishCertificates', apiKey, auth, upload.single('certificatesData'), async (request, response) => {
    const userData = {
        userID: request.user._id,
        name: request.user.name,
        email: request.user.email
    }

    try {
        const rawData = await csv().fromString(request.file.buffer.toString())
        const poolData = await Pool.getPoolData(rawData, userData)
        const pool = new Pool(poolData)
        await pool.save()
        response.send(pool)
    } catch (error) {
        console.log(error);
        response.status(400).send({ error: error})
    }
})

router.post('/verifyCertificates/:eventID', apiKey, auth, admin, async (request, response) => {
    const verifiedBy = {
        userID: request.user._id,
        name: request.user.name,
        email: request.user.email
    }

    try {
        var pool = await Pool.findOne({eventID: request.params.eventID})

        if (!pool) {
            return response.status(404).send({ error: 'Invalid Event ID!' })
        }

        if (pool.rejected === true) {
            return response.status(406).send({ error: 'Can not verify! This data is rejected by ' + pool.rejectedBy.name })
        }

        if (pool.verified === true) {
            return response.status(208).send({ error: 'This data is already verified by ' + pool.verifiedBy.name })
        }

        const issueDate = certificateIssueDate()

        pool.verified = true
        pool.verifiedBy = verifiedBy
        pool.rollbackBy = undefined
        pool.certificateIssueDate = issueDate
        
        const {eventID, eventName, description, speakerName, eventDate, certificateContent, certificateTypeCode, certificateType, publishedBy, verified, certificates} = pool
        const eventData = { eventID, eventName, description, speakerName, eventDate, certificateContent, certificateTypeCode, certificateType, publishedBy, verified, verifiedBy }
        const event = new Event(eventData)
        event.certificateIssueDate = issueDate

        await event.save()
        await Certificates.insertMany(certificates)
        await pool.save()

        let count = 1;
        certificates.forEach(async certificate => {
            console.log(`${count++} Sent > ${certificate.name} ${certificate.email}`);
            await sendCertificate(certificate, eventName).catch(error => {
                console.log(error);
            })
        });
        
        response.status(201).send()
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/rejectCertificates/:eventID', apiKey, auth, admin, async (request, response) => {
    const rejectedBy = {
        userID: request.user._id,
        name: request.user.name,
        email: request.user.email
    }

    try {
        const pool = await Pool.findOne({ eventID: request.params.eventID })

        if (!pool) {
            return response.status(404).send({ error: 'Invalid Event ID!' })
        }

        if (pool.verified === true) {
            return response.status(208).send({ error: 'This data is already verified by ' + pool.verifiedBy.name })
        }

        pool.rejected = true
        pool.rejectedBy = rejectedBy

        await RejectPool.insertMany(pool)
        await pool.remove()

        response.send()
    } catch (error) {
        response.status(400).send(error)
    }
})

router.delete('/rollback/:eventID', apiKey, auth, admin, async (request, response) => {
    const rollbackBy = {
        userID: request.user._id,
        name: request.user.name,
        email: request.user.email
    }
    try {
        const pool = await Pool.findOne({ eventID: request.params.eventID })

        if (!pool) {
            return response.status(404).send({ error: 'Invalid Event ID!' })
        }

        if (pool.verified === false) {
            return response.status(400).send({ error: 'Data is either not verified or already rollback!' })
        }
        
        pool.verified = false
        pool.verifiedBy = undefined
        pool.certificateIssueDate = undefined
        pool.rollbackBy = rollbackBy
        
        await pool.save()
        await Event.deleteMany({ eventID: request.params.eventID })
        await Certificates.deleteMany({ eventID: request.params.eventID })

        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

router.get('/pool', apiKey, auth, async (request, response) => {
    let pools = []

    try {
        if (request.query.verified === 'true') {
            pools = await Pool.find({ verified: true })
        } else if (request.query.verified === 'false') {
            pools = await Pool.find({ verified: false })
        } else {
            pools = await Pool.find()
        }

        if (!pools) {
            return response.status(404).send({ error: 'Data not found!' })
        }
        response.send(pools)
    } catch (error) {
        response.status(500).send()
    }
})

module.exports = router