const express = require('express')
var cors = require('cors')
var origin = require('./cors/origin')
require('./db/mongoose')

const apiKey = require('./middleware/apiKey')

const userRouter = require('./routers/user')
const poolRouter = require('./routers/pool')
const certificatesRouter = require('./routers/certificate')
const rejectPoolRouter = require('./routers/rejectPool')
const certificateTypeRouter = require('./routers/certificateType')
const otpRouter = require('./routers/otp')
const leadRouter = require('./routers/lead')
const certificateTemplate = require('./routers/certificateTemplate')

const sendEventData = require('./routers/extensions_b2b/sendEventData')

const app = express()
const port = process.env.PORT

if (process.env.ENV != undefined) {
    app.use(cors())         //  Allow all origins while running in local
} else {
    app.use(cors(origin))   //  Allow only configured origin wile running in prod
}

app.get('/', apiKey, (request, response) => {
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

app.use(express.json())
app.use(userRouter)
app.use(poolRouter)
app.use(certificatesRouter)
app.use(rejectPoolRouter)
app.use(certificateTypeRouter)
app.use(otpRouter)
app.use(leadRouter)
app.use(certificateTemplate)
app.use(sendEventData)

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})