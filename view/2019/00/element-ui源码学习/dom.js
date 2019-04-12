import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
// ie版本
const ieVersion = isServer ? 0 : Number(document.documentMode);

// 删除字符串前后空格
const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
// 中划线属性名、伪类、伪元素，转驼峰
const camelCase = function(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    // 第一个匹配上，offset是0，不会转大写，后面的要转大写 
    // -ms-abc要转成msAbc
    return offset ? letter.toUpperCase() : letter;
    // ff要特殊处理下，首字母要是大写的
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

// 客户端dom绑定事件
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        // 冒泡事件绑定
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

// 与on一样，只是改成了off
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

// 只触发一次事件
export const once = function(el, event, fn) {
  var listener = function() {
    // 触发完一次事件后就用off解除事件绑定
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  // 也是通过on绑定
  on(el, event, listener);
};

// 判断el是否有cls这个class
export function hasClass(el, cls) {
  // 参数检测
  if (!el || !cls) return false;
  // 只支持单class的检索
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  // 支持classList,则直接去判断
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    // 不支持的，直接取className用indexof去判断
    // 此处前后增加空格的原因是，例如
    // className中有一个aaa-bbb-ccc的class，而cls是aaa-bbb，若是不加空格的则会返回true了，而实际应该是false
    // 其实这儿也可以使用 el.className.split(' ').indexOf(cls) 这种方式去判断
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

// 给el元素增加cls的样式名
export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');
  // 先对el上原先的class转数组做处理
  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    // 异常处理
    if (!clsName) continue;
    // 支持addClass的,则直接使用classList自带的add方法
    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      // 提前判断是否有该class,防止多次添加
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    // 不支持classList的,将临时变量修改到className中去
    // 为啥不在else if中,个人猜这样的好处是，一次直接增加所有的样式，即使有重复的样式属性，也只用渲染一次，
    // 而如果在else if 中，则每次for循环都会有渲染。
    el.className = curClass;
  }
};

// 删除el元素的指定样式
export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;
    // 与add一样，直接优先从
    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      // 添加空格 replace
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    // 去空格后，修改className
    el.className = trim(curClass);
  }
};

// 获取计算后的样式，该两属性是只读属性
// vue都只支持ie9+了，还在兼容ie8-??
// 低版本的ie是用currentStyle 获取的
// 其他使用标准的getComputedStyle获取的
export const getStyle = ieVersion < 9 ? function(element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  // float属性需要特殊处理下，ie下是styleFloat，这块的话可以查看我的
  // http://www.zhuyuntao.cn/2016/09/11/原生js操作css样式/ 这篇
  if (styleName === 'float') {
    styleName = 'styleFloat';
  }
  try {
    switch (styleName) {
      // opacity属性在低版本ie下是对应的alpha属性，且之间是1:100的关系
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100;
        } catch (e) {
          return 1.0;
        }
      default:
        // 实际获取的是currentStyle的属性
        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
    }
  } catch (e) {
    // 异常则返回style属性
    return element.style[styleName];
  }
} 
// w3c下 使用getComputedStyle获取
: function(element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  // float在w3c下是cssFloat
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    // 通过getComputedStyle去获取对应的属性
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

// 设置样式，由于获取时是从只读属性中获取的，设置时，只是修改style行内样式的
// 所有是覆盖不了 css中的 important样式的，如何覆盖，请看
// http://www.zhuyuntao.cn/2017/10/18/笔记修改important的样式/
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    // 支持第二参数传对象的形式，key是属性名，value是属性值
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        // 循环styleName的自有属性，并递归调用setStyle
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    // 单个属性设置时
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      // 低版本的ie处理opacity时，需要转下属性
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      // 其他的直接赋值到style上就行了
      element.style[styleName] = value;
    }
  }
};
