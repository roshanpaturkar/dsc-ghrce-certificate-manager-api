const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (request, response, next) => {
    try {
        console.log(request.header('Authorization'));
        const token = request.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        console.log(request.header('Authorization'));
        console.log(token);
        console.log(user);

        if (!user) {
            throw new Error()
        }

        request.token = token
        request.user = user
        next()
    } catch (error) {
        console.log(error);
        response.status(200).send({error: 'Please authenticate.'})
    }
}

module.exports = auth