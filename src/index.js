const express = require('express')
var cors = require('cors')
require('./db/mongoose')

const apiKey = require('./key/apiKey')

const userRouter = require('./routers/user')
const poolRouter = require('./routers/pool')
const certificatesRouter = require('./routers/certificate')
const rejectPoolRouter = require('./routers/rejectPool')

const app = express()
const port = process.env.PORT

app.use(cors())

app.get('/:key/', apiKey, (request, response) => {
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

app.use(express.json())
app.use(userRouter)
app.use(poolRouter)
app.use(certificatesRouter)
app.use(rejectPoolRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})