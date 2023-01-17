const CracoLessPlugin = require('craco-less');
const { ProvidePlugin, DefinePlugin } = require('webpack');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: {
      optimization: {
        splitChunks: {
          chunks: 'async',
          maxSize: 5000000,
        },
      },
    },
    output: {
      filename: '[name].bundle.js',
    },
    // plugins: {
    //   add: [
    //     new ProvidePlugin({
    //       process: 'process/browser.js',
    //     }),
    //     new DefinePlugin({
    //       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    //     }),
    //   ],
    // },
  },
};
