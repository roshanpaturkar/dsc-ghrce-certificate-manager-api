const express = require('express')

const apiKey = require('../key/apiKey')

const auth = require('../middleware/auth')
const RejectPool = require('../models/rejectPool')
const Pool = require('../models/pool')

const router = new express.Router()

router.delete('/:key/rollback/rejectPool/:eventID', apiKey, auth, async (request, response) => {
    const rejectRollbackBy = {
        userID: request.user._id,
        name: request.user.name,
        email: request.user.email
    }
    try {
        const rejectPool = await RejectPool.findOne({ eventID: request.params.eventID })
        if (!rejectPool) {
            return response.status(404).send({ error: 'Invalid Event ID!' })
        }
        
        rejectPool.rejectRollbackBy = rejectRollbackBy
        rejectPool.rejected = false
    
        await Pool.insertMany(rejectPool)
        await rejectPool.remove()

        response.send()
    } catch (error) {
        response.status(400).send({ error: 'Duplicate data found in pool!' })   
    }
})

router.get('/:key/rejectPool', apiKey, auth, async (request, response) => {
    try {
        
        const rejectPool = await RejectPool.find()

        if (!rejectPool) {
            return response.status(404).send({ error: 'Data not found!' })
        }
        response.send(rejectPool)
    } catch (error) {
        response.status(500).send()
    }
})

module.exports = router