const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpackBase = require("./base");
const webpackMerge = require("webpack-merge");

module.exports = webpackMerge(webpackBase,{
  mode: 'production',
  output:{
    filename:"js/[name].[chunkhash].js",
    path: path.resolve(__dirname,"../dist")
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    // 清除dist文件夹
    new CleanWebpackPlugin(
      ['dist/*'],　 //匹配删除的文件
      {
        root: path.resolve(__dirname, '..'),  //webpack.config的地址
        verbose: true,   //开启在控制台输出信息
        dry: false,   //启用删除文件
        exclude: ['files', 'to', 'ignore'],//排除不删除的目录，主要用于避免删除公用的文件
      }
    )
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer:  [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
    ],
    splitChunks:{
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'initial',  // merge all the css chunk to one file
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  }
});
