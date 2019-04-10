## koa-unless增加method限制

koa-unless增加method限制
详细说明的地址：[koa-unless增加method限制](http://www.zhuyuntao.cn/2019/03/24/koa-unless增加method限制/)。

## 说明
github上的koa-unless项目不维护了，但该功能应该是比较常用的，故增加。

### 安装方法
找到项目中node_modules下koa-unless文件夹，重命名该文件为index.js，拷贝覆盖即可。

### 使用方法
```
const jwtKoa = require('koa-jwt');
const secret = 'jwt demo';

app.use(jwtKoa({secret}).unless({
    method: ['POST'],
    path: [/^\/api\/login/,
        {url: /^\/api\/publicKey/, method: ['GET']}]
}));
```
以上是，method表示总的支持的请求方式，path下是具体路径，path中的路径跟随method的优先级更高，
所以，以上login是post请求，publicKey是get请求。

注：与path同级的method不写，则所有method都支持。具体路径内的method不写，则跟随外层method。
