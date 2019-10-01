<template>
  <div class="welcome">
    <div class="welcome-content">
      <Complete>
        <div slot="cover">
          <img src="static/logo-in-about.png" srcset="static/logo-in-about@2x.png 2x" alt />
        </div>
        <div class="options">
          <Button type="success" @click="handleCreate">创建</Button>
        </div>
      </Complete>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  components: {
    Complete: () => import("@/components/Complete")
  },
  methods: {
    handleCreate() {
      this.$store.dispatch("Article/addArticle");
    }
  }
};
</script>

<style lang="less" scoped>
.welcome {
  align-items: center;
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