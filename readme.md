# CitySpam
## 基于

前端：jquery, Materialize

地图：高德地图API

图表可视化：echart

后端：node.js, express

## 运行

安装 Node

```
sudo apt install node
```

安装 npm

```
sudo apt install npm
```

安装 express

```
npm install express -g
```

运行服务器 http://localhost:8080

```
node app.js
```

## 项目结构说明

`app.js`创建服务器、做路由。

`api`目录下是后端代码，基于express，主要处理数据和相应请求。

`public`目录下是前端代码，公开的资源。