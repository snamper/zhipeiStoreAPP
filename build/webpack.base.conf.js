var path = require('path')
var utils = require('./utils')
var config = require('../config')
var webpack = require("webpack")
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  //entry: {
  //  app: './src/main.js'
  //},修改：这一部分注释
  entry: utils.getEntries('./src/module/**/*.js'), //修改后//入口文件
  output: {
    path: function () {
      if (process.env.NODE_ENV === 'production_dev') return config.build_dev.assetsRoot;
      if (process.env.NODE_ENV === 'production_test') return config.build_test.assetsRoot;
      if (process.env.NODE_ENV === 'production_online') return config.build_online.assetsRoot;
      return config.dev.assetsRoot;
    }(),
    filename: '[name].js',
    publicPath: function () {
      if (process.env.NODE_ENV === 'production_dev') return config.build_dev.assetsPublicPath;
      if (process.env.NODE_ENV === 'production_test') return config.build_test.assetsPublicPath;
      if (process.env.NODE_ENV === 'production_online') return config.build_online.assetsPublicPath;
      return config.dev.assetsPublicPath;
    }(),
    // chunkFilename: '[name].[chunkhash:3].js',
  }, //出口文件
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'jquery': 'jquery',

    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 500,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!stylus-loader',
        include: []
        //下面没include：属性
      }
    ]
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'jquery':'$'
  },

  plugins: [
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery",
    })
  ]
}


/*用于构建多页面*/
var pages = utils.getEntries('./src/module/**/*.html')
var HtmlWebpackPlugin = require('html-webpack-plugin')
for (var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: true,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));


}
