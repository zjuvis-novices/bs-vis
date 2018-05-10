# 前端操作同步性的注释

有一些操作是同步的，一些操作是异步的。几乎所有的异步操作定义都在`data_handler.js`里面。

以下对象是jQuery `get`的返回对象，具有`promise`接口，并不是数据本身。需要访问数据要访问对象的`.responseJSON`成员。注意，只有在`get`请求结束之后，这个成员才能被访问到。

```javascript
// POI数据请求结果
poiData
// 逐小时气温数据请求结果
getTemperatureByHour
// 逐小时PPD数据请求结果
getPPDbyHour
```

如果需要添加操作完成之后的同步操作，请遵循以下方式：

```javascript
poiData = poiData.done(synchronizedOperation);
```

如果需要在异步操作完成之后做异步操作，请遵循以下方式：

```javascript
poiData = poiData.done(function () {
    asynchronizedOperation();
    ...
})
```

异步操作函数`updateVisualData`返回一个`promise`，这个函数的作用是刷新时空数据模型上的数据，使之与`currentDate`相匹配。它所做的事，就是在模型中储存的数据与`currentDate`不匹配的时候，向服务器请求数据，使之相匹配。返回的是所有请求都结束的`promise`。使用这个异步操作的方法，可以参见`map.js`中的代码片段：

```javascript
poiData.done(function () {
    updateVisualData().done(updateVisualDataBinding)
        .done(updateLayerVisibility);
})
```

仔细观察上面的语句，`poiData`是一个异步操作返回的保证（promise），`updateVisualData`是一系列异步操作的函数，`updateVisualDataBinding`和`updateLayerVisibility`是先后执行的两个同步操作。

这句话的意思就是，当POI数据异步加载完毕后，异步地更新当前可视化数据。当可视化数据加载完成后，先后执行两个同步操作：先更新可视化数据与可视化图层的绑定，再更新图层可见性。