const path = require('path');
const webpack = require('webpack');
const { getEntries } = require('./build_tools/getEntries');

module.exports = async (env, argv) => {
  const baseDir = path.resolve(__dirname, 'src');
  const entries = await getEntries(baseDir);

  return {
    entry: entries,
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            minChunks: 2
          },
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            enforce: true
          }
        }
      }
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      // 其他必要的插件...
    ],
    // 其他 webpack 配置...
  };
};