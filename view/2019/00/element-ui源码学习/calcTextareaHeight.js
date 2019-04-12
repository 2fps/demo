let hiddenTextarea;
// 为了让新增元素不被用户看到
// height为0，使后面的scrollHeight值能够取正确
const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;
// 要去获取的属性
const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
];

// 计算node的CONTEXT_STYLE中的属性，上下padding的大小，上下border的大小，box-sizing值
function calculateNodeStyling(targetElement) {
  // 获取计算后的样式
  const style = window.getComputedStyle(targetElement);
  // 获取box-sizing值
  const boxSizing = style.getPropertyValue('box-sizing');
  // 计算上下padding的大小
  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'))
  );
  // 计算上下border的大小
  const borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'))
  );
  // 按CONTEXT_STYLE数组中各项的指为key值，获取对应dom的计算后的属性的字符串
  const contextStyle = CONTEXT_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';');

  return { contextStyle, paddingSize, borderSize, boxSizing };
}

export default function calcTextareaHeight(
  targetElement,
  minRows = 1,
  maxRows = null
) {
  // 单例，只创建一个textarea
  if (!hiddenTextarea) {
    // 创建textarea节点并插入dom树中
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }

  let {
    paddingSize,
    borderSize,
    boxSizing,
    contextStyle
  } = calculateNodeStyling(targetElement);
  // 将要计算元素的有关高度影响的样式附加隐藏文字属性加到新增加的元素上，
  hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`);
  // 设置新textarea的内容
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';
  // 获取实际的文字内容高度
  let height = hiddenTextarea.scrollHeight;
  const result = {};
  // 根据boxSizing做调整，拿到实际赋值的height值
  if (boxSizing === 'border-box') {
    // 如果是border-box,原先height值是，height高度减上下border的大小
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize;
  }

  hiddenTextarea.value = '';
  // 减去 paddingSize 得到了真正的内容所占的高度
  let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

  if (minRows !== null) {
    let minHeight = singleRowHeight * minRows;
    if (boxSizing === 'border-box') {
      // minHeight 等于 内容 + 上下padding + 上下border
      minHeight = minHeight + paddingSize + borderSize;
    }
    // 高度更新为最大值
    height = Math.max(minHeight, height);
    // minHeight为最小值，
    result.minHeight = `${ minHeight }px`;
  }
  if (maxRows !== null) {
    let maxHeight = singleRowHeight * maxRows;
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize;
    }
    // 取max
    height = Math.min(maxHeight, height);
  }
  result.height = `${ height }px`;
  // 如果还在dom树中，就移除该节点
  hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
  // 不引用对应元素，让其被浏览器回收
  hiddenTextarea = null;
  return result;
};
