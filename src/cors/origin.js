const { header } = require("express/lib/request")

var whitelist = ['https://dscghrcecertificates.web.app', '/\.example2\.com$/']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  header: 'Access-Control-Allow-Origin',
}

module.exports = corsOptions