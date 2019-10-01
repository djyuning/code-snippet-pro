<template>
  <Modal v-model="modal" title="标签" width="640">
    <div class="form-wrap">
      <Form class="form" ref="form" :model="form" :label-width="120">
        <FormItem label="名称" prop="title">
          <Input v-model="form.title" :maxlength="16" placeholder="请填写标签名称" autofocus></Input>
        </FormItem>

        <FormItem label="备注" prop="remark">
          <Input
            v-model="form.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="100"
            placeholder="请填写备注"
          ></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="handleReset">取消</Button>
      <Button type="primary" @click="handleSubmit">保存</Button>
    </div>
  </Modal>
</template>

<script>
// 默认字段
const DEFAULT = {
  title: "", // 名称
  remark: "" // 备注
};

export default {
  name: "ModalEditTag",
  props: {
    value: Boolean
  },
  data() {
    return {
      modal: this.$props.value,
      form: {}
    };
  },
  watch: {
    value: function(val) {
      this.modal = val;
      this.form = { ...DEFAULT };
    },
    modal: function(val) {
      if (!val) {
        this.form = { ...DEFAULT };
      }
      this.$emit("input", val);
    }
  },
  methods: {
    handleReset() {
      this.form = { ...DEFAULT };
      this.modal = false;
    },
    handleSubmit() {
      this.modal = false;
      this.$store.dispatch("Tag/addTag", this.form);
    }
  }
};
</script>

<style lang="less" scoped>
.form-wrap {
  margin: -15px;
  max-height: 360px;
  overflow: auto;
}

.form {
  margin: 48px auto;
  padding-right: 64px;
  width: 480px;
}
</style>