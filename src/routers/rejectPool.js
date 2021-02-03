const { async } = require('crypto-random-string')
const { request, response } = require('express')
const express = require('express')

const auth = require('../middleware/auth')
const RejectPool = require('../models/rejectPool')
const Pool = require('../models/pool')

const router = new express.Router()

router.post('/rollback/rejectPool/:eventID', auth, async (request, response) => {
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

module.exports = router