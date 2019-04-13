<template>
  <div
    class="el-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <!-- 显示内部的el-radio或el-radio-button -->
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';
  // 冻结keyCode数据，不让改动，存的是键盘上下左右的keyCode值
  const keyCode = Object.freeze({
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  });
  export default {
    name: 'ElRadioGroup',

    componentName: 'ElRadioGroup',
    // 注入form-item
    inject: {
      elFormItem: {
        default: ''
      }
    },
    // 混入了组件通信的方法
    mixins: [Emitter],

    props: {
      value: {},          // 当前组件的值（model）
      size: String,       // radioGroupSize使用，也是配合radio-button组件使用
      fill: String,       // 背景色，配合radio-button组件使用
      textColor: String,  // 文本颜色，即前景色，给radio-button组件使用
      disabled: Boolean   // 是否不可用
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // radio组大小，配合给radio-button组件时使用
      radioGroupSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      }
    },

    created() {
      // 绑定handleChange事件
      this.$on('handleChange', value => {
        // 触发实例上的change事件
        this.$emit('change', value);
      });
    },
    mounted() {
      // 选取当前group中所有的radio
      const radios = this.$el.querySelectorAll('[type=radio]');
      // 选取第一个radio（组件）
      const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
      if (![].some.call(radios, radio => radio.checked) && firstLabel) {
        // 当radioGroup没有默认选项时，第一个可以被Tab键选中
        firstLabel.tabIndex = 0;
      }
    },
    methods: {
      handleKeydown(e) { // 左右上下按键 可以在radio组内切换不同选项
        const target = e.target;
        // 
        const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
        const radios = this.$el.querySelectorAll(className);
        const length = radios.length;
        // radios是dom的集合，利用call来调用数组的indexOf方法
        const index = [].indexOf.call(radios, target);
        const roleRadios = this.$el.querySelectorAll('[role=radio]');
        switch (e.keyCode) {
          // 左和上按钮操作一致，
          case keyCode.LEFT:
          case keyCode.UP:
            e.stopPropagation();
            e.preventDefault();
            // 触发一个radio，当前是第一个时，则跳回最后一个
            if (index === 0) {
              roleRadios[length - 1].click();
              roleRadios[length - 1].focus();
            } else {
              roleRadios[index - 1].click();
              roleRadios[index - 1].focus();
            }
            break;
          case keyCode.RIGHT:
          case keyCode.DOWN:
            // 右和下操作一致
            if (index === (length - 1)) {
              // ？？？为啥在这，为啥向后点击时就不需要阻止默认和冒泡？
              e.stopPropagation();
              e.preventDefault();
              roleRadios[0].click();
              roleRadios[0].focus();
            } else {
              roleRadios[index + 1].click();
              roleRadios[index + 1].focus();
            }
            break;
          default:
            break;
        }
      }
    },
    watch: {
      value(value) {
        // radio-group的value值改变时，就向上传播el.form.change事件。
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
      }
    }
  };
</script>

