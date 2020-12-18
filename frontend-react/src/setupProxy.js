const { createProxyMiddleware } = require('http-proxy-middleware')

const APP = require('./settings/app.json')
const { ENDPOINT: { HOST, PORT, PROTOCOL, GRAPHQL } } = APP

module.exports = function(app) {
  app.use(GRAPHQL, createProxyMiddleware({
    'target': `${PROTOCOL}://${HOST}:${PORT}`,
    'ws': false,
  }))
}
