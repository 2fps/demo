<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    inputSize ? 'el-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend,
      'el-input--prefix': $slots.prefix || prefixIcon,
      'el-input--suffix': $slots.suffix || suffixIcon || clearable
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- 非 textarea，元素较多 -->
    <template v-if="type !== 'textarea'">
      <!-- 前置图标 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input整体，非textarea这种情况的 -->
      <!-- v-bind="$attrs" 是将没有父级传给本组件的，没有用到的属性传给后面的组件 -->
      <!-- autocomplete，原生属性，是否允许从之前输入过的值中过滤 -->
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$attrs"
        :type="type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        :value="currentValue"
        ref="input"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- 输入框内前置修饰的内容，绝对定位到input首部，input设置左padding，防止输入的内容与图标重合 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <!-- 输入框内前置修饰的文字 -->
        <slot name="prefix"></slot>
        <!-- 输入框内前置修饰的图标 -->
        <i class="el-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 输入框内后置内容 -->
      <span
        class="el-input__suffix"
        v-if="$slots.suffix || suffixIcon || showClear || validateState && needStatusIcon">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear">
            <!-- 输入框内后置修饰的文字 -->
            <slot name="suffix"></slot>
            <!-- 输入框内后置修饰的图标 -->
            <i class="el-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <!-- 输入验证提示图标 -->
          <i v-else
            class="el-input__icon el-icon-circle-close el-input__clear"
            @click="clear"
          ></i>
        </span>
        <!-- 验证提示图标 -->
        <i class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置图标 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <!-- type是textarea情况时 -->
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
      :value="currentValue"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
  </div>
