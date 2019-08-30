module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
  configureWebpack: {
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  devServer: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:3000/graphql',
        changeOrigin: false,
      }
    },
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  }
}
