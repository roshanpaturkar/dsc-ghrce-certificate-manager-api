const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT

app.get('/', (request, response) => {
    response.send('Welcome to the DSC GHRCE Certificate Manager!')
})

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})