# 关于后端的说明

## 概述

由于是第一次写Node.js后端，有些杂乱，望见谅。

后端采用了RESTful的架构风格，浏览器用GET命令请求资源，将得到服务器返回的JSON数据，这种AJAJ的数据交互方式可以利用jquery的`$.get`函数以及其他AJAX请求函数。

例子可以参见`public/js/index.js`下的代码片段：

```javascript
var poiData = null;
$.get('api/poi.json', function(data) {
    poiData = data;
});
```

这里是一种非阻塞的请求方式，`$`即jquery对象，其`get`函数接受两个参数，第一个参数是URI，第二个参数是请求结束时的回调函数。

## 基于技术

前端：

* jquery提供了很好的封装使代码更加简洁

  文档：http://api.jquery.com  http://www.w3school.com.cn/jquery

* Materialize是一个简单的Material风格的UI组件和样式库

  文档：http://materializecss.com

* Echarts，百度开发的可视化图表库

  文档：http://echarts.baidu.com/tutorial.html

* 高德地图API用于绘制

  文档：http://lbs.amap.com/api/javascript-api

后端：

* node.js

  文档：http://nodejs.cn


* express.js实现了简单的后端搭建

  文档：http://www.expressjs.com.cn

* jerzy，简易的数学统计库

  仓库：https://github.com/pieterprovoost/jerzy

关于前后端的代码风格，请注意：

* 前端代码仅使用ECMAScript 5的特性，未使用任何框架使得其代码没有任何预处理，裸跑在浏览器上。
* 后端代码大量使用了ECMAScript 6的特性

## 结构

项目根目录下的`app.js`是服务器代码，里面包含了路由。

`public`目录下是项目的前端页面，可以在域名下直接访问到。

```javascript
// Static pages
app.use(express.static('public'));
```

`api`目录下即项目的后端代码：

```
api
├── data_model.js
├── emotion_model.js
├── example_data
│   ├── PMV.json
│   └── PPD.json
├── request_handler.js
├── traffic_data
│   ├── avespeed0.json
│   ├── avespeed1.json
│   ├── avespeed2.json
│   ├── avespeed3.json
│   ├── avespeed4.json
│   ├── avespeed5.json
│   ├── avespeed6.json
│   ├── density0.json
│   ├── density1.json
│   ├── density2.json
│   ├── density3.json
│   ├── density4.json
│   ├── density5.json
│   ├── density6.json
│   └── poi_data.json
├── traffic_model.js
└── weather_data
    ├── humidity.json
    ├── pressure.json
    ├── sunlight.json
    ├── temperature.json
    └── wind.json
```

其中`request_handler.js`包含处理请求的函数，它将处理请求的函数导出，在`app.js`中通过路由向其中传递参数，并使其返回请求到的结果。

`data_model.js`处理文件IO并提供基础的数据查询功能，也包括天气扩展参数的计算（热舒适度PMV和PDD的计算）。`traffic_model.js`中计算交通数据，`emotion_model`给出情感数据的计算结果。

## API

非常简单的AJAJ、RESTful架构，通过URI直接请求到数据的JSON，路由可以参考`app.js`。

涉及的数据范围为2017年7月1日0时至2017年12月31日23时。

以下皆以运行在`localhost:8080`为例，在浏览器的地址栏输入即可得到返回的数据。

### 兴趣点（POI）

```
/api/poi
```

兴趣点是一个数组，其顺序也是其他数据数组的组织顺序。数组的每个元素都有若干键值对：

```
ID           // 数组下标
name         // POI名称
location     // 位置经纬度 [精度, 纬度]
address      // 地址
road_name    // 附近的街道
road_id      // 道路编号
road_level   // 道路等级 (4, 3, 2, 1, -1，其中4的道路等级最高，-1为无数据)
photos       // 照片URI数组
rating       // 地点评分
adcode       // 行政区编码（身份证前6位的编码）
ip           // 此处的IP地址
```

### 交通原始数据

交通原始统计数据包含城市中各POI处的速度和密度数据：

```
/api/traffic/:type/:weekday/:hour
```

其中`type`可以是`speed`或`density`分别对应平均车速和密度。星期`weekday`从周日(0)开始，到周六(6)，每天可以选取的时间`hour`范围为0—23。

例：

```
http://localhost:8080/api/traffic/speed/monday/0
```

或者带扩展名也是允许的：

```
http://localhost:8080/api/traffic/speed/monday/0.json
```

可以获得周一0时的平均速度分布，形式为数组，分别对应于各个POI。

### 天气数据

```
/api/weather/:type
```

例：

```
http://localhost:8080/api/weather/PMV.json
```

或者简单的形式：

```
http://localhost:8080/api/weather/pmv
```

都可以请求到从2017年7月1日0时到2017年12月31日23时每间隔1小时的PMV数据，PMV是一种热舒适度指数，定义可参见ISO 7730:2005 - Ergonomics of the thermal environment

参数`type`可以为`humidity`、`pressure`、`sunlight`、`temperature`、`windspeed`、`pmv`和`ppd`，分别为相对湿度（0—1）、大气压（mbar）、阳光（以云覆盖率估计，数值越大代表阳光越强）、温度（摄氏度）、风速（km/h）、PMV和PPD（一百人中热不舒适的比例，范围0—100）。

### 情感数据

```
/api/emotion/:type/:date/:hour
/api/emotion/:type/:index
```

在`date`日期`hour`小时的时候`type`情感的分布，返回的数据是一个数组，数组中的元素对应于POI的元素下标。或是另一种方式中用参数`index`来访问自2017年7月1日0时以来第`index`个小时的数据。

`type`可以为`positive`、`negative`和`tiredness`分别对应于正负性的两极和疲倦。

例：

```
http://localhost:8080/api/emotion/positive/2017-8-5/13.json
```

或者不带`.json`

```
http://localhost:8080/api/emotion/negative/2017-12-1/2
```

只要能让JavaScript正确地识别路径是一个日期就可以：

```
http://localhost:8080/api/emotion/tiredness/Sep_2,2017/16
```

按照小时编号访问（与天气数组中的下标对应）：

```
http://localhost:8080/api/emotion/positive/103
```

### 情感平均数据

可以获得类似于天气数据的情感数据时间序列，2017年7月1日0时到2017年12月31日23时每间隔1小时的数据结果。

```
/api/emotion/:type/weather
/api/emotion/:type/weather.json    // 同上
/api/emotion/:type/average
/api/emotion/:type/average.json    // 同上
```

`type`可以为`positive`、`negative`和`tiredness`分别对应于正负性的两极和疲倦。

例：

```
http://localhost:8080/api/emotion/negative/weather
```

```
http://localhost:8080/api/emotion/negative/average.json
```

