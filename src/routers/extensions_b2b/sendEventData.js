const express = require('express')

const apiKey = require('../../middleware/apiKey')

const router = new express.Router()

router.post('/b2b/certificate/manager/sendEventData', apiKey, async (request, response) => {
    request.body.publishedBy.userID = '61a8e841d9a7c200161be3d2'
    console.log(request.body);
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

module.exports = router