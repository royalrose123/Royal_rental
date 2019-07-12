var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        index : [ 
          './src/index.js',
          './src/firebase.js',
          './src/lib.js',
          './src/common.js',
          './src/login.js',
        ]
    },
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/'
      },
      resolve: {
        extensions: ['.js', '.jsx', '.scss', '.json', '.css'],
        alias: {
          src : path.resolve(__dirname, './src'),
        },
        modules: ['node_modules'],
      },
      module: {
        rules: [
          {
            test: /\.(png|jpg|svg)$/,
            use: [
              'file-loader'
            ]
          },
          { 
            test: /\.(js|jsx)$/, 
            exclude: /node_modules/, 
            use:  
            { 
              loader: "babel-loader",
              options: {
                presets: ['@babel/env'],
                plugins: [ 'transform-class-properties' ]
              }
            }
          },
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        ]
      },
      mode: 'production',
      plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({template: './index.html'})
      ],
};