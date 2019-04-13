<template>
  <!-- 整个是封装在button之中 -->
  <button
    class="el-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <!-- loading的图标 -->
    <i class="el-icon-loading" v-if="loading"></i>
    <!-- 按钮图标 -->
    <i :class="icon" v-if="icon && !loading"></i>
    <!-- 给显示的内容增加个span，无内容时，则啥都不显示 -->
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: 'ElButton',

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      type: {               // 按钮类型
        type: String,
        default: 'default'
      },
      size: String,         // 按钮尺寸大小
      icon: {               // icon的class类
        type: String,
        default: ''
      },
      nativeType: {         // 原生 type 属性
        type: String,
        default: 'button'
      },
      loading: Boolean,     // 是否加载中状态
      disabled: Boolean,    // 是否禁用状态
      plain: Boolean,       // 是否朴素按钮
      autofocus: Boolean,   // 是否默认聚焦
      round: Boolean,       // 是否圆角按钮
      circle: Boolean       // 是否圆形按钮
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // button大小
      buttonSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      // 根据当前或者form的disabled状态确定button是否禁用
      buttonDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      }
    },

    methods: {
      handleClick(evt) {
        // 触发当前实例上的click事件
        // 比如我们外部使用时，可以直接增加click方法
        this.$emit('click', evt);
      }
    }
  };
</script>
