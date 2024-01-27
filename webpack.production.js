const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

const PATHS = {
  dist: path.join(__dirname, 'dist')
}

module.exports = () => merge(baseConfig, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    path: PATHS.dist
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                jsx: true,
                dynamicImport: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  refresh: false
                }
              }
            }
          }
        }
      },
    ],
  },
})
