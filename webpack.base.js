const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()

const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {

  resolve: {
    extensions: ['.js', '.jsx']
  },

  entry: path.join(PATHS.src, 'main.js'),

  output: {
    publicPath: '/',
    filename: 'js/bundle.js',
    chunkFilename: 'js/[chunkhash].js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[id][ext][query]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]'
        }
      },
      {
        test: /\.(mp3|wav)$/,
        type: 'asset/resource',
        generator: {
          filename: 'audio/[name][ext][query]'
        }
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.src, 'index.html'),
      hash: true
    }),
    new webpack.DefinePlugin({
      __COMMIT_HASH__: JSON.stringify(commitHash),
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[fullhash].css',
      chunkFilename: 'styles/[fullhash].[chunkhash].css',
    }),
  ],

}
