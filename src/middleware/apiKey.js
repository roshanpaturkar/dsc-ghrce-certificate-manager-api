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
      data: {
        'projectRepository': process.env.npm_package_repository_url
      },
    };

    axios(config)
      .then(function (response) {
        request.key = response.data;
        next();
      })
      .catch(function (error) {
        console.log(error);
        return response.status(400).send(error.response.data);
      });
  } catch (error) {
    console.log(error);
    response.status(401).send({ error: "API Key is missing!" });
  }
};

module.exports = apiKey;
