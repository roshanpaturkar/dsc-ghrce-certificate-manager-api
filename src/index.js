const express = require('express')
var cors = require('cors')
require('./db/mongoose')

const apiKey = require('./middleware/apiKey')

const userRouter = require('./routers/user')
const poolRouter = require('./routers/pool')
const certificatesRouter = require('./routers/certificate')
const rejectPoolRouter = require('./routers/rejectPool')
const certificateTypeRouter = require('./routers/certificateType')
const otpRouter = require('./routers/otp')

const app = express()
const port = process.env.PORT

app.use(cors())

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

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})