const express = require('express')
const cryptoRandomString = require('crypto-random-string')

const Otp = require('../models/otp')
const User = require('../models/user')
const { sendOtp } = require('../emails/account')

const passwordResetAuth = require('../middleware/passwordResetAuth')
const apiKey = require('../middleware/apiKey')

const router = new express.Router()

router.post('/forgetPassword', apiKey, async (request, response) => {
    const genDate = new Date()
    const expiryDate = new Date()
    expiryDate.setMinutes(expiryDate.getMinutes() + 10)

    try {
        const user = await User.findOne({ email: request.body.email })
        if (!user) {
            return response.status(400).send({ message: 'Invalid email!' });
        }

        await Otp.deleteOne({ email: request.body.email })

        const otp = new Otp({
            email: request.body.email,
            otp: cryptoRandomString({
                length: 6,
                type: 'numeric'
            }),
            generateDateTime: genDate,
            expiryDateTime: expiryDate,
        })

        await otp.save()
        await sendOtp(user.name, otp)

        response.status(201).send({ message: 'OTP is sent to your registered email.' })
    } catch (error) {
        response.status(500).send()
    }
})

router.post('/verifyOtp', apiKey, async (request, response) => {
    try {
        const currentTime = new Date()
        const otp = await Otp.findOne({ email: request.body.email, otp: request.body.otp})
        if (!otp) {
            return response.status(400).send({ message: 'Invalid OTP!'})
        }
        if (currentTime > otp.generateDateTime && currentTime < otp.expiryDateTime) {
            if (otp.token) {
                return response.send({ message: 'Already verified!' })
            }
            const token = await otp.verifyOtp(request.body.email)
            otp.token = token;
            await otp.save()
            return response.send({ message: 'Use this token to reset the password!', token: token })
        }
        response.status(400).send({ message: 'Invalid OTP!' })
    } catch (error) {
        response.status(500).send()
    }
})

router.post('/resetPassword', apiKey, passwordResetAuth, async (request, response) => {
    try {
        const currentTime = new Date()
        if (currentTime > request.otp.generateDateTime && currentTime < request.otp.expiryDateTime) {
            request.user.password = request.body.password
            request.user.tokens = []
            
            await request.user.save()
            await Otp.deleteOne({ token: request.token })

            return response.status(201).send({ message: 'Password reset successfully, your account is logout from all the devices.' })
        }
        response.status(400).send({ message: 'Invalid token!' })
    } catch (error) {
        console.log(error);
         response.status(500).send()
    }
})

module.exports = router