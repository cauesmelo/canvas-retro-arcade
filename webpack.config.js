const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/js/index.js'),
  },
  devServer: {
    watchFiles: ['src/**/*'],
    static: ['src/img', 'src/css'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/pages/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/css' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|wav)$/,
        loader: 'file-loader',
      },
    ],
  },
  mode: 'none',
  stats: 'errors-only',
};
