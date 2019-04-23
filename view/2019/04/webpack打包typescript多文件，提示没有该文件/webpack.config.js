const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('./package.json');

let config = {
    // 入口
    entry: path.resolve(__dirname, 'src/test.ts'),
    devtool: 'source-map',
    devServer: {
        contentBase: './src'
    },
    output: {
        // 输出文件名
        filename: 'test.js',
        // 输出路径
        path: path.resolve(__dirname, 'dist'),
        libraryExport: "default",
        library: "Test",
        libraryTarget: "umd"
    },
    module: {
        rules:[{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
    },
    plugins: [
    ],
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        // 开发模式下才要用到html
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/example.html'),
                filename: 'index.html'
            }
        ));
    }
    
    return config;
}