const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('./package.json');
const path = require('path');

let config = {
    // 入口
    entry: path.resolve(__dirname, 'src/index.ts'),
    devServer: {
        contentBase: './src'
    },
    output: {
        // 输出文件名
        filename: 'index.js',
        // 输出路径
        path: path.resolve(__dirname, 'dist'),
        libraryExport: "default",       // 不写的话，使用时要.default
        libraryTarget: 'window',
        library: 'A'
    },
    module: {
        rules:[{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        // 文件注释插件
        new webpack.BannerPlugin(`
${ package.name } - ${ package.description }

@version v${ package.version }
@homepage ${ package.homepage }
@author ${ package.author } <echoweb@126.com> (http://www.zhuyuntao.cn)
@license ${ package.license }
        `)
    ],
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        // 开发模式下才要用到html
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/index.html'),
                filename: 'index.html'
            }
        ));
    }
    
    return config;
};