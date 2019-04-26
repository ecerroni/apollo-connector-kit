module.exports = {
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
