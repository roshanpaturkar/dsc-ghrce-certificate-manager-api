const express = require('express')

const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async (request, response) => {
    const user = new User(request.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({user, token})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/users/login', async (request, response) => {
    try {
        const user = await User.findUserByCredentials(request.body.email, request.body.password)
        const token = await user.generateAuthToken()
        response.send({user, token})
    } catch (error) {
        response.status(400).send()
    }
})

router.post('/users/logout', auth, async (request, response) => {
    try {
        request.user.tokens = request.user.tokens.filter((token) => {
            return token.token !== request.token
        })

        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async (request, response) => {
    try {
        request.user.tokens = []
        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

router.get('/users/me', auth, async (request, response) => {
    response.send(request.user)
})

router.patch('/users/me', auth, async (request, response) => {
    const updates = Object.keys(request.body)
    const allowedUpdates = ['name', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return response.status(400).send({
            error: 'Invalid updates! You can only change name and password!',
            message: 'If you want to change email or mobile number, please contact admin.'
        })
    }

    try {
        updates.forEach((update) => request.user[update] = request.body[update])
        await request.user.save()

        response.send(request.user)
    } catch (error) {
        response.status(400).send(error)
    }
})

module.exports = router