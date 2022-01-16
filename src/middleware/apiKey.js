const axios = require("axios");

const apiKey = async (request, response, next) => {
  return next(); // continue to next middleware
  try {
    const key = request.header("API-Key");

    if (!key) {
        throw new Error();
    }

    var config = {
      method: "post",
      url: `${process.env.API_KEY}${process.env.SERVER_ID}/${key}`,
      data: {
        method: Object.keys(request.route.methods)[0].toUpperCase(),
        endPoint: `https://dscghrce-certificates-prod.herokuapp.com${request._parsedUrl.path}`,
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
