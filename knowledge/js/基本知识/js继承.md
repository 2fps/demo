## js继承

### 原型链继承
```
var Son = function () {

}
// 此处是prototype的覆盖
Son.prototype = new Far('hello');

var ss = new Son();
console.log(ss.showName());  // 'hello'
```
缺点：
+ 子类增加的原型方法必须在new 之后，否则会被prototype覆盖。
+ 不支持多继承。
+ 父类的引用类型的变量是共享的。
+ 创建子类时，无法向父类传递参数。

### 构造继承
```
var Son = function (name) {
    Far.call(this);
    this.name = name;
}

var ss = new Son('ko');
console.log(ss.name); // 'ko'
ss.showName();        // Uncaught TypeError: ss.showName is not a function
```
缺点：
+ 只能继承父类的属性和方法，不能继承父类原型的方法。
+ 无法实现函数的复用。

### 实例继承
```
var Son = function (name) {
   var instance = new Far();
   instance.name = name;

   return instance;
}

var ss = new Son('ko');
ss.showName();         // 'ko'
```
缺点：
+ 不支持多继承。
+ 实例实际上是父类的实例。

### 拷贝继承
```
var Son = function (name) {
    var instance = new Far();

    for (var i in instance) {
        Son.prototype[i] = instance[i];
    }
    Son.prototype.name = name;
}

var ss = new Son('ko');
ss.showName();            // 'ko'
```
缺点：
+ 比较浪费性能。
+ 无法获取父实例下的不可枚举的类型。

### 组合继承
```
var Son = function (name) {
    Far.call(this);

    this.name = name;
}
Son.prototype = new Far();
Son.prototype.constructor = Son;

var ss = new Son('ko');
ss.showName();  // 'ko'
```
该方法弥补了构造继承的缺陷，使得他既可以继承实例的属性和方法，也可以继承原型的属性和方法。  

缺点
+ 调用了两次父类的构造函数（实例将原型上的屏蔽了）。

### 寄生组合继承
通过寄生解决组合继承中实例两次的问题。
```
function inheritPrototype (subObj, superObj) {
    var proObj = Object.create(superObj.prototype); // 复制父类superObj的原型对象
    proObj.constructor = subObj;                    // constructor指向子类构造函数
    subObj.prototype = proObj;                      // 再把这个对象给子类的原型对象
}

var Son = function (name) {
    Far.call(this);

    this.name = name;
}

inheritPrototype(Son, Far);
var ss = new Son('ko');

ss.showName();    // 'ko'
```
其中Object.create()方法需要在IE9+的环境下，兼容的话，可以通过以下这种方式去兼容。  
```
function object(o){
    function F () {};
    F.prototype = o;
    return new F();
}
```
