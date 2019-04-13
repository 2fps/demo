<template>
  <!-- radio-button组件整体 -->
  <!-- class还是通用的几个 active disabled focus -->
  <!-- 也可以通过space键选值 -->
  <label
    class="el-radio-button"
    :class="[
      size ? 'el-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <!-- 原生radio按钮 -->
    <!-- name控制radio的组，不能被tab键选中 -->
    <input
      class="el-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      tabindex="-1"
      @focus="focus = true"
      @blur="focus = false"
    >
    <!-- 实际的内容显示区域 -->
    <span
      class="el-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop>
      <!-- 组件标签之间的内容显示 -->
      <slot></slot>
      <!-- 组件标签没有内容则，直接显示该组件的label值 -->
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElRadioButton',
    // 混入广播事件
    mixins: [Emitter],

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      label: {},          // 当前组件对应的值
      disabled: Boolean,  // 是否禁用
      name: String        // 原生radio的name值，用于radio关联
    },
    data() {
      return {
        focus: false
      };
    },
    computed: {
      value: {
        get() {
          // 直接返回group的值
          return this._radioGroup.value;
        },
        set(value) {
          // 修改radio-group组件中的model值
          this._radioGroup.$emit('input', value);
        }
        // 也就是radio-button必须和radio-group组件配合使用，因为他没有对应的model值，
        // 他所使用的都是group的。
      },
      // 查找到对应父group组件
      _radioGroup() {
        let parent = this.$parent;
        // 循环向父级查找
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            // 返回对应的父组件引用
            return parent;
          }
        }
        return false;
      },
      activeStyle() {
        // 根据group的配置，来设置样式
        return {
          backgroundColor: this._radioGroup.fill || '',
          borderColor: this._radioGroup.fill || '',
          boxShadow: this._radioGroup.fill ? `-1px 0 0 0 ${this._radioGroup.fill}` : '',
          color: this._radioGroup.textColor || ''
        };
      },
      // form item的大小
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // 整体button大小
      size() {
        return this._radioGroup.radioGroupSize || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      // 是否禁用
      isDisabled() {
        // 优先级 本组件 > group > form
        return this.disabled || this._radioGroup.disabled || (this.elForm || {}).disabled;
      },
      // 设置tabindex的值
      tabIndex() {
        return !this.isDisabled ? (this._radioGroup ? (this.value === this.label ? 0 : -1) : 0) : -1;
      }
    },

    methods: {
      // 和radio一样
      handleChange() {
        this.$nextTick(() => {
          // 由于是radiobutton要和group一起使用，所以没有判断是否有group组件。
          this.dispatch('ElRadioGroup', 'handleChange', this.value);
        });
      }
    }
  };
</script>