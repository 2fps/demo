<template>
  <!-- radio元素整体，包含了radio后的内容显示区域，这样当点击内容时，radio就能被选中了 -->

  <!-- role，aria-checked，aria-disabled 用于无障碍阅读 -->
  <!-- tabindex设置大于等于0后，使用者可以通过tab键逐次遍历后面含tabindex或者表单元素，
       配合使用space键的keydown事件可以仅使用键盘来选中该radio。 -->
  <label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <!-- radio圆形按钮区域，dsDisabled控制了disabled状态下的样式，当选中值与本radio的值相同时，则显示checked的样式 -->
    <span class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    > 
      <!-- 页面上显示的radio按钮的实现主体，通过border-radius看上去变成了圆形，并设置了蓝色的背景色
           内部的白色小圆，是通过设置after伪元素，并利用transform和绝对定位使白底圆居中，使用scale实现动画。 -->
      <span class="el-radio__inner"></span>
      <!-- 真正的原生radio组件，将其绝对定位到对应的位置并在视觉上让使用者看不到，使用者点击时，和实际操作浏览器自带的radio没有太大的区别 -->
      <!-- 原生input的focus与blur事件，实时反馈给显示的radio按钮，并做调整 -->
      <!-- tabindex设置成-1后，通过tab键就无法选中该透明度是0的input元素 -->
      <input
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="el-radio__label" @keydown.stop>
      <!-- radio后内容显示区域 -->
      <slot></slot>
      <!-- 当使用el-radio组件时，没有实际的节点内容时，会默认显示该radio的value值 -->
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElRadio',
    // 混入broadcast和dispatch方法
    mixins: [Emitter],
    // 注入 elForm,elFormItem两个对象，用于disabled，size等值的判断    
    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },

    componentName: 'ElRadio',

    props: {
      value: {},              // 选中的radio的值(v-model的值)
      label: {},              // 本radio的value值
      disabled: Boolean,      // 是否禁用该radio
      name: String,           // 原生name属性，用于控制哪几个radio有关联
      border: Boolean,        // radio是否带外边框，使用者可以设置radio带边框这种风格
      size: String            // 整体控制radio大小 
    },

    data() {
      return {
        focus: false          // 是否有焦点
      };
    },
    computed: {
      // 判断是否是radio group
      isGroup() {
        let parent = this.$parent;
        // 遍历逐层查找父元素，当能找到父元素组件名是ElRadioGroup的，则返回true，否则false
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            // 逐层向上
            parent = parent.$parent;
          } else {
            // 若是radio group，保存group组件的引用
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },
      // 用代理的方式表示当前radio的值，因为当前值得获取和设置并不是一个属性可以直接表示的
      model: {
        // model的获取值，radio group时，则取group中的value，否则取当前radio的值
        get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        // 设置值
        set(val) {
          if (this.isGroup) {
            // group则，向上传播，触发input事件，修改group中的值
            this.dispatch('ElRadioGroup', 'input', [val]);
          } else {
            // 非group时，只要改本组件的model值
            this.$emit('input', val);
          }
        }
      },
      // formitem的大小
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // 确定radio的大小
      radioSize() {
        const temRadioSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        return this.isGroup
          ? this._radioGroup.radioGroupSize || temRadioSize
          : temRadioSize;
      },
      isDisabled() {
        // group > 本radio > form
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled;
      },
      // 设置对应的tabindex
      tabIndex() {
        // disabled为true时，全部都是设置为-1。
        // 为false时，非group时，全部是0，也就是可以被tab选中。当group时，选中的那个radio设置为0，其他的都是-1
        return !this.isDisabled ? (this.isGroup ? (this.model === this.label ? 0 : -1) : 0) : -1;
      }
    },

    methods: {
      // 当radio的值发生变化时触发
      handleChange() {
        this.$nextTick(() => {
          // 触发实例上的change事件，并将当前radio值作为参数
          this.$emit('change', this.model);
          // group的情况下，触发名为ElRadioGroup的父组件下的handleChange事件，也将当前选中值作为参数
          this.isGroup && this.dispatch('ElRadioGroup', 'handleChange', this.model);
        });
      }
    }
  };
</script>
