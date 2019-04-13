<template>
  <transition name="el-alert-fade">
    <!-- alert组件，整体颜色,是否居中 -->
    <div
      class="el-alert"
      :class="[typeClass, center ? 'is-center' : '']"
      v-show="visible"
      role="alert"
    >
      <!-- 组件icon -->
      <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <!-- 组件内容区域 -->
      <div class="el-alert__content">
        <!-- 组件title，当有description时，加粗显示 -->
        <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
        <!-- 优先显示el-alert标签内的内容，如果没有，再看description是否有值，前两种任意一种情况都会使用大图标，都没有则不显示。 -->
        <slot>
          <p class="el-alert__description" v-if="description">{{ description }}</p>
        </slot>
        <!-- 关闭按钮，可使用默认的X或者自定义的文字 -->
        <i class="el-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  // 三种图标样式
  const TYPE_CLASSES_MAP = {
    'success': 'el-icon-success',
    'warning': 'el-icon-warning',
    'error': 'el-icon-error'
  };
  export default {
    name: 'ElAlert',

    props: {
      // 标题内容，必选
      title: {
        type: String,
        default: '',
        required: true
      },
      // 描述，可视为正文，当存在时，且有图标时，会使用大图标
      description: {
        type: String,
        default: ''
      },
      // alert的类型，控制着颜色，图标等有关组件类型的
      type: {
        type: String,
        default: 'info'
      },
      // 该alert是否可关闭，控制关闭按钮显示与不显示的
      closable: {
        type: Boolean,
        default: true
      },
      // 当出现关闭时，改属性控制关闭按钮是X还是本属性内得的文本内容
      closeText: {
        type: String,
        default: ''
      },
      // 是否显示图标
      showIcon: Boolean,
      // 内容是否居中显示
      center: Boolean
    },

    data() {
      return {
        visible: true
      };
    },

    methods: {
      // 关闭alert，并去调用使用者绑定的close事件
      close() {
        this.visible = false;
        this.$emit('close');
      }
    },

    computed: {
      // alert是什么类型的，该样式控制alert组件的样色风格
      typeClass() {
        return `el-alert--${ this.type }`;
      },
      // 根据当前传入的类型，显示不同的图标
      iconClass() {
        return TYPE_CLASSES_MAP[this.type] || 'el-icon-info';
      },
      // 判断是否需要使用大图标，有description或el-alert标签内含内容，则是
      isBigIcon() {
        return this.description || this.$slots.default ? 'is-big' : '';
      },
      // title是否需要加粗显示，有description或el-alert标签内含内容，则是
      isBoldTitle() {
        return this.description || this.$slots.default ? 'is-bold' : '';
      }
    }
  };
</script>
