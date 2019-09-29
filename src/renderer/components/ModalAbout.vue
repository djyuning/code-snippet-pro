<template>
  <Modal v-model="modal" width="480" footer-hide transfer>
    <div class="about">
      <div class="logo">
        <img src="static/logo-in-about.png" srcset="static/logo-in-about@2x.png 2x" alt />
        <span class="title">{{ pkg.build.productName }}</span>
        <span class="slogan">{{ pkg.description }}</span>
        <span class="slogan">版本 {{ pkg.version }}</span>
      </div>

      <div class="body" v-if="dependencies.length">
        <p>
          特别感谢
          <br />
          <br />
          <template v-for="(pack, index) in dependencies">
            <a :key="index" :href="`https://www.npmjs.com/package/${pack}`">{{ pack }}</a>
            <template v-if="index < dependencies.length - 1">、</template>
          </template>
        </p>
      </div>

      <div class="options">
        <Button type="primary" @click="handleFeedback">问题建议</Button>
        <Button type="primary" @click="handleHomePage">官方主页</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { shell } from "electron";
import pkg from "../../../package";

export default {
  name: "ModalAbout",
  props: {
    // 显隐状态
    value: Boolean
  },
  data() {
    return {
      modal: this.$props.value,
      pkg
    };
  },
  computed: {
    dependencies: function() {
      if (!this.pkg) return [];
      return Object.keys(this.pkg.dependencies);
    }
  },
  watch: {
    value: function(val) {
      this.modal = val;
    },
    modal: function(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    // 打开问题建议页面
    handleFeedback() {
      shell.openExternal(this.$config.feedbackPage);
    },
    // 打开主页
    handleHomePage() {
      shell.openExternal(this.$config.homePage);
    }
  }
};
</script>

<style lang="less" scoped>
.about {
  position: relative;
  user-select: none;

  // logo
  .logo {
    padding: 20px;
    position: relative;

    img {
      display: block;
      margin: 24px auto 32px;
      width: 48px;
    }

    .title {
      display: block;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }

    .slogan {
      display: block;
      font-size: 12px;
      margin-top: 16px;
      text-align: center;
    }
  }

  // 内容
  .body {
    max-height: 200px;
    overflow: auto;
    padding: 20px;
    position: relative;
    text-align: center;
  }

  // 操作
  .options {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-top: 15px;
    position: relative;

    button {
      margin: 10px;
    }
  }
}
</style>