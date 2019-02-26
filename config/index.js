// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  // 开发环境使用的配置
  build_dev: {
    // webpack的编译环境
    env: require('./prod_dev.env'),
    // 编译输入的index.html文件
    index: path.resolve(__dirname, '../dist/html/index.html'),
    // webpack输出的目标文件夹路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // webpack编译输出的二级文件夹
    assetsSubDirectory: 'zhipeicloudapp',
    // webpack编译输出的发布路径
    assetsPublicPath: '//app.cjmltest.cn/', //开发环境
    // 使用SourceMap
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 默认不打开开启gzip模式
    productionGzip: false,
    // gzip模式下需要压缩的文件的扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  // 测试环境使用的配置
  build_test: {
    // webpack的编译环境
    env: require('./prod_test.env'),
    // 编译输入的index.html文件
    index: path.resolve(__dirname, '../dist/html/index.html'),
    // webpack输出的目标文件夹路径
    assetsRoot: '//192.168.100.163/share/CJML/cjml-app-IntelliP-h5/测试包',
    // webpack编译输出的二级文件夹
    assetsSubDirectory: 'zhipeicloudapp',
    // webpack编译输出的发布路径
    assetsPublicPath: '//c1.testimg.cn/', //测试环境
    // 使用SourceMap
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 默认不打开开启gzip模式
    productionGzip: false,
    // gzip模式下需要压缩的文件的扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  // 公网环境使用的配置
  build_online: {
    // webpack的编译环境
    env: require('./prod_online.env'),
    // 编译输入的index.html文件
    index: path.resolve(__dirname, '../dist/html/index.html'),
    // webpack输出的目标文件夹路径
    assetsRoot: '//192.168.100.163/share/CJML/cjml-app-IntelliP-h5/线上包',
    // webpack编译输出的二级文件夹
    assetsSubDirectory: 'zhipeicloudapp',
    // webpack编译输出的发布路径
    assetsPublicPath: '//c1.zhipeicloud.com/', //公网环境
    // 使用SourceMap
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 默认不打开开启gzip模式
    productionGzip: false,
    // gzip模式下需要压缩的文件的扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  // 开发过程中使用的配置
  dev: {
    // webpack的编译环境
    env: require('./dev.env'),
    // dev-server监听的端口
    port: 65530,
    // 启动dev-server之后自动打开浏览器
    autoOpenBrowser: true,
    // webpack编译输出的二级文件夹
    assetsSubDirectory: 'static',
    // webpack编译输出的发布路径
    assetsPublicPath: '/',
    // 请求代理表，在这里可以配置特定的请求代理到对应的API接口
    // 例如将'/api/xxx'代理到'www.example.com/api/xxx'
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
