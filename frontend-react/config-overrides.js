const { injectBabelPlugin } = require('react-app-rewired');
const {
  override,
  addBabelPlugins,
} = require("customize-cra");
const APP = require('../settings/app.json');

const { ENDPOINT: { HOST, PORT, PROTOCOL } } = APP;

/* config-overrides.js */


const rootImport = ['root-import', {
  rootPathPrefix: '$',
  rootPathSuffix: './src',
}];


module.exports = {
  webpack: override(...addBabelPlugins('styled-jsx/babel', rootImport)),
};
