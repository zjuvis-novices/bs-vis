# 前端代码重构后的一些说明

异步调用在设计不当时会导致回调地狱，即回调套回调，关系难以理清。这里，在处理UI元素事件回调和异步数据加载的回调中引入如下机制：

## 动态的UI事件处理函数

对UI元素事件处理函数，我们使用了一个类似于**观察者模式**的机制，以实现事件处理函数行为的动态改变。

每个UI事件有关的开发增量发生之后，例如：

> 我之前仅仅是想在拖动滑块的时候改变A，现在我实现了B，并且希望拖动滑块能够改变B。

按照以往的方式，我们在实现B后，要改变拖动滑块事件的处理函数，让这个处理函数得以操作B。

这带来了什么问题呢？不好维护。我们在改变B代码的同时，也要改变滑块事件处理代码。这很容易导致混乱。

为解决这个问题，我们可以引入一个动态机制：让改变滑块的事件处理维护一个观察者列表，观察者可以将自己放到这个列表中，订阅事件；观察者也可以随时退出，不再接受滑块变化的通知。

在JavaScript中，我们可以用一个不那么面向对象的方式实现这点。

如下是拖动滑块的事件处理函数实现代码：

```javascript
var onTimeChangeCallbacks = {
    refreshTimeString: []
};
function onTimeChange() {
    currentHour = parseInt($('.hour').val());
    var callback;
    // Call all the associated callbacks
    for(callback in onTimeChangeCallbacks) {
        // Function call
        window[callback].apply(this, onTimeChangeCallbacks[callback]);
    }
}
```

我们定义了一个对象`onTimeChangeCallbacks`用以储存与事件相关联的回调函数名和参数表。用更加设计模式的话来说，它储存了观察者的指针（然而我们的这个JavaScript对象没有更加复杂的结构封装，不太面向对象。严格来说，对象的这些成员是观察者的更新回调指针）。

在事件处理函数中，我们遍历`onTimeChangeCallbacks`对象进行函数调用。

如果我们希望在这个事件处理函数中加入新功能，只需要向`onTimeChangeCallbacks`对象中加入新的成员就可以了。如果需要将某个功能从事件处理中移去，只需要将其从中删除即可。

例如：

```javascript
onTimeChangeCallbacks.refreshHourlyTemperature = [];
```

这条语句保证了在每次事件发生时，都会调用`refreshHourlyTemperature()`。

如果函数包含参数：

```javascript
onTimeChangeCallbacks.fooBar = [foo, bar];
```

即可以保证在事件发生时，`fooBar(foo, bar)`会被调用。

### 存在的问题

目前的设计没有做很好的封装，这带来了一个很大的局限性，即没有办法将对象中的成员函数绑定到这个回调列表中。下面的做法是不合法的：

```javascript
onTimeChangeCallbacks.foo.bar = [];
onTimeChangeCallbacks['foo.bar'] = [];
```

以上做法都不能保证`foo.bar()`被调用。

目前的解决方法只有：

```javascript
function fooBar() { return foo.bar(); }
onTimeChangeCallbacks.fooBar = [];
```

当函数`foo.bar`中不含有`this`指针时，下面的方法也是可行的（若含有，则`this`指针将绑定到全局对象上，对于浏览器中的JS引擎，也就是`window`对象。这会导致意外的行为）：

```javascript
var fooBar = foo.bar;
onTimeChangeCallbacks.fooBar = [];
```

## 利用promise实现请求回调的绑定

请参看：

* [使用 promises](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)
* [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [.promise() | jQuery](https://api.jquery.com/promise/)
* [jQuery.get() | jQuery](https://api.jquery.com/jQuery.get/)

在现在的代码中，我们使用了`get`函数的promise接口，它与jQuery的promise方法是一致的。