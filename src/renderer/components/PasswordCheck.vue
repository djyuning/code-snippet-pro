<template>
  <div class="password-check">
    <Icon class="icons" type="md-lock" />
    <Input v-model="password" ref="password" type="password" placeholder="输入密码">
      <Tooltip slot="append" :content="tips" placement="top-end">
        <Icon type="md-information-circle" />
      </Tooltip>
    </Input>
    <Button class="submit" type="primary" @click="handleSubmit" long>确定</Button>
  </div>
</template>

<script>
export default {
  name: "PasswordCheck",
  props: {
    // 密码提示
    tips: String
  },
  data() {
    return {
      password: ""
    };
  },
  methods: {
    handleSubmit() {
      if (!this.password) {
        this.$refs.password.focus();
        this.$Message.error("请输入正确的访问密码!");
        return;
      }
      this.$emit("on-submit", this.password);
    }
  }
};
</script>

<style lang="less" scoped>
// 密码检测
.password-check {
  margin: 0 auto;
  max-width: 320px;
  padding: 20px 20px 64px;
  position: relative;

  // 图标
  .icons {
    display: block;
    font-size: 48px;
    height: 64px;
    line-height: 64px;
    margin: 32px auto;
    opacity: 0.3;
    text-align: center;
    width: 64px;
  }

  // 提交按钮
  .submit {
    margin-top: 20px;
  }
}
</style>