## js原型与原型链

### prototype属性
JS所有的函数都有一个prototype属性(箭头函数除外)，这个属性引用（指向）了一个对象，即原型对象，也简称原型。

### constructor属性
这个属性指向的是构造函数。
比如： 
```
var obj = {};
obj.constructor;        // ƒ Object() { [native code] }
```
指向的是Object的构造函数。


### __proto__属性
__proto__属性指向函数对象的原型对象，实例化的对象也有这个属性。这个属性会一直继承自原始对象，直至最终的null。
标准中更推荐使用Object.getPrototypeOf()方法获取__proto__属性值。

注：
+ prototype属性可能会被重写，重写后，原来的constructor会发生改变。