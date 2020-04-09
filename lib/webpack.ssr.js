const merge = require('webpack-merge');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    // 压缩css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),

    // 提取页面公共资源减小体积，如引入jquery,bootstrap等
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://unpkg.com/react@16/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
          global: 'ReactDom',
        },
      ],
    }),
  ],
  // 提取公共资源，切块，缓存组
  optimization: {
    splitChunks: {
      minSize: 30000, // 最小大小
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, devConfig);
