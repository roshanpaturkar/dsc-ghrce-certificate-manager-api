const express = require('express')

const auth = require('../../middleware/auth')
const getPoolResponse = require('../../support/routers/v2/pool')

const router = new express.Router()

router.get('/v2/pool', auth, async (request, response) => {
    const pageSize = request.query.pageSize? parseInt(request.query.pageSize) : 6
    const pageNumber = request.query.pageNumber? parseInt(request.query.pageNumber) : 1

    if (pageSize <= 0 || pageNumber <=0) {
        return response.status(400).send({ error: 'pageSize and pageNumber must be greater than 0.' })
    }

    try {
        if (request.query.verified === 'true') {
            const query = { verified: true }
            const responseData = await getPoolResponse(pageSize, pageNumber, query)
            response.send(responseData)
        } else if (request.query.verified === 'false') {
            const query = { verified: false }
            const responseData = await getPoolResponse(pageSize, pageNumber, query)
            response.send(responseData)
        } else {
            const responseData = await getPoolResponse(pageSize, pageNumber)
            response.send(responseData)
        }
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
})

module.exports = router