<template>
  <div :class="['search', focus ? 'focus' : '']">
    <Icon class="icons icons-search-before" type="md-search" />
    <input v-model="input" :placeholder="placeholder" @focus="handleFocus" />
    <Icon v-if="input" class="icons icons-clear" type="md-close-circle" @click="input = ''" />
    <Icon class="icons icons-search-after" type="md-search" />
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    // 默认输入
    value: String,

    // 提示文本
    placeholder: {
      type: String,
      default: "输入关键字"
    }
  },
  data() {
    return {
      focus: false,
      input: this.$props.value
    };
  },
  watch: {
    value: function(val) {
      this.input = val;
    },
    input: function(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    handleFocus() {
      this.focus = true;
      // 非组件位置点击时失去焦点
      document.addEventListener("click", this.blankClick, false);
    },
    blankClick(e) {
      if (!this.$el.contains(e.target)) {
        this.focus = false;
        document.removeEventListener("click", this.blankClick, false);
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.blankClick, false);
  }
};
</script>

<style lang="less" scoped>
.search {
  border: 1px #eee solid;
  background-color: white;
  border-radius: 4px;
  min-height: 32px;
  overflow: hidden;
  position: relative;
  z-index: 1;

  // 图标
  .icons {
    color: #d4d9e8;
    font-size: 16px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    position: absolute;
    top: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    width: 32px;
    z-index: 2;

    // 输入框
    &-search-before {
      left: 0;
      opacity: 0;
      transform: translate3d(-32px, 0, 0);
    }

    &-search-after {
      right: 0;
      opacity: 1;
    }

    &-clear {
      right: 32px;
      opacity: 0;
    }
  }

  // 输入框
  input {
    background-color: transparent;
    border: none;
    font-size: 12px;
    left: 0;
    line-height: 24px;
    outline: none;
    overflow: hidden;
    padding: 4px 16px;
    position: absolute;
    right: 32px;
    top: 0;
    transition: padding 0.3s ease;
    width: calc(~"100% - 16px");
    z-index: 1;

    &::placeholder {
      color: #8793b2;
    }
  }

  // 聚焦
  &.focus {
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);

    // 输入框
    input {
      padding-left: 32px;
    }

    // 图标
    .icons {
      &-search-before {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      &-search-after {
        opacity: 0;
        transform: translate3d(32px, 0, 0);
      }
      &-clear {
        opacity: 1;
        transform: translate3d(32px, 0, 0);
      }
    }
  }
}
</style>