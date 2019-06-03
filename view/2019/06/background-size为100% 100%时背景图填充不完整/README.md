## background-size为100% 100%时背景图填充不完整

background-size为100% 100%时背景图填充不完整
详细说明的地址：[background-size为100% 100%时背景图填充不完整](http://www.zhuyuntao.cn/2019/06/04/background-size为100% 100%时背景图填充不完整/)。

### 说明

#### 图片说明
111.png 10px * 10px  宽高1 : 1的图片
222.png 40px * 10px  宽高4 : 1的图片

#### 小数有间隙.html
当宽高是小数时，background-size为100% 100% 出现不完全覆盖的问题。
#### 整数无间隙.html
当宽高是整数时，background-size为100% 100% 不会出现不完全覆盖的问题。
#### 100%保持宽高比.html
background-size为100%时的真实含义。
#### 100%无间隙.html
当宽高是小数时，background-size为100% 不会出现不完全覆盖的问题。
#### contain.html
background-size为contain时的用法。
#### cover.html
background-size为cover时的用法。