const { injectBabelPlugin } = require('react-app-rewired');

/* config-overrides.js */
module.exports = function override(config, env) {
  config = injectBabelPlugin("styled-jsx/babel", config);
  return config;
};