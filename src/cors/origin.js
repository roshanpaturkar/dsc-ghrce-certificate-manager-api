var whitelist = ['https://dscghrcecertificates.web.app', ['/users/606618cf2e9642001526120c/avatar']]

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