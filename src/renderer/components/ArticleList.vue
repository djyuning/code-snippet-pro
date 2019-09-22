<template>
  <div class="article-list">
    <slot />
  </div>
</template>

<script>
export default {
  name: "ArticleList"
};
</script>

<style lang="less" scoped>
.article-list {
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 77px;
  position: relative;
  z-index: 2;
}
</style>