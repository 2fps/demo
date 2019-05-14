## dom事件

### dom0级事件

绑定方式，以click事件为例子：
```
dom元素.onclick = function() {};
```
使用该方式需要注意：
1. 只能绑定一个事件，后面绑定的事件会覆盖掉前面的事件。
2. 回调方法内使用this时，指向不一样。
3. 解绑的话，重新赋值就行了。
4. 事件之前需要写 'on'

### dom1级事件

#### W3C标准
使用addEventListener/removeEventListener方法，以click为demo：
```
dom元素.addEventListener('click', function() {}, 是否冒泡(true/false))
```

#### 低版本IE事件


















































































