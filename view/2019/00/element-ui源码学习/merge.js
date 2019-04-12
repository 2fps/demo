// merge拷贝函数，将target之后的属性按键值赋值到target下
// 若该参数在target中，则会被覆盖
// 是浅拷贝，注意引用关系
export default function(target) {
  // 从target之后开始遍历参数
  for (let i = 1, j = arguments.length; i < j; i++) {
    // 检测参数，排除false类（undefined等）的参数
    let source = arguments[i] || {};
    // 遍历循环参数
    for (let prop in source) {
      // in会遍历原型上的属性，用hasOwnProperty确定是source自己的属性
      if (source.hasOwnProperty(prop)) {
        let value = source[prop];
        // 若是source自己属性，且不是undefined，则添加到target的prop的属性下
        if (value !== undefined) {    // 仅判断自身，注意被覆盖的问题
          target[prop] = value;       // 没有继续遍历value的层级，当对象时，会有引用关系
        }
      }
    }
  }

  return target;
};
