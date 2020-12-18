const {
  override,
  addBabelPlugins,
  addPostcssPlugins,
} = require('customize-cra')

/* config-overrides.js */


const rootImport = ['root-import', {
  rootPathPrefix: '$',
  rootPathSuffix: './src',
}]


module.exports = {
  webpack: override(...addBabelPlugins(rootImport), addPostcssPlugins([require('tailwindcss'), require('autoprefixer')])),

}
