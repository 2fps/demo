<template>
  <!-- 开关整体，样式只有disabled禁用和checked选中，两种状态 -->
  <!-- 并添加了switchValue这个click处理事件 -->
  <div
    class="el-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click="switchValue"
  >
    <!-- 内部是一个原生的checkbox，绑定了change和回车的keydown事件 -->
    <input
      class="el-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    >
    <!-- switch关闭的时候显示的内容 -->
    <span
      :class="['el-switch__label', 'el-switch__label--left', !checked ? 'is-active' : '']"
      v-if="inactiveIconClass || inactiveText">
      <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
    </span>
    <!-- 界面上开关的实现 -->
    <!-- 底部是span，其中的白色滑块是利用after实现的 -->
    <span class="el-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
    </span>
    <!-- switch开启的时候显示的内容 -->
    <span
      :class="['el-switch__label', 'el-switch__label--right', checked ? 'is-active' : '']"
      v-if="activeIconClass || activeText">
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
<script>
  import Focus from 'element-ui/src/mixins/focus';
  import Migrating from 'element-ui/src/mixins/migrating';

  export default {
    name: 'ElSwitch',
    mixins: [Focus('input'), Migrating],
    inject: {
      elForm: {
        default: ''
      }
    },
    props: {
      value: {
        type: [Boolean, String, Number],
        default: false
      },
      disabled: {         // 是否禁用
        type: Boolean,
        default: false
      },
      width: {        // 滑块的宽度
        type: Number,
        default: 40
      },
      activeIconClass: {    // switch 打开时所显示图标的类名，设置此项会忽略 active-text
        type: String,
        default: ''
      },
      inactiveIconClass: {    // switch 关闭时所显示图标的类名，设置此项会忽略 inactive-text
        type: String,
        default: ''
      },
      activeText: String,     // switch 打开时的文字描述
      inactiveText: String,   // switch 关闭时的文字描述
      activeColor: {          // switch 打开时的背景色
        type: String,
        default: ''
      },
      inactiveColor: {        // switch 关闭时的背景色
        type: String,
        default: ''
      },
      activeValue: {          // switch 打开时的值
        type: [Boolean, String, Number],
        default: true
      },
      inactiveValue: {        // switch 关闭时的值
        type: [Boolean, String, Number],
        default: false
      },
      name: {               // 原生input 对应的 name 属性
        type: String,
        default: ''
      },
      id: String      // 原生的id
    },
    data() {
      return {
        coreWidth: this.width     // switch宽度
      };
    },
    created() {
      // ~x 相当于 x+1, 由于indexOf是-1时，表示没匹配上，即false
      // 所以 if (~x) 表示匹配成功后，此处取反
      if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
        // value不是两种值时，默认赋值关闭情况下的值
        this.$emit('input', this.inactiveValue);
      }
    },
    computed: {
      // 是否选中
      checked() {
        // 当前选中的值与打开值相等时，表示选中了
        return this.value === this.activeValue;
      },
      // 该组件是否禁用
      switchDisabled() {
        // 判断优先级: 本身 > form
        return this.disabled || (this.elForm || {}).disabled;
      }
    },
    watch: {
      // 监听选中状态
      checked() {
        // 先修改原生checkbox的checked值
        this.$refs.input.checked = this.checked;
        // 是否有开启和关闭对应的颜色
        if (this.activeColor || this.inactiveColor) {
          // 设置背景色
          this.setBackgroundColor();
        }
      }
    },
    methods: {
      // 处理switch值变化的函数
      handleChange(event) {
        // 修改model的值
        // 取反却取active值，因为由于当前的值还是前一次的，所以修改
        this.$emit('input', !this.checked ? this.activeValue : this.inactiveValue);
        // 触发change事件
        this.$emit('change', !this.checked ? this.activeValue : this.inactiveValue);
        this.$nextTick(() => {
          // set input's checked property
          // in case parent refuses to change component's value
          this.$refs.input.checked = this.checked;
        });
      },
      // 设置颜色
      setBackgroundColor() {
        let newColor = this.checked ? this.activeColor : this.inactiveColor;
        // 设置前景色和背景色
        this.$refs.core.style.borderColor = newColor;
        this.$refs.core.style.backgroundColor = newColor;
      },
      // 切换switch的值（打开或关闭switch）
      switchValue() {
        !this.switchDisabled && this.handleChange();
      },
      getMigratingConfig() {
        // 迁移的属性和方法，用于提示
        return {
          props: {
            'on-color': 'on-color is renamed to active-color.',
            'off-color': 'off-color is renamed to inactive-color.',
            'on-text': 'on-text is renamed to active-text.',
            'off-text': 'off-text is renamed to inactive-text.',
            'on-value': 'on-value is renamed to active-value.',
            'off-value': 'off-value is renamed to inactive-value.',
            'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
            'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.'
          }
        };
      }
    },
    mounted() {
      /* istanbul ignore if */
      this.coreWidth = this.width || 40;
      // 颜色加载
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }
      // 修改checkbox的值，与计算的一致
      this.$refs.input.checked = this.checked;
    }
  };
</script>
