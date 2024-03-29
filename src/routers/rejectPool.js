const express = require('express')

const apiKey = require('../middleware/apiKey')
const admin = require('../middleware/admin')

const auth = require('../middleware/auth')
const RejectPool = require('../models/rejectPool')
const Pool = require('../models/pool')
const { async } = require('crypto-random-string')

const router = new express.Router()

router.delete('/rollback/rejectPool/:eventID', apiKey, auth, admin, async (request, response) => {
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
        console.log(error);
        response.status(400).send({ error: 'Duplicate data found in pool!' })   
    }
})

router.get('/rejectPool', apiKey, auth, admin, async (request, response) => {
    try {
        
        const rejectPool = await RejectPool.find().sort( { "_id": -1 })

        if (!rejectPool) {
            return response.status(404).send({ error: 'Data not found!' })
        }
        response.send(rejectPool)
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
})


router.delete("/rejectPool/event/:eventID", apiKey, auth, admin, async(request, response) => {
    const rejectPool = await RejectPool.findOne({
      eventID: request.params.eventID,
    });
    if (!rejectPool) {
      return response.status(404).send({ error: "Invalid Event ID!" });
    }
    await rejectPool.remove();
    response.send();
});

module.exports = router