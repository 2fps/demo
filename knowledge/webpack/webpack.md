## webpack

### webpack和grunt和gulp有什么不同
1. grunt
grunt的出现早于gulp，他通过 JavaScript 语法实现了shell script 命令的一些功能。

2. gulp
gulp吸取了grunt的优点，拥有更简便的写法，通过流（Stream）的概念来简化多任务之间的配置和输出，让任务更加简洁和容易上手。
gulp可以进行js，html，css，img的压缩打包，是自动化构建工具，可以将多个js文件或是css压缩成一个文件，并且可以压缩为一行，以此来减少文件体积，加快请求速度和减少请求次数；并且gulp有task定义处理事务，从而构建整体流程，它是基于流的自动化构建工具。

3. webpack

webpack 是一个模块打包器，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
webpack更是强调模块化开发，他支持code-splitting、模块化(AMD，ESM，CommonJs)、全局分析。

4. 区别
两者功能略有有重叠
Grunt和Gulp属于任务流工具(Tast Runner)，而 webpack属于模块打包工具。

### bundle、chunk和module
bundle是由webpack打包出来的文件，chunk是指webpack在进行模块的依赖分析的时候，代码分割出来的代码块。module是开发中的单个模块。

### loader与plugin
loader是用来告诉webpack如何转化处理某一类型的文件，并且引入到打包出的文件中。  
plugin是用来自定义webpack打包过程的方式，一个插件是含有apply方法的一个对象，通过这个方法可以参与到整个webpack打包的各个流程(生命周期)。

### 长缓存优化
浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存储，但是每一次代码升级或是更新，都需要浏览器去下载新的代码，最方便和简单的更新方式就是引入新的文件名称。  

解决方法：
1. 提取第三方代码，用chunkhash替代hash，提取 webpack runtime。
2. 打包的包用namequ区分而不用id（NamedChunksPlugin、NamedModulesPlugin）。
3. 定义动态模块的chunkName。

### Tree-shaking
Tree-shaking能够在模块的层面上做到打包后的代码只包含被引用并被执行的模块，而不被引用或不被执行的模块被删除掉，以起到减包的效果。

注：要让 Tree Shaking 正常工作的前提是：提交给webpack的javascript代码必须采用了 ES6的模块化语法，因为ES6模块化语法是静态的(在导入，导出语句中的路径必须是静态的字符串)。
在webpack中Tree-shaking是通过uglifySPlugin来Tree-shaking JS。Css需要使用Purify-CSS。
使用webpack-deep-scope-plugin插件可以大量减少冗余文件。

### 如何提高webpack的构建速度
1. 开启node多线程，HappyPack插件。
2. 使用uglifyjs-webpack-plugin进行代码压缩，parallel（平行线程处理）和cache（缓存）参数。
3. 减少resolve，DevTool：去除sourcemap，cache-loader。
4. 利用DllPlugin和DllReferencePlugin预编译资源模块，通过DllPlugin来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过DllReferencePlugin将预编译的模块加载进来。
5. 使用Tree-shaking和Scope Hoisting来剔除多余代码
6. babel-loader开启缓存

### 常见的loader
+ file-loader：主要是用来处理图片文件的，他把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件。
+ url-loader：和 file-loader 类似，同样是处理图片文件的，但是可以设置limit将小于限制的图片存储为base64形式保存到代码中去。
+ babel-loader：把 ES6 转换成 ES5。
+ css-loader：加载css文件，支持模块化、压缩、文件导入等特性。
+ style-loader：把css代码以style标签的方式添加到页面中。
+ less-loader：用于加载less文件。
+ scss-loader：用于加载sass，scss文件。

### 常见的plugin
+ define-plugin：定义环境变量。
+ terser-webpack-plugin：压缩js代码插件。
+ html-webpack-plugin 为html文件中引入的外部资源，可以生成创建html入口文件
+ mini-css-extract-plugin：将CSS提取为独立的文件的插件，支持按需加载css和sourceMap。
+ clean-webpack-plugin：用于删除打包文件。
+ happypack：happyPack能使得webpack进行node多线程构建项目，从而提高构建速度。
+ webpack-hot-middleware：webpack-hot-middleware结合了webpack-dev-middleware，实现了浏览器无刷新更新。

### webpack构建流程
1. 初始化参数，从配置文件和shell语句中读到的参数合并，得到最后的参数
2. 开始编译：用合并得到的参数初始化complier对象，加载是所有配置的插件，执行run方法开始编译
3. 确定入口，通过entry找到入口文件
4. 编译模块，从入口文件出发，调用所有配置的loader对模块进行解析翻译，在找到该模块依赖的模块进行处理
5. 完成模块编译，得到每个模块被翻译之后的最终的内容和依赖关系
6. 输出资源，根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，在把每个chunk转换成一个单独的文件加载到输出列表
7. 输出完成，确定输出的路径和文件名，把内容写到文件系统中

### webpack热加载执行原理

###  如何利用webpack来优化前端性能
1. 压缩代码。uglifyJsPlugin 压缩js代码， mini-css-extract-plugin 压缩css代码
2. 利用CDN加速，将引用的静态资源修改为CDN上对应的路径，可以利用webpack对于output参数和loader的publicpath参数来修改资源路径
3. 删除死代码（tree shaking），css需要使用Purify-CSS
4. 提取公共代码。webpack4移除了CommonsChunkPlugin (提取公共代码)，用optimization.splitChunks和optimization.runtimeChunk来代替。

### webpack打包原理

### webpack的优势

### 是否写过Loader和Plugin？描述一下编写loader或plugin的思路？

### 怎么配置单页应用？怎么配置多页应用？

### loaders和plugin的加载顺序

### source map基本使用和原理