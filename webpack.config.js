const path = require('path');
const webpack = require('webpack');
const OptimizeJsPlugin = require('optimize-js-plugin');
const autoprefixer = require('autoprefixer');

const ENV = process.env.NODE_ENV;

const webpackConfig = {
  context: `${__dirname}/app`,
  entry: {
    polyfills: './polyfills.ts',
    bundle: './main.ts',
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './public'),
    chunkFilename: '[id].chunk.js',
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular-router-loader?debug=false',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },
      {
        test: /\.scss$/,
        loaders: [
          'raw-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('autoprefixer')]
              }
            }
          }
        ],
      },
      {
        test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    // Fixes Angular 4 error
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      __dirname
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: module => /node_modules/.test(module.resource),
      chunks: [
        'bundle',
      ],
    }),
  ],
};

if (ENV === 'production') {
  console.log('Building for Production (minified build)');

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: true,
      },
      mangle: {
        keep_fnames: true,
      },
      comments: false,
      sourceMap: true,
    }),

    new OptimizeJsPlugin({
      sourceMap: false,
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: true,
      options: {

        /**
         * Html loader advanced options
         *
         * See: https://github.com/webpack/html-loader#advanced-options
         */
        // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
        htmlLoader: {
          minimize: true,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/],
          ],
          customAttrAssign: [/\)?\]?=/],
        },

      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(ENV),
      },
    }),
  ]);
} else {
  console.log('Building for Dev (non-minified build)');
}


module.exports = webpackConfig;