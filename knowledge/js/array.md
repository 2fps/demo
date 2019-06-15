## Array
js

1. 数组去重

```
// 方法一
var norepeat = funtion(arr){
    return arr.filter(function(val, index, array){
        return array.indexOf(val) === index;
    });
}
norepeat()

// 方法二
var set = new Set(arr);
```

2. 