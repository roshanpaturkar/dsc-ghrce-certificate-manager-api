const { request, response } = require("express");

const unavailable = (request, response, next) => {
    try {
        if (process.env.UNAVAILABLE === 'true') {
            throw new Error()
        }
        next()
    } catch (error) {
        response.status(503).send({ error: "This service is currently not available. Please contact admin." })
    }
}

module.exports = unavailable