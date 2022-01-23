const express = require('express')

const auth = require('../../middleware/auth')
const Pool = require('../../models/pool')

const router = new express.Router()

router.get('/v2/pool', auth, async (request, response) => {
    const pageSize = request.query.pageSize? parseInt(request.query.pageSize) : 6
    const pageNumber = request.query.pageNumber? parseInt(request.query.pageNumber) : 1

    if (pageSize <= 0 || pageNumber <=0) {
        return response.status(400).send({ error: 'pageSize and pageNumber must be greater than 0.' })
    }

    try {
        if (request.query.verified === 'true') {
            const skips = pageSize * (pageNumber - 1)
            const total = await Pool.find({ verified: true }).countDocuments()
            const currentPageEvents = await Pool.find({ verified: true }).sort( { "_id": -1 }).skip(skips).limit(pageSize)
            const pageCount = total/pageSize
            const totalPages = pageCount.toString().split('.')[1]?parseInt(pageCount.toString().split('.')[0])+1: parseInt(pageCount.toString().split('.')[0]);
            
            response.send({
                currentPageSize: pageSize,
                currentPageNumber: pageNumber,
                totalPages: totalPages,
                totalDataCount: total,
                currentPageDataCount: currentPageEvents.length,
                data: currentPageEvents
            })
        } else if (request.query.verified === 'false') {
            const skips = pageSize * (pageNumber - 1)
            const total = await Pool.find({ verified: false }).countDocuments()
            const currentPageEvents = await Pool.find({ verified: false }).sort( { "_id": -1 }).skip(skips).limit(pageSize)
            const pageCount = total/pageSize
            const totalPages = pageCount.toString().split('.')[1]?parseInt(pageCount.toString().split('.')[0])+1: parseInt(pageCount.toString().split('.')[0]);
            
            response.send({
                currentPageSize: pageSize,
                currentPageNumber: pageNumber,
                totalPages: totalPages,
                totalDataCount: total,
                currentPageDataCount: currentPageEvents.length,
                data: currentPageEvents
            })
        } else {
            const skips = pageSize * (pageNumber - 1)
            const total = await Pool.find().countDocuments()
            const currentPageEvents = await Pool.find().sort( { "_id": -1 }).skip(skips).limit(pageSize)
            const pageCount = total/pageSize
            const totalPages = pageCount.toString().split('.')[1]?parseInt(pageCount.toString().split('.')[0])+1: parseInt(pageCount.toString().split('.')[0]);
            
            response.send({
                currentPageSize: pageSize,
                currentPageNumber: pageNumber,
                totalPages: totalPages,
                totalDataCount: total,
                currentPageDataCount: currentPageEvents.length,
                data: currentPageEvents
            })
        }
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
})

module.exports = router