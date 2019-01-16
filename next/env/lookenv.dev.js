var APP = require('../../settings/app.json');
module.exports = {
  SERVER_URI: {
    default: `${APP.ENDPOINT.PROTOCOL}://${APP.ENDPOINT.HOST}:${APP.ENDPOINT.PORT}`,
  },
  ACC: '1111',
};
