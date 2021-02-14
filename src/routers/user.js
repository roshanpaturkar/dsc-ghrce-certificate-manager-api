const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const apiKey = require('../middleware/apiKey')

const User = require('../models/user')
const auth = require('../middleware/auth')
const unavailable = require('../middleware/unavailable')

const router = new express.Router()

router.post('/:key/users', apiKey, unavailable, async (request, response) => {
    const user = new User(request.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({user, token})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/:key/users/login', apiKey, async (request, response) => {
    try {
        const user = await User.findUserByCredentials(request.body.email, request.body.password)
        const token = await user.generateAuthToken()
        response.send({user, token})
    } catch (error) {
        response.status(400).send()
    }
})

router.post('/:key/users/logout', apiKey, auth, async (request, response) => {
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

router.post('/:key/users/logoutAll', apiKey, auth, async (request, response) => {
    try {
        request.user.tokens = []
        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

router.get('/:key/users/me', apiKey, auth, async (request, response) => {
    response.send(request.user)
})

router.patch('/:key/users/me', apiKey, auth, async (request, response) => {
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

router.delete('/:key/users/me', apiKey, unavailable, auth, async (request, response) => {
    try {
        await request.user.remove()
        response.send(request.user)
    } catch (error) {
        response.status(500).send()   
    }
})

const upload = multer ({
        limits: {
            fileSize: 1000000
        },
        fileFilter (request, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new Error ('Please upload an image'))
            }
            callback(undefined, true)
        }
    })

router.post('/:key/users/me/avatar', apiKey, auth, upload.single('avatar'), async (request, response) => {
    try {
        const buffer = await sharp(request.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        request.user.avatar = buffer
    } catch (error) {
        console.log(error);
        response.status(400).send({ error: 'Image data not found!'})
    }
    await request.user.save()
    response.send()
}, (error, request, response, next) => {
    console.log(error);
    response.status(400).send({ error: error.message })
})

router.delete('/:key/users/me/avatar', apiKey, auth, async (request, response) => {
    try {

        if (!request.user.avatar) {
            response.status(404).send()
        }

        request.user.avatar = undefined
        await request.user.save()
        response.send()
    } catch (error) {
        response.status(500).send()
    }
})

router.get('/:key/users/me/avatar', apiKey, auth, async (request, response) => {
    try {
        const user = await User.findById(request.user._id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        response.set('Content-Type', 'image/png')
        response.send(user.avatar)
    } catch (error) {
        response.status(404).send()
    }
})

router.get('/:key/users/:id/avatar', apiKey, async (request, response) => {
    try {
        const user = await User.findById(request.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        response.set('Content-Type', 'image/png')
        response.send(user.avatar)
    } catch (error) {
        response.status(404).send()
    }
})

module.exports = router