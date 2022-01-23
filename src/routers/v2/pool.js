const express = require('express')
const _ = require('lodash')

const auth = require('../../middleware/auth')
const Pool = require('../../models/pool')

const router = new express.Router()

router.get('/v2/pool', auth, async (request, response) => {
    let pools = []

    const pageSize = request.query.pageSize? parseInt(request.query.pageSize) : 6
    const pageNumber = request.query.pageNumber? parseInt(request.query.pageNumber) : 1

    try {
        if (request.query.verified === 'true') {
            // pools = await Pool.find({ verified: true }).sort( { "_id": -1 })

            const skips = pageSize * (pageNumber - 1)
            const total = await Pool.find({ verified: true }).countDocuments()
            const currentPageEvents = await Pool.find({ verified: true }).sort( { "_id": -1 }).skip(skips).limit(pageSize)
            const pageCount = total/pageSize
            const totalPages = pageCount.toString().split('.')[1]?parseInt(pageCount.toString().split('.')[0])+1: parseInt(pageCount.toString().split('.')[0]);
            
            response.send({
                pageSize: pageSize,
                pageNumber: pageNumber,
                totalPages: totalPages,
                total: total,
                dataCount: currentPageEvents.length,
                data: currentPageEvents
            })
        } else if (request.query.verified === 'false') {
            // pools = await Pool.find({ verified: false }).sort( { "_id": -1 })

            const skips = pageSize * (pageNumber - 1)
            const total = await Pool.find({ verified: false }).countDocuments()
            const currentPageEvents = await Pool.find({ verified: false }).sort( { "_id": -1 }).skip(skips).limit(pageSize)
            const pageCount = total/pageSize
            const totalPages = pageCount.toString().split('.')[1]?parseInt(pageCount.toString().split('.')[0])+1: parseInt(pageCount.toString().split('.')[0]);
            
            response.send({
                pageSize: pageSize,
                pageNumber: pageNumber,
                totalPages: totalPages,
                total: total,
                dataCount: currentPageEvents.length,
                data: currentPageEvents
            })
        } else {
            const skips = pageSize * (pageNumber - 1)
            const total = await Pool.find().countDocuments()
            const currentPageEvents = await Pool.find().sort( { "_id": -1 }).skip(skips).limit(pageSize)
            const pageCount = total/pageSize
            const totalPages = pageCount.toString().split('.')[1]?parseInt(pageCount.toString().split('.')[0])+1: parseInt(pageCount.toString().split('.')[0]);
            
            response.send({
                pageSize: pageSize,
                pageNumber: pageNumber,
                totalPages: totalPages,
                total: total,
                dataCount: currentPageEvents.length,
                data: currentPageEvents
            })
        }
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
})

module.exports = router