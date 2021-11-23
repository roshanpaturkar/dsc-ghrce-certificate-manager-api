const express = require('express')

const apiKey = require('../../middleware/apiKey')

const router = new express.Router()

router.post('/b2b/certificate/manager/sendEventData', apiKey, async (request, response) => {
    userData = {
        
    }
    console.log(request.body);
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

module.exports = router