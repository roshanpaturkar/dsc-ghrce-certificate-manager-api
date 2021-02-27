const { request, response } = require('express')
const express = require('express')

const apiKey = require('../middleware/apiKey')

const admin = require('../middleware/admin')
const auth = require('../middleware/auth')

const Pool = require('../models/pool')
const Event = require('../models/event')
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

router.patch('/certificateType/:typeCode', apiKey, auth, admin, async (request, response) => {
    try {
        var certificateType = await CertificateType.findOne({ typeCode: request.params.typeCode.toUpperCase() })

        if (!certificateType) {
            return response.status('400').send({error: 'Invalid certificate type code!'})
        }


        certificateType.typeCode = request.body.typeCode
        certificateType.certificateType = request.body.certificateType
       
        await certificateType.save()
        await Pool.updateMany({ 
            certificateTypeCode: request.params.typeCode.toUpperCase()
        }, {
            certificateTypeCode: certificateType.typeCode,
            certificateType: certificateType.certificateType
        })
        await Event.updateMany({ 
            certificateTypeCode: request.params.typeCode.toUpperCase()
        }, {
            certificateTypeCode: certificateType.typeCode,
            certificateType: certificateType.certificateType
        })


        response.send(certificateType)
    } catch (error) {
        console.log(error);
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

router.delete('/certificateType/:typeCode', apiKey, auth, admin, async (request, response) => {
    try {
        const pool = await Pool.find({ certificateTypeCode: request.params.typeCode.toUpperCase()})

        if (pool.length !== 0) {
            return response.status(400).send({ error: `Can not delete this certificate type, ${pool.length} event data is associated with this certificate type!` })
        }

        await CertificateType.deleteOne({ typeCode: request.params.typeCode.toUpperCase()})
        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

module.exports = router