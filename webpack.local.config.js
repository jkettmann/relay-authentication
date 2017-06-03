var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: "eval",
  entry: {
    app: [
      "webpack/hot/dev-server",
      "webpack-hot-middleware/client",
      path.resolve(__dirname, "client")
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin("[name].css")
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [
                  require("autoprefixer"), // Automatically include vendor prefixes
                  require("postcss-nested") // Enable nested rules, like in Sass
                ]
              }
            }
          ]
        })
      }
    ]
  }
};
