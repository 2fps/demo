<template>
  <!-- indeterminate与id后面有，其他属性的和radio类似，看命名也是可以看得通的 -->
  <label
    class="el-checkbox"
    :class="[
      border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed': isChecked"
    :aria-disabled="isDisabled"
    :id="id"
  >
    <span class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
       aria-checked="mixed"
    >
      <span class="el-checkbox__inner"></span>
      <!-- 选中与不选中有特别含义的 -->
      <input
        v-if="trueLabel || falseLabel"
        class="el-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
      <!-- 普通的，功能仅是true false的 -->
      <input
        v-else
        class="el-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <!-- checkbox的内容显示 -->
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElCheckbox',

    mixins: [Emitter],

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    componentName: 'ElCheckbox',

    data() {
      return {
        selfModel: false,         // 该组件的model值
        focus: false,             // 是否获取了焦点
        isLimitExceeded: false    // 判断是否超出设置的最大最小值
      };
    },

    computed: {
      // 本组件的值
      model: {
        get() {
          // 如果有checkbox group父组件，则直接使用store的值，否则
          // 若本组件的value(model)值不为undefined，则返回，否则返回selfModel
          return this.isGroup
            ? this.store : this.value !== undefined
              ? this.value : this.selfModel;
        },

        set(val) {
          if (this.isGroup) {
            // 当有group父级时，需要对值的范围做判断
            this.isLimitExceeded = false;
            // 当group有min值，且要set的值小于min时，将标志变量置为true
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (this.isLimitExceeded = true));

            // 当group有max值，且要set的值大于max时，将标志变量置为true
            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (this.isLimitExceeded = true));
            // 没有出现设置值超出时，触发修改checkboxgroup的model值
            this.isLimitExceeded === false &&
            this.dispatch('ElCheckboxGroup', 'input', [val]);
          } else {
            // 没group时，直接修改本组件的model值和selfModel值
            this.$emit('input', val);
            this.selfModel = val;
          }
        }
      },
      // 判断该checkbox是否已经被选中了
      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          // 如果是boolean类型的（checkbox的基本用法），直接返回就行
          return this.model;
        } else if (Array.isArray(this.model)) {
          // model是数组时，判断下当前组件的label值是否在已选择值之中
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          // 当trueLabel有自己的值时，需要与trueLabel校验
          return this.model === this.trueLabel;
        }
      },
      // 是否是group
      isGroup() {
        let parent = this.$parent;
        // 循环遍历父组件，查找ElCheckboxGroup
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            // 缓存父组件对象
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
      // 获取当前的value(model)值
      store() {
        // 当存在checkboxgroup时，则取group上的value值，否则则取checkbox上的值
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },

      // 判断是否是disabled
      isDisabled() {
        // disabled的优先级顺序，checkbox-group > 本身 > form
        // 为何三个 || 不能解决，因为_checkboxGroup可能为undefined，会报错
        return this.isGroup
          ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled;
      },
      // 获取formitem的大小
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // checkbox大小
      checkboxSize() {
        // 
        const temCheckboxSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        return this.isGroup
          ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
          : temCheckboxSize;
      }
    },

    props: {
      value: {},                // 当前checkbox选中的值
      label: {},                // 该checkbox的值
      indeterminate: Boolean,   // 设置 indeterminate 状态，只负责样式控制
      disabled: Boolean,        // 是否禁用
      checked: Boolean,         // 是否已经被选中
      name: String,             // 原生 name 属性,控制checkbox分组
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
      controls: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
      border: Boolean,          // 是否显示边框
      size: String              // 大小，尺寸，控制图标，文字大小
    },

    methods: {
      // 初始化，并保存到model
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          // model是数组，且不包含当前label值时，进行添加处理
          this.model.push(this.label);
        } else {
          // 直接修改
          this.model = this.trueLabel || true;
        }
      },
      // 处理checkbox
      handleChange(ev) {
        // 超出极值，不要处理
        if (this.isLimitExceeded) return;
        let value;
        // 当无trueLabel，falseLabel时，选中为true，否则false，有trueLabel或falseLabel值，则使用
        if (ev.target.checked) {
          value = this.trueLabel === undefined ? true : this.trueLabel;
        } else {
          value = this.falseLabel === undefined ? false : this.falseLabel;
        }
        // 触发实例上的change事件
        this.$emit('change', value, ev);
        this.$nextTick(() => {
          if (this.isGroup) {
            // 有checkbox-group时，触发对应父组件实例上的change事件
            this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
          }
        });
      }
    },

    created() {
      // 如果当前已经勾选了，则将存储
      this.checked && this.addToStore();
    },
    mounted() { // 为indeterminate元素 添加aria-controls 属性
      if (this.indeterminate) {
        this.$el.setAttribute('aria-controls', this.controls);
      }
    },

    watch: {
      value(value) {
        // 当前checkbox选中改变时，触发向上广播到formitem，触发el.form.change事件
        this.dispatch('ElFormItem', 'el.form.change', value);
      }
    }
  };
</script>
