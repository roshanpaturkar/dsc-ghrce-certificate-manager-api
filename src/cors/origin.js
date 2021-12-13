const { header } = require("express/lib/request")

var whitelist = ['https://dscghrcecertificates.web.app', 'https://dscghrce-app-extensions.deta.dev']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions