'use strict'
var utils = require('./utils')
var config = require('../config')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: function () {
      if (process.env.NODE_ENV === 'production_dev') return config.build_dev.productionSourceMap;
      if (process.env.NODE_ENV === 'production_test') return config.build_test.productionSourceMap;
      if (process.env.NODE_ENV === 'production_online') return config.build_online.productionSourceMap;
      return config.dev.cssSourceMap;
    }(),
    extract: function () {
      if (process.env.NODE_ENV === 'production_dev') return true;
      if (process.env.NODE_ENV === 'production_test') return true;
      if (process.env.NODE_ENV === 'production_online') return true;
      return false;
    }()
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
