const express = require('express')
const _ = require('lodash')

const auth = require('../../middleware/auth')
const Pool = require('../../models/pool')

const router = new express.Router()

router.get('/v2/pool', auth, async (request, response) => {
    let pools = []

    // const total = await Pool.find().skip(1).limit(1).sort( { "_id": -1 });
    // console.log(total);

    const pageSize = request.query.pageSize? parseInt(request.query.pageSize) : 3
    const pageNumber = request.query.pageNumber? parseInt(request.query.pageNumber) : 1

    console.log(pageSize);

    try {
        if (request.query.verified === 'true') {
            pools = await Pool.find({ verified: true }).sort( { "_id": -1 })
        } else if (request.query.verified === 'false') {
            pools = await Pool.find({ verified: false }).sort( { "_id": -1 })
        } else {
            pools = await Pool.find().limit(pageSize).sort( { "_id": -1 })
            // console.log(await Pool.find().limit(pageSize).sort( { "_id": -1 }).countDocuments());
            const skips = pageSize * (pageNumber - 1)
            const total = await Pool.find().countDocuments()
            const currentPageEvents = await Pool.find().sort( { "_id": -1 }).skip(skips).limit(pageSize)
            console.log(6/3);
            console.log(6/4);
            
            
            console.log(currentPageEvents.length);
            // const totalPages = 
        }

        if (!pools) {
            return response.status(404).send({ error: 'Data not found!' })
        }
        response.send(pools)
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
})

module.exports = router