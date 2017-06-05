/* eslint-disable import/no-extraneous-dependencies, global-require */
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { PrettierEslintPlugin } = require('prettier-eslint-webpack-plugin')

const eslintConfigFile = fs.readFileSync(path.resolve(__dirname, '.eslintrc'))
const eslintConfig = JSON.parse(eslintConfigFile)

const publicPath = '/'

module.exports = {
  devtool: 'eval',
  entry: {
    app: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      path.resolve(__dirname, 'client'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  devServer: {
    noInfo: false,
    publicPath,
    quiet: false,
    hot: true,
    stats: {
      assets: false,
      chunkModules: false,
      chunks: false,
      colors: true,
      hash: false,
      timings: false,
      version: false,
    },
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
    new PrettierEslintPlugin({ eslintConfig }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer'), // Automatically include vendor prefixes
                  require('postcss-nested'), // Enable nested rules, like in Sass
                ],
              },
            },
          ],
        }),
      },
    ],
  },
}
