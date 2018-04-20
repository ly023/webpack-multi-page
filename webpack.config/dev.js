const webpack = require("webpack");
const path = require("path");

const webpackBase = require("./base");
const webpackMerge = require("webpack-merge");
const config = require("./config");

module.exports = webpackMerge(webpackBase, {
  mode: 'development',
  output:{
    filename:"[name].js",
    path: path.resolve(__dirname,"../dist"),
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: config.port,
    overlay: {    // 错误、警告页面展示设置
      errors: true,
      warnings: true
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
    new webpack.NamedModulesPlugin()
  ]

});
