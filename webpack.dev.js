const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

module.exports = () => merge(baseConfig, {
  mode: 'development',

  devtool: 'eval-source-map',

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
                  refresh: true
                }
              }
            }
          }
        }
      },
    ],
  },

  plugins: [
    new ReactRefreshWebpackPlugin({ esModule: true }),
    new ESLintPlugin(),
  ],

  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 8092,
    host: '0.0.0.0',
    allowedHosts: 'all',
    proxy: {
      '/session': {
        target: 'ws://beta.multitroid.com',
        // target: 'ws://localhost:32123',
        ws: true,
        headers: {
          'Host': 'beta.multitroid.com'
        }
      }
    }
  }
})
