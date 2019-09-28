<template>
  <div class="complete">
    <div class="inner">
      <slot name="cover">
        <Icon v-if="icon" class="icon" :type="icon" />
      </slot>
      <h1 class="title" v-if="title">{{ title }}</h1>
      <h4 class="title-sub" v-if="titleSub">{{ titleSub }}</h4>
      <p class="contents" v-if="contents">{{ contents }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Complete",
  props: {
    // 图标
    icon: String,
    // 标题
    title: String,
    // 副标题
    titleSub: String,
    // 描述内容
    contents: String
  }
};
</script>

<style lang="less" scoped>
.complete {
  margin-left: auto;
  margin-right: auto;
  max-width: 640px;
  position: relative;

  .inner {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    position: relative;
  }

  .title,
  .title-sub,
  .contents {
    text-align: center;
    max-width: 100%;
  }

  .icon {
    color: #333;
    font-size: 64px;
    height: 96px;
    line-height: 96px;
    text-align: center;
    width: 96px;
  }

  .title,
  .title-sub {
    font-weight: normal;
  }

  .title {
    font-size: 28px;
    line-height: 36px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .title-sub {
    font-size: 18px;
    line-height: 28px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .contents {
    font-size: 12px;
    line-height: 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    overflow: auto;
    max-height: 20px * 4;
  }
}
</style>
