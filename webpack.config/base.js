const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require("./config");
const root = path.resolve(__dirname, '..');

let HTMLPlugins = [];

// 入口文件集合
let Entries = {};

// 生成多页面的集合
config.HTMLDirs.forEach((page) => {
  const htmlPlugin = new HTMLWebpackPlugin({
    filename: `${page}.html`,
    template: path.resolve(__dirname, `../src/html/${page}.html`),
    chunks: [page, 'vendor', 'styles'],
    hash: true, // 防止缓存
  })
  HTMLPlugins.push(htmlPlugin);
  Entries[page] = path.resolve(__dirname, `../src/js/${page}.js`);
})

module.exports = {
  entry: Entries,
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        // 对 css 后缀名进行处理
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: 'images/[name].[ext]?[hash:8]'
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: "fonts/[name].[ext]?[hash:8]"
          }
        }
      },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },{
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  resolve: {
    alias: {
      assets: path.join(root, 'src/assets'),
      css: path.join(root, 'src/css'),
      js: path.join(root, 'src/js'),
      common: path.join(root, 'src/common'),
      components: path.join(root, 'src/components')
    },
    extensions: ['.js'] // 引用js文件可以省略后缀名
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    ...HTMLPlugins
  ],
}