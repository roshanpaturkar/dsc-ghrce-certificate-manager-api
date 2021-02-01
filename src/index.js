const { request } = require('express')
const express = require('express')

const app = express()
const port = process.env.PORT

app.get('/', (request, response) => {
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})