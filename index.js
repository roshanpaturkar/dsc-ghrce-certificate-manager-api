// Description: This is customized for deta deployment. This file is the entry point of the application deta macros. It is responsible for setting up the server and the database connection.

const express = require('express')
var cors = require('cors')
var origin = require('./src/cors/origin')
require('./src/db/mongoose')

const apiKey = require('./src/middleware/apiKey')

//  Legacy (V1) API Routers imports
const userRouter = require('./src/routers/user')
const poolRouter = require('./src/routers/pool')
const certificatesRouter = require('./src/routers/certificate')
const rejectPoolRouter = require('./src/routers/rejectPool')
const certificateTypeRouter = require('./src/routers/certificateType')
const otpRouter = require('./src/routers/otp')
const leadRouter = require('./src/routers/lead')
const certificateTemplate = require('./src/routers/certificateTemplate')

//  V2 API Routers imports
const v2Pool = require('./src/routers/v2/pool')

//  Legacy (V1) B2B imports
const sendEventData = require('./src/routers/extensions_b2b/sendEventData')

const app = express()
// const port = process.env.PORT    //  Not Required for Deta

//  CORS origins configuration
if (process.env.ENV != undefined) {
    app.use(cors())
} else {
    app.use(cors(origin))
}

app.get('/', apiKey, (request, response) => {
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

app.use(express.json())

//  Legacy (V1) Routers
app.use(userRouter)
app.use(poolRouter)
app.use(certificatesRouter)
app.use(rejectPoolRouter)
app.use(certificateTypeRouter)
app.use(otpRouter)
app.use(leadRouter)
app.use(certificateTemplate)
app.use(sendEventData)

//  V2 Routers
app.use(v2Pool)

// app.listen(port, () => {                             //  Not Required for Deta
//     console.log('Server is up on port ' + port);
// })

module.exports = app    //  Required for Deta