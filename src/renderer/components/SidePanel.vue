<template>
  <div class="side-panel">
    <div class="head">
      <slot name="header">
        <div class="title">
          <Icon v-if="icon" class="icons" :type="icon" />
          <h4 v-if="title">{{ title }}</h4>
        </div>
        <div class="options">
          <slot name="options" />
        </div>
      </slot>
    </div>
    <div class="body">
      <slot name="default" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SidePanel",
  props: {
    // 标题
    title: String,
    // 图标
    icon: String
  }
};
</script>

<style lang="less" scoped>
.side-panel {
  padding: 10px;
  position: relative;

  // 头部
  & > .head {
    align-items: center;
    display: flex;
    justify-content: space-between;
    position: relative;

    // 标题
    .title {
      align-items: center;
      cursor: default;
      display: flex;
      flex-grow: 1;
      position: relative;

      .icons,
      h4 {
        display: block;
        height: 24px;
        line-height: 24px;
        overflow: hidden;
        position: relative;
      }

      .icons {
        color: #5cc779;
        font-size: 16px;
        flex-shrink: 0;
        text-align: center;
        width: 24px;
      }

      h4 {
        color: #7c8da9;
        flex-grow: 1;
        font-size: 12px;
        font-weight: bold;
        padding: 0 4px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    // 操作
    .options {
      align-items: center;
      display: flex;
      position: relative;
    }
  }

  // 内容
  & > .body {
    position: relative;
  }
}
</style>