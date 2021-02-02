const express = require('express')
const multer = require('multer')
const csv = require('csvtojson')

const Pool = require('../models/pool')
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

module.exports = router