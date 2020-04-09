
const path = require('path');
const glob = require('glob');
const autoPrefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// 引入package.json设置的浏览器群组
const { browserslist } = require('../package.json');

// 返回 Node.js 进程的当前工作目录
const projectRoot = process.cwd();
console.log(projectRoot) // eslint-disabled-line

const setMPA = () => {
  // 入口文件
  const entry = {};
  // 输出html文件
  const htmlWebpackPlugins = [];
  // 统一组织多页面应用入口文件组织方式，取出所有入口文件路径
  const entryFiles = glob.sync(path.join(projectRoot, 'src/*/index.jsx'));
  entryFiles.forEach((filePath) => {
    // 匹配入口文件index.jsx
    const match = filePath.match(/src\/(.*)\/index\.jsx/);
    // 获取入口key
    const pageName = match && match[1];
    if (pageName) {
      entry[pageName] = filePath;
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          // 生成html模板文件
          template: path.join(projectRoot, `src/${pageName}/index.ejs`),
          filename: `${pageName}.html`,
          // 指定生成的chunk key值（从而能将对应内容引入至生成的html文件中）
          chunks: ['vendors', 'default', pageName],
          inject: true, // 是否注入chunks
          minify: {
            html5: true, // html5语法
            collapseWhitespace: true, // 折叠空白
            preserveLineBreaks: false, // 保留换行
            minifyCSS: true, // 压缩css
            minifyJS: true, // 压缩js
            removeComments: false, // 移除html注释
          },
        }),
      );
    }
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      // 多个loader时从右往左链式调用
      {
        test: /\.(js|jsx)$/, use: [
          'babel-loader',
          // 'eslint-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          // 因style-loader与MiniCssExtractPlugin.loader相斥，故取其一
          // style-loader将css嵌入dom中
          // MiniCssExtractPlugin.loader将CSS提取到单独的文件中
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoPrefixer({
                  overrideBrowserslist: browserslist,
                })],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUni: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 因style-loader与MiniCssExtractPlugin.loader相斥，故取其一
          // style-loader将css嵌入dom中
          // MiniCssExtractPlugin.loader将CSS提取到单独的文件中
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          // 自动补全css3属性前缀以兼容指定浏览器
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoPrefixer({
                  overrideBrowserslist: browserslist,
                })],
            },
          },
          // 将px转换为rem以兼容移动端
          {
            loader: 'px2rem-loader',
            options: {
              remUni: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      // 图片loader
      {
        test: /\.(gif|png|jpg|jpeg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]',
          },
        }],
      },
      // {
      //     test: /\.(gif|png|jpg|jpeg)$/, use: [{
      //         loader: 'url-loader',
      //         options: {
      //             limit: 10240,// 小于10kb图片压缩成base64格式，可能等于？？？
      //         }
      //     }]
      // },
      // 字体文件loader
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    // 由于webpack4默认压缩js，故此处不用显式定义压缩js相关插件

    // 提取并合并所有css至一个文件中
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),

    // 自动生成html文件
    ...htmlWebpackPlugins,

    // 自动清理构建目录，每次构建时先清除生成目录下原来所有内容，此处相当于执行rm -rf dist
    new CleanWebpackPlugin(),

    // 优化构建时命令行输出
    new FriendlyErrorsWebpackPlugin(),

    // 手动抛出错误
    function () {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch' === -1)) {
          console.log('build error');
          process.exit(1);
        }
      });
    },
  ],
  stats: 'errors-only',
};
