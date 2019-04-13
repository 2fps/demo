function broadcast(componentName, eventName, params) {
  // 开始遍历子组件
  this.$children.forEach(child => {
    var name = child.$options.componentName;
    // 匹配子组件的name
    if (name === componentName) {
      // 匹配到时，子组件触发对应的事件
      // 匹配到一个就over了，该子元素的子元素就忽略了
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      // 继续查找该子组件的子元素
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;
      // 遍历父组件，查找并匹配name，直到找到对应的父组件或无
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          // 匹配到，则修改name，用于判断并推出循环
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        // 有对应的父组件，则去触发对应的事件
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      // 调用broadcast函数，需要纠正this，因为broadcast函数的this并不指向调用者
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
