const admin = async (request, response, next) => {
    try {
        if (!request.user.admin) { 
            throw new Error()
        }
        next()
    } catch (error) {
        response.status(401).send({ error: 'You don\'t have permission to perform this operation. Please contact admin.' })
    }
}

module.exports = admin