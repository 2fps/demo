## BFC
BFC(Box Formatting Context)，块级格式化上下文。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

BFC是一个独立的渲染区域，只有block-level box参与，他自己规定内部的block-level box如何排列，并且不会影响外部的元素，当然，外部的元素也不会影响BFC中的元素。

### 布局规则
+ 内部的Box会在垂直方向，一个接一个地放置。
+ Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
+ 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
+ BFC的区域不会与float box叠加。
+ BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。
+ 当计算BFC的高度时，浮动元素也参与计算。

### BFC触发条件
+ 根元素
+ float属性不为none
+ position为absolute或fixed
+ display为inline-block, table-cell, table-caption, flex, inline-flex
+ overflow除了visible 以外的值（hidden，auto，scroll ）

### BFC应用
1. 两列布局
```
<style>
    *{padding:0px;margin:0px;}
    .left{float:left;width:200px;height:200px;background-color:#ccc;}
    .right{height:300px;background-color:olive;overflow:hidden;}
</style>

<div class="left"></div>
<div class="right"></div>
```

2. 处理垂直方向maring塌陷问题
```
<style>
    html{background-color:red;}
    .left{height:100px;margin-bottom:100px;background-color:#ccc;overflow:hidden;}
    .right{height:100px;margin-top:100px;background-color:olive;overflow:hidden;}
    .cont{overflow:hidden;}
</style>

<div class="left"></div>
<div class="cont">
    <div class="right"></div>
</div>
```

3. 清除浮动
```
<style>
    .box{background-color:#ccc;overflow:hidden;}
    .left{float:left;width:200px;height:100px;background-color:#abc;}
</style>

<div class="box">
    <div class="left"></div>
</div>
```