</template>
<script>
  import emitter from 'element-ui/src/mixins/emitter';
  import Migrating from 'element-ui/src/mixins/migrating';
  import calcTextareaHeight from './calcTextareaHeight';
  // 对象拷贝
  import merge from 'element-ui/src/utils/merge';
  import { isKorean } from 'element-ui/src/utils/shared';

  export default {
    name: 'ElInput',

    componentName: 'ElInput',

    mixins: [emitter, Migrating],

    inheritAttrs: false,        // 和$attrs一起使用的

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    data() {
      return {
        currentValue: this.value === undefined || this.value === null
          ? ''
          : this.value,               // value不存在时置为空字符串，初始化时，处理些特殊值。内部的一个仅用于保存当前值的变量。
        textareaCalcStyle: {},        // 用于存放textarea计算style样式
        hovering: false,              // 鼠标是否悬浮在组件上方
        focused: false,               // 组件是否已经聚焦
        isOnComposition: false,       // 是否正在修改中
        valueBeforeComposition: null  // 使用输入法时，记录修改前的值
      };
    },

    props: {
      value: [String, Number],            // 初始时传入的值
      size: String,                       // 输入框尺寸，非textarea时生效
      resize: String,                     // 控制是否能被用户缩放
      form: String,
      disabled: Boolean,                  // 组件是否禁用
      readonly: Boolean,                  // 组件是否只读，原生属性
      type: {                             // input的类型（可能是textarea）
        type: String,
        default: 'text'
      },
      autosize: {                         // 自适应内容高度，当是 textarea 时，可传入对象，如{ minRows: 2, maxRows: 6 }
        type: [Boolean, Object],          // 表示textarea可拖动的最大最小范围
        default: false
      },
      autocomplete: {                     // 原生属性，自动补全
        type: String,
        default: 'off'
      },
      /** @Deprecated in next major version */
      // autoComplete要被弃用，用autocomplete替代
      autoComplete: {                     // 原生属性，自动补全，但此属性要被替换，用 autocomplete 代替他
        type: String,
        validator(val) {
          process.env.NODE_ENV !== 'production' &&
            console.warn('[Element Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.');
          return true;
        }
      },
      validateEvent: {                    // 输入时是否触发表单的校验
        type: Boolean,
        default: true
      },
      suffixIcon: String,                 // 输入框头部图标
      prefixIcon: String,                 // 输入框尾部图标
      label: String,                      // 输入框关联的label文字
      clearable: {                        // 是否可清空
        type: Boolean,
        default: false
      },
      tabindex: String                    // 输入框的tabindex，原生属性
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // item-form组件的validate状态，该值保存了当前item是否验证正确，用于修改本组件内的icon样式
      validateState() {
        return this.elFormItem ? this.elFormItem.validateState : '';
      },
      // 是否要显示状态的图标
      needStatusIcon() {
        return this.elForm ? this.elForm.statusIcon : false;
      },
      // 输入验证，提示图标样式
      validateIcon() {
        return {
          validating: 'el-icon-loading',
          success: 'el-icon-circle-check',
          error: 'el-icon-circle-close'
        }[this.validateState];
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      },
      // input组件的大小
      inputSize() {
        // 优先级 本生 > formitem
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      // input组件是否是disabled状态
      inputDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
      // 是否显示清空输入框的叉叉按钮
      showClear() {
        // 判断条件比较多
        // 首先要支持显示，不是只读和禁用状态，当前值不能是空的,并且当前已经聚焦或者处于鼠标悬浮状态
        return this.clearable &&
          !this.disabled &&
          !this.readonly &&
          this.currentValue !== '' &&
          (this.focused || this.hovering);
      }
    },

    watch: {
      // 监听value变化，触发修改currentvalue和model值
      value(val, oldValue) {
        this.setCurrentValue(val);
      }
    },

    methods: {
      // 聚焦表单输入元素
      focus() {
        (this.$refs.input || this.$refs.textarea).focus();
      },
      // 表单输入元素失焦
      blur() {
        (this.$refs.input || this.$refs.textarea).blur();
      },
      // 提示迁移的属性
      getMigratingConfig() {
        return {
          props: {
            'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
            'on-icon-click': 'on-icon-click is removed.'
          },
          events: {
            'click': 'click is removed.'
          }
        };
      },
      // 元素失焦处理函数
      handleBlur(event) {
        // 重置状态
        this.focused = false;
        // 触发实例上的blur事件
        this.$emit('blur', event);
        // 
        if (this.validateEvent) {
          // 触发父组件上的el.form.blur事件
          this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
        }
      },
      select() {
        // 选中对应的输入元素，会触发元素上的focus事件
        (this.$refs.input || this.$refs.textarea).select();
      },
      // 重新刷新 textarea ，重新计算样式
      resizeTextarea() {
        if (this.$isServer) return;
        const { autosize, type } = this;
        if (type !== 'textarea') return;
        if (!autosize) {
          this.textareaCalcStyle = {
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          };
          return;
        }
        // 设置过autosize的，需要独立去计算，直接作用到style上
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      // focus时的处理函数
      handleFocus(event) {
        // 重置状态
        this.focused = true;
        // 触发实例上的focus事件
        this.$emit('focus', event);
      },
      // 处理composition*系列的事
      handleComposition(event) {
        if (event.type === 'compositionend') {
          // 输入法结束，重装composition状态
          this.isOnComposition = false;
          // 保存currentValue
          this.currentValue = this.valueBeforeComposition;
          this.valueBeforeComposition = null;
          // 触发input修改
          this.handleInput(event);
        } else {
          // 输入法修改中
          const text = event.target.value;
          // 获取最后一个字符
          const lastCharacter = text[text.length - 1] || '';
          // 当是korean字体时，将状态（isOnComposition）置为false，实际在输入中
          this.isOnComposition = !isKorean(lastCharacter);
          if (this.isOnComposition && event.type === 'compositionstart') {
            // 刚开始输入时，提前保存输入法启动前的值
            this.valueBeforeComposition = text;
          }
        }
      },
      // 修改value值，直接的键盘输入（非输入法），会直接触发 handleInput 函数
      // 如果是输入法输入，将会在composition**之后才触发 handleInput 函数
      handleInput(event) {
        const value = event.target.value;
        this.setCurrentValue(value);
        // 正在修改输入法时，不去处理
        if (this.isOnComposition) return;
        // 修改组件的model值
        this.$emit('input', value);
      },
      handleChange(event) {
        // 触发实例的change事件
        this.$emit('change', event.target.value);
      },
      // 修改 currentValue
      setCurrentValue(value) {
        // 编辑中并且当前值与修改值没有变化（输入法输入后，没确认，又删除了），不做处理
        if (this.isOnComposition && value === this.valueBeforeComposition) return;
        this.currentValue = value;
        // 正在编辑中
        if (this.isOnComposition) return;
        // 第一次由handleInput函数调入，此时value值（model）未修改，所以使用了nextTick处理
        // 第二次进入是因为watch了value的变化，此时value与currentValue相同，会触发后面的dispatch
        this.$nextTick(this.resizeTextarea);
        if (this.validateEvent && this.currentValue === this.value) {
          // 触发
          this.dispatch('ElFormItem', 'el.form.change', [value]);
        }
      },
      // 计算图标偏移量
      calcIconOffset(place) {
        // 将nodeList转换成数组类型
        let elList = [].slice.call(this.$el.querySelectorAll(`.el-input__${place}`) || []);
        // 空数组不去处理
        if (!elList.length) return;
        let el = null;
        // 过滤无效的，看了，似乎没啥用，因为elList选出的元素的parentNode都是组件本身
        for (let i = 0; i < elList.length; i++) {
          if (elList[i].parentNode === this.$el) {
            el = elList[i];
            break;
          }
        }
        if (!el) return;
        const pendantMap = {
          suffix: 'append',
          prefix: 'prepend'
        };

        const pendant = pendantMap[place];
        if (this.$slots[pendant]) {
          // 当存在输入框外部的前后元素时，需要计算输入框内图标与文字的位置，并用translate动画加以移动开
          // 个人感觉在这是不是可以重新计算下输入框的右padding值，使得输入框内的文字不会与输入内容重合
          el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)`;
        } else {
          // 删除增加过的style样式
          el.removeAttribute('style');
        }
      },
      // 更新图标偏移量
      updateIconOffset() {
        // 计算 prefix 图标
        this.calcIconOffset('prefix');
        // 计算 suffix 图标
        this.calcIconOffset('suffix');
      },
      // 清空
      clear() {
        // 设置组件value值为空
        this.$emit('input', '');
        // 触发实例上的change事件
        this.$emit('change', '');
        // 触发实例上的clear事件
        this.$emit('clear');
        // 清空输入框中的值，置为空字符串
        this.setCurrentValue('');
        this.focus();
      }
    },

    created() {
      // 绑定inputSelect事件
      this.$on('inputSelect', this.select);
    },

    mounted() {
      this.resizeTextarea();
      this.updateIconOffset();
    },

    updated() {
      this.$nextTick(this.updateIconOffset);
    }
  };
</script>
