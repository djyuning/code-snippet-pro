<template>
  <div :class="['side-menu', expand ? 'side-menu-expand': '']">
    <slot />
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  props: {
    // 层级
    level: {
      type: Number,
      default: 0
    },

    // 高亮节点
    active: [String],

    // 是否展开
    expand: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="less" scoped>
.side-menu {
  display: none;
  padding: 2px 0;
  position: relative;

  // 未展开
  &-expand {
    display: block;
  }
}
</style>