## AMD
AMD(Asynchronous Module Definition)，异步模块定义。

实现AMD规范的又RequireJs
```
define(['./a', './b'], function (a, b) {//依赖必须一开始就写好
    a.doSomething();
    b.doSomething();
});
```