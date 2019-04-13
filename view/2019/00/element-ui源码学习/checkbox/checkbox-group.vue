<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElCheckboxGroup',

    componentName: 'ElCheckboxGroup',

    mixins: [Emitter],

    inject: {
      elFormItem: {
        default: ''
      }
    },

    props: {
      value: {},            // 当前model值
      disabled: Boolean,    // 是否禁用
      min: Number,          // 勾选的checkbox的最小数量
      max: Number,          // 勾选的checkbox的最大数量
      size: String,         // checkbox-group整体大小
      fill: String,         // 按钮形式的 Checkbox 激活时的填充色和边框色
      textColor: String     // 按钮形式的 Checkbox 激活时的文本颜色
    },

    computed: {
      // formitem大小
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // group大小
      checkboxGroupSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      }
    },

    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    }
  };
</script>

<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
