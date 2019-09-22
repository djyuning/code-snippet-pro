<template>
  <Modal v-model="modal" title="设置密码" width="640" footer-hide>
    <div class="form-wrap">
      <Form class="form" ref="form" :label-width="120">
 

        <FormItem label="代码字号" prop="codeFontSize">
          <Input v-model="form.codeFontSize" placeholder="14" @on-change="handleCodeFontSizeChange">
            <span slot="append">px</span>
          </Input>
        </FormItem>

        
      </Form>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "ModalSetPassword"
};
</script>

<style>
</style>