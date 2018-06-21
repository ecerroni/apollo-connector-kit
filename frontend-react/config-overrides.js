const { injectBabelPlugin } = require('react-app-rewired');
const APP = require('../settings/app.json');

const { ENDPOINT: { HOST, PORT, PROTOCOL } } = APP;

/* config-overrides.js */


const rootImport = ['root-import', {
  rootPathPrefix: '$',
  rootPathSuffix: './src',
}];


module.exports = {
  webpack: function override(config, env) {
    config = injectBabelPlugin("styled-jsx/babel", config);
    config = injectBabelPlugin(rootImport, config);
    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.proxy.forEach(p => {
        if (p.target === 'graphql') {
          p.target = `${PROTOCOL}://${HOST}:${PORT}`;
        }
      });
      return config;
    };
  }
};
