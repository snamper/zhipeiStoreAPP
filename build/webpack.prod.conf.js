'use strict'
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 用于从webpack生成的bundle中提取文本到特定文件中的插件
// 可以抽取出css，js文件将其与webpack输出的bundle分离
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = function () {
  if (process.env.NODE_ENV === 'production_dev') return config.build_dev.env;
  if (process.env.NODE_ENV === 'production_test') return config.build_test.env;
  if (process.env.NODE_ENV === 'production_online') return config.build_online.env;
  return config.dev.env;
}();

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: function () {
        if (process.env.NODE_ENV === 'production_dev') return config.build_dev.productionSourceMap;
        if (process.env.NODE_ENV === 'production_test') return config.build_test.productionSourceMap;
        if (process.env.NODE_ENV === 'production_online') return config.build_online.productionSourceMap;
        return config.dev.productionSourceMap;
      }(),
      extract: true
    })
  },
  devtool: function () {
    if (process.env.NODE_ENV === 'production_dev') return config.build_dev.productionSourceMap;
    if (process.env.NODE_ENV === 'production_test') return config.build_test.productionSourceMap;
    if (process.env.NODE_ENV === 'production_online') return config.build_online.productionSourceMap;
    return config.dev.productionSourceMap;
  }() ? '#source-map' : false,
  output: {
    path: function () {
      if (process.env.NODE_ENV === 'production_dev') return config.build_dev.assetsRoot;
      if (process.env.NODE_ENV === 'production_test') return config.build_test.assetsRoot;
      if (process.env.NODE_ENV === 'production_online') return config.build_online.assetsRoot;
      return config.dev.assetsRoot;
    }(),
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        autoprefixer: {
          remove: false
        }
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    /*new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),修改:这一部分加了注释*/
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: function () {
        if (process.env.NODE_ENV === 'production_dev') return config.build_dev.assetsSubDirectory;
        if (process.env.NODE_ENV === 'production_test') return config.build_test.assetsSubDirectory;
        if (process.env.NODE_ENV === 'production_online') return config.build_online.assetsSubDirectory;
        return config.dev.assetsSubDirectory;
      }(),
      ignore: ['.*']
    }])
  ]
})

if (function () {
    if (process.env.NODE_ENV === 'production_dev') return config.build_dev.productionGzip;
    if (process.env.NODE_ENV === 'production_test') return config.build_test.productionGzip;
    if (process.env.NODE_ENV === 'production_online') return config.build_online.productionGzip;
    return config.dev.productionGzip;
  }()) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        function () {
          if (process.env.NODE_ENV === 'production_dev') return config.build_dev.productionGzipExtensions;
          if (process.env.NODE_ENV === 'production_test') return config.build_test.productionGzipExtensions;
          if (process.env.NODE_ENV === 'production_online') return config.build_online.productionGzipExtensions;
          return config.dev.productionGzipExtensions;
        }().join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (function () {
    if (process.env.NODE_ENV === 'production_dev') return config.build_dev.bundleAnalyzerReport;
    if (process.env.NODE_ENV === 'production_test') return config.build_test.bundleAnalyzerReport;
    if (process.env.NODE_ENV === 'production_online') return config.build_online.bundleAnalyzerReport;
    return config.dev.bundleAnalyzerReport;
  }()) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = webpackConfig
