const hasOwnProperty = Object.prototype.hasOwnProperty;

export function noop() {};

// 检测 obj 是否自带 key 属性
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};
// 遍历_from的参数，赋值到to上，注意引用问题
function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};
// 将arr（对象数组）中所有对象的属性取出存至新的对象中
export function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};
// 根据点运算符，按照对象的键值关系获取对应的值
// 如prop是a.c  则可以取到对象{a:{c:12}}中的值 12
export const getValueByPath = function(object, prop) {
  prop = prop || '';
  // split数组
  const paths = prop.split('.');
  let current = object;
  let result = null;
  // 循环数组取值
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;
    if (i === j - 1) {
      // 最后一步,取值
      result = current[path];
      break;
    }
    // 循环赋值
    current = current[path];
  }
  return result;
};

// 根据点或者数组的方式获取对象中的数据
export function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  // 将数组方式的取值改成以点的形式，如 a[b][c]，则变成了a.b.c
  // 也可以直接传a.b.c，不过此replace没有处理而已
  path = path.replace(/\[(\w+)\]/g, '.$1');
  // 将第一个是点的替换掉
  path = path.replace(/^\./, '');
  // 按点分割成数组
  let keyArr = path.split('.');
  let i = 0;
  // 循环向对象内部遍历
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      // 键值正确,继续向内部遍历
      tempObj = tempObj[key];
    } else {
      // 不正确退出
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  // 返回 o:遍历到的当前对象，k:key值，v:value值或null（没有的情况）
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
};

// 随机整数
export const generateId = function() {
  return Math.floor(Math.random() * 10000);
};
// 判断a与b是否全等，除了数组，数组内每项相同，也会返回true
export const valueEquals = (a, b) => {
  // 基本类型的，如数值，布尔值，字符串，undefined，null都返回 true
  // 引用类型的和NaN，通过
  if (a === b) return true;
  // NaN，以及除了数组之外的引用类型，都返回了false，只有a和b都是数组类型的通过
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  // 检测数组的长度，长度不等则数组不相等
  if (a.length !== b.length) return false;
  // 长度相同的a和b数组，循环匹配数组内的每项是否相等，不等则false
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
// 转义正则中用到的一些特殊字符
export const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

// ES6 array下的find和findArray两个接口的不支持实现方式 
export const arrayFindIndex = function(arr, pred) {
  for (let i = 0; i !== arr.length; ++i) {
    if (pred(arr[i])) {
      return i;
    }
  }
  return -1;
};
export const arrayFind = function(arr, pred) {
  const idx = arrayFindIndex(arr, pred);
  return idx !== -1 ? arr[idx] : undefined;
};

// coerce truthy value to array
// 将传入值转化成数组，分三种情况
export const coerceTruthyValueToArray = function(val) {
  if (Array.isArray(val)) {
    // 是数组的，直接返回
    return val;
  } else if (val) {
    // 是正值得，放入数组中返回
    return [val];
  } else {
    // 其他情况，直接返回空数组
    return [];
  }
};
