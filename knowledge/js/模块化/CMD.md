## CMD

```
define(function (require, exports, module) {
    var a = require('./a');
    a.doSomething();
    var b = require('./b');//依赖可以就近写
    b.doSomething();
});
```