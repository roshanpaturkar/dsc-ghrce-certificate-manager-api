const { request, response } = require('express')
const express = require('express')

const apiKey = require('../middleware/apiKey')

const admin = require('../middleware/admin')
const auth = require('../middleware/auth')

const CertificateType = require('../models/certificateType')

const router = new express.Router()

router.post('/certificateType', apiKey, auth, admin, async (request, response) => {
    try {
        const certificateType = new CertificateType(request.body)
        await certificateType.save()
        response.status(201).send(certificateType)
    } catch (error) {
        response.status(400).send(error)
    }
})

router.get('/certificateType', apiKey,  auth, admin, async (request, response) => {
    try {
        const certificateTypes = await CertificateType.find()
        if (!certificateTypes) {
            return response.status(404).send({ error: 'Data not found!' })
        }
        response.send(certificateTypes)
    } catch (error) {
        response.status(500).send()
    }
})

module.exports = router