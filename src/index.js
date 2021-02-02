const express = require('express')
var cors = require('cors')
require('./db/mongoose')

const userRouter = require('./routers/user')
const poolRouter = require('./routers/pool')

const app = express()
const port = process.env.PORT

app.use(cors())

app.get('/', (request, response) => {
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

app.use(express.json())
app.use(userRouter)
app.use(poolRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})