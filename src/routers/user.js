const express = require('express')
var cors = require('cors')
const origin = require('../cors/origin')
const multer = require('multer')
const sharp = require('sharp')

const apiKey = require('../middleware/apiKey')

const User = require('../models/user')
const auth = require('../middleware/auth')
const unavailable = require('../middleware/unavailable')
const admin = require('../middleware/admin')

const router = new express.Router()

router.post('/users', cors(origin), apiKey, unavailable, async (request, response) => {
    const user = new User(request.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({user, token})
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.get('/users', cors(origin), apiKey, auth, admin, async (request, response) => {
    try {
        const users = await User.find()
        response.send(users)
    } catch (error) {
        console.log(error)
        response.status(400).send(error)
    }
})

router.post('/users/disable/:id/:status', cors(origin), apiKey, auth, admin, async (request, response) => {
    try {
        const user = await User.findOne({_id: request.params.id})

        if (!user) {
            throw new Error()
        }

        if (user.admin) {
            return response.status(405).send({message: 'Your not allowed to disable the admin!'})
        }

        if (request.params.status === 'false') {
            user.disable = false
            user.tokens = []
            await user.save()
            return response.send({message: `${user.email} is enable.`})
        }
        user.disable = true
        await user.save()
        response.send({message: `${user.email} is disable.`})
    } catch (error) {
        console.log(error);
        response.status(400).send()
    }
})

router.post('/users/login', cors(origin), apiKey, async (request, response) => {
    try {
        const user = await User.findUserByCredentials(request.body.email, request.body.password)

        if (user.disable) {
            user.tokens = []
            await user.save()
            return response.status(403).send({message: `${user.email} is disable by the admin!`})
        }

        const token = await user.generateAuthToken()
        response.send({ user, token, key: request.key })
    } catch (error) {
        console.log(error);
        response.status(400).send()
    }
})

router.post('/users/logout', cors(origin), apiKey, auth, async (request, response) => {
    try {
        request.user.tokens = request.user.tokens.filter((token) => {
            return token.token !== request.token
        })

        await request.user.save()
        response.send()
    } catch (error) {
        console.log(error);
        response.status(500).send(error)
    }
})

router.post('/users/logoutAll', cors(origin), apiKey, auth, async (request, response) => {
    try {
        request.user.tokens = []
        await request.user.save()
        response.send()
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
})

router.get('/users/me', cors(origin), apiKey, auth, async (request, response) => {
    response.send({ user: request.user, key: request.key })
})

router.patch('/users/me', cors(origin), apiKey, auth, async (request, response) => {
    const updates = Object.keys(request.body)
    const allowedUpdates = ['name', 'mobile']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return response.status(400).send({
            error: 'Invalid updates! You can only change name and mobile!',
            message: 'If you want to change email or mobile number, please contact admin.'
        })
    }

    try {
        updates.forEach((update) => request.user[update] = request.body[update])
        await request.user.save()

        response.send(request.user)
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }
})

router.patch('/users/me/password', cors(origin), apiKey, auth, async (request, response) => {
    try {
        const {oldPassword, newPassword} = request.body
        const user = await User.findUserByCredentials(request.user.email, oldPassword)
        
        user.password = newPassword
        await user.save()

        response.send()
    } catch (error) {
        console.log(error);
        response.status(400).send(error)
    }    
})

router.delete('/users/me', cors(origin), apiKey, unavailable, auth, async (request, response) => {
    try {
        await request.user.remove()
        response.send(request.user)
    } catch (error) {
        console.log(error);
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

router.post('/users/me/avatar', cors(origin), apiKey, auth, upload.single('avatar'), async (request, response) => {
    try {
        const buffer = await sharp(request.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        request.user.avatar = buffer
    } catch (error) {
        console.log(error);
        return response.status(400).send({ error: 'Image data not found!'})
    }
    await request.user.save()
    response.send()
}, (error, request, response, next) => {
    console.log(error);
    response.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', cors(origin), apiKey, auth, async (request, response) => {
    try {

        if (!request.user.avatar) {
            return response.status(404).send()
        }

        request.user.avatar = undefined
        await request.user.save()
        response.send()
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
})

router.get('/users/me/avatar', cors(origin), apiKey, auth, async (request, response) => {
    try {
        const user = await User.findById(request.user._id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        response.set('Content-Type', 'image/png')
        response.send(user.avatar)
    } catch (error) {
        console.log(error);
        response.status(404).send()
    }
})

router.get('/users/:id/avatar', cors(), async (request, response) => {
    console.log(request);
    try {
        const user = await User.findById(request.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        response.set('Content-Type', 'image/png')
        response.send(user.avatar)
    } catch (error) {
        console.log(error);
        response.status(404).send()
    }
})

module.exports = router