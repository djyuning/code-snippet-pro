<template>
  <div class="welcome">
    <div class="welcome-content">
      <Complete :title="$config.app.title" :title-sub="$config.app.slogan">
        <div class="options">
          <Button type="primary" size="small" @click="handleCreate">新建片段</Button>
        </div>
      </Complete>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Welcome",
  components: {
    Complete: () => import("@/components/Complete")
  },
  computed: {
    ...mapState({
      articles: state => state.Contents.articles
    })
  },
  methods: {
    handleCreate() {
      this.$store.dispatch("Contents/addArticle");
      this.$store.dispatch("Contents/setEditArticle", this.articles[0]);
    }
  }
};
</script>

<style lang="less" scoped>
.welcome {
  align-items: center;
  background-color: #f0f3f9;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  .options {
    margin: 20px;
    position: relative;
  }
}
</style>