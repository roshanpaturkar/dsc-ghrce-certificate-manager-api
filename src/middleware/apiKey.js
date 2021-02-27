const axios = require("axios");

const apiKey = async (request, response, next) => {
  try {
    const key = request.header("API-Key");

    if (!key) {
        throw new Error();
    }

    var config = {
      method: "get",
      url: `${process.env.API_KEY}${key}`,
    };

    axios(config)
      .then(function (response) {
        request.key = response.data;
        next();
      })
      .catch(function (error) {
        return response.status(error.response.status).send(error.response.data);
      });
  } catch (error) {
    response.status(401).send({ error: "API Key is missing!" });
  }
};

module.exports = apiKey;
