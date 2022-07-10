const CracoLessPlugin = require('craco-less');
const path = require('path');
// const CracoAlias = require("craco-alias");
const { EnvironmentPlugin, ProvidePlugin, DefinePlugin } = require('webpack');
const childprocess = require('child_process');

const env = {
  ENV: process.env.ENV || 'development',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // VERSION: childprocess.execSync('git describe').toString().trim(),
  // BUILD: childprocess.execSync('git branch --show-current').toString().trim(),
};

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
    // {
    //     plugin: CracoAlias,
    //     options: {
    //         source: "tsconfig",
    //         // baseUrl SHOULD be specified
    //         // plugin does not take it from tsconfig
    //         baseUrl: "./src",
    //         // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
    //         tsConfigPath: "./tsconfig.extend.json"
    //     }
    // }
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
    plugins: {
      add: [
        // new EnvironmentPlugin(env),
        // new DefinePlugin({
        //   : { env: {} },
        // }),
      ],
    },
  },
};
