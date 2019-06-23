const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口
    entry: path.resolve(__dirname, 'src/index.js'),
    devtool: 'source-map',
    devServer: {
        /* https: true,
        https: {
            key: fs.readFileSync('/path/to/server.key'),
            cert: fs.readFileSync('/path/to/server.crt'),
            ca: fs.readFileSync('/path/to/ca.pem'),
        }, */
        contentBase: './src'
    },
    output: {
        // 输出文件名
        filename: 'demo.js',
        // 输出路径
        path: path.resolve(__dirname, 'dist'),
        libraryExport: "default",
        library: "Demo",
        libraryTarget: "umd"
    },
    module: {
        unknownContextCritical : false,
        rules:[{
            test:/\.js$/,
            exclude:/node_modules/,//排除掉node_module目录
            use:{
                loader:'babel-loader',
                options:{
                    presets:['env'] //转码规则
                }
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            filename: 'index.html'
        })
    ]
};