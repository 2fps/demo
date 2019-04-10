## 基于阿里云实现简单的语音识别功能(node版)

基于阿里云实现简单的语音识别功能，node版本。
详细说明的地址：[基于阿里云实现简单的语音识别功能](http://www.zhuyuntao.cn/2019/01/18/基于阿里云实现简单的语音识别功能/)。

## 环境启动

### 安装依赖
当前目录下：
```
npm ci (推荐) 或 npm i
```

### 启动服务器
当前目录下：
```
npm run start
```

### 浏览器访问
访问[http://127.0.0.1:8080](http://127.0.0.1:8080)。

### 注意
- 使用127.0.0.1或localhost尝试，因为getUserMedia在高版本的chrome下需要使用https。 
- 请自行添加阿里云的id和key。
- 该功能是阿里云一句话识别功能，不支持超过60s的语音。
- recorder.js来自[recorder](https://github.com/2fps/recorder)。