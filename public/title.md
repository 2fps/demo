# demo  
个人博客的demo，以及其他情况下使用到demo  

## 目录

+ view，包含功能性的demo。
+ knowledge，搜集自己能想到的和看到的知识点。

## 使用方法

### 启动服务，查看demo

根目录下启动  
```
http-server ./  
```
为啥带 ./ ，我也不知道为啥根目录下启动http-server，他会默认到./public目录下，故带./当前目录。
访问对应端口即可查看demo。  

#### 独立server

文件夹内含package.json的都需要借助npm安装依赖和启动服务，请到对应的文件夹下处理。

### 重新编译
```
npm run build
```