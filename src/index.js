const express = require('express')
var cors = require('cors')
var origin = require('./cors/origin')
require('./db/mongoose')

const apiKey = require('./middleware/apiKey')

//  Legacy (V1) API Routers imports
const userRouter = require('./routers/user')
const poolRouter = require('./routers/pool')
const certificatesRouter = require('./routers/certificate')
const rejectPoolRouter = require('./routers/rejectPool')
const certificateTypeRouter = require('./routers/certificateType')
const otpRouter = require('./routers/otp')
const leadRouter = require('./routers/lead')
const certificateTemplate = require('./routers/certificateTemplate')

//  V2 API Routers imports
const v2Pool = require('./routers/v2/pool')

//  Legacy (V1) B2B imports
const sendEventData = require('./routers/extensions_b2b/sendEventData')

const app = express()
const port = process.env.PORT

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

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})