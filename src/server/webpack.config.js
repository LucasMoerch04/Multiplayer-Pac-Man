const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

/** @type {import('webpack').Configuration} */
const config = {
  entry: "./src/client/main.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "./"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/index.html",
    }),
    new CopyPlugin({
      patterns: [
        // copy CSS to docs
        { from: "src/client/style.css", to: "style.css" },
        // copy all images and assets
        { from: "src/client/game-assets", to: "game-assets" },
      ],
    }),
  ],
  mode: "development",
};

module.exports = config;
