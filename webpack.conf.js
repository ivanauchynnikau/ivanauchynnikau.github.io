const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const { NODE_ENV } = process.env.NODE_ENV;

const pages = [
  'index',
];

const buildFolderName = 'build';

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: `./${buildFolderName}`,
  },
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, buildFolderName),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: NODE_ENV === 'production',
              },
            }, {
              loader: 'sass-loader',
            },
          ],
        }),
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(html)$/,
        include: path.join(__dirname, 'src/partials'),
        use: {
          loader: 'html-loader',
          options: {
            minimize: NODE_ENV === 'production',
            removeComments: NODE_ENV === 'production',
            collapseWhitespace: NODE_ENV === 'production',
          },
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'images/common/[name].[ext]',
          },
        }],
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
    $: 'jQuery',
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new ProgressBarPlugin(),
  ],
};

// add pages to webpack build
pages.forEach((pageName) => {
  module.exports.plugins.push(new HtmlWebpackPlugin({
    template: `src/pages/${pageName}.html`,
    filename: path.resolve(__dirname, `${buildFolderName}/${pageName}.html`),
    alwaysWriteToDisk: true,
    inlineSource: NODE_ENV === 'production' ? '.(css)$' : false,
  }));
});


switch (NODE_ENV) {
  // plugins for development mode
  case 'development':
    module.exports.plugins.push(
      new HtmlWebpackHarddiskPlugin(),
      new WebpackBuildNotifierPlugin({title: 'my CV'}),
      )
    break;

  case 'production':
    // plugins for production mode
    module.exports.plugins.push(
      new UglifyJSPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackInlineSourcePlugin(),
    );
    break;

  default:
    break;
}
