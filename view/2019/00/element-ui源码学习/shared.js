// 从名字上看是idDefined？判断是否定义？不定义当参数传入不就报错了么？
// 个人仅认为该函数是判断变量是否已经不是初始化，未使用的状态（为非空）
export function isDef(val) {
  // 不能为undefined且不能等于null
  return val !== undefined && val !== null;
}
// 应该是南北朝鲜，就是朝鲜和韩国的Unicode字符编码范围
export function isKorean(text) {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
  return reg.test(text);
}
