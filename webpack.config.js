const webpack = require('webpack');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    index: './frontend/index.js',
    game: './frontend/game/main.js',
    mobile: './frontend/mobile/main.js'
  },
  output: {
    path: __dirname + '/static/dist',
      filename: '[name]-bundle.js'
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true,
  }
}