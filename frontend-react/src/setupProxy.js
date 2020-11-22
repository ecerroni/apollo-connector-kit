const proxy = require('http-proxy-middleware')

const APP = require('./settings/app.json')

const { ENDPOINT: { HOST, PORT, PROTOCOL } } = APP

module.exports = function(app) {
  app.use(proxy('/graphql', {
    'target': `${PROTOCOL}://${HOST}:${PORT}`,
    'ws': false,
  }))
}
