const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [
    // 开启热更新HMR
    new webpack.HotModuleReplacementPlugin(),
  ],
  // 热更新hmr
  devServer: {
    // 生成目录
    contentBase: './dist',
    hot: true,
    port: 9000,
    stats: 'errors-only',
  },
  devtool: 'source-map',
};

module.exports = merge(baseConfig, devConfig);
