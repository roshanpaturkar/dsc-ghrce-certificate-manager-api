const jwt = require('jsonwebtoken')

const Otp = require('../models/otp')
const User = require('../models/user')

const passwordResetAuth = async (request, response, next) => {
    try {
        const token = request.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const otp = await Otp.findOne({ email: request.body.email, token: token})
        const user = await User.findOne({  _id: decoded._id, email: request.body.email })

        if (!otp) {
            return response.status(400).send({ message: 'Invalid token!' })
        }

        if (!user) {
            return response.status(400).send({ message: 'User is not authorized to use this token.'})
        }

        request.otp = otp
        request.token = token
        request.user = user

        next()
    } catch (error) {
        response.status(500).send()
    }
}

module.exports = passwordResetAuth