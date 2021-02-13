const axios = require('axios');

const apiKey = async (request, response, next) => {

    var config = {
        method: 'get',
        url: `${process.env.API_KEY}${request.params.key}`
    };

    axios(config)
    .then(function (response) {
        next()
    })
    .catch(function (error) {
        return response.status(error.response.status).send(error.response.data)
    });
}

module.exports = apiKey