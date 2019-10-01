<template>
  <Modal v-model="modal" title="目录编辑" width="640">
    <div class="form-wrap">
      <Form class="form" ref="form" :model="formEdit" :label-width="120">
        <FormItem label="上级目录" prop="parent">
          <i-select v-model="formEdit.parent">
            <Option value="0">顶级目录</Option>
            <template v-if="indentFolds.length">
              <Option
                v-for="(item, index) in indentFolds"
                :value="item.uuid"
                :label="item.path.join(' - ')"
                :disabled="item.uuid === 'default'"
                :key="index"
              >
                <span :style="{ paddingLeft: `${item.level * 16}px` }">{{ item.title }}</span>
              </Option>
            </template>
          </i-select>
        </FormItem>

        <FormItem v-if="formEdit.color" label="颜色" prop="color">
          <ColorPicker v-model="formEdit.color" recommend />
        </FormItem>

        <FormItem label="名称" prop="title">
          <Input v-model="formEdit.title" placeholder="请填写目录名称" autofocus></Input>
        </FormItem>

        <FormItem label="备注" prop="remark">
          <Input
            v-model="formEdit.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请填写备注"
          ></Input>
        </FormItem>

        <FormItem label="图标" prop="icon">
          <Input v-model="formEdit.icon" placeholder="请填写备注">
            <template v-if="formEdit.icon" slot="append">
              <Icon size="16" :type="formEdit.icon"></Icon>
            </template>
          </Input>
        </FormItem>

        <FormItem label="启用访问密码">
          <i-switch v-model="formEdit.passwordEnable">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>

        <template v-if="formEdit.passwordEnable">
          <FormItem label="访问密码" prop="password">
            <Input v-model="formEdit.password" placeholder="请填写密码"></Input>
          </FormItem>

          <FormItem label="密码提示" prop="passwordTips">
            <Input v-model="formEdit.passwordTips" placeholder="请填写密码提示"></Input>
          </FormItem>
        </template>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" style="float: left;" @click="handleRestore">恢复默认</Button>
      <Button type="text" @click="handleReset">取消</Button>
      <Button type="primary" @click="handleSubmit">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState } from "vuex";

// 默认字段
const DEFAULT = {
  parent: "0", // 上级目录
  title: "", // 名称
  remark: "", // 备注
  icon: "ios-folder", // 图标
  passwordEnable: false, // 启用访问密码
  password: "", // 访问密码
  passwordTips: "", // 密码提示
  color: "#000000" // 颜色表示
};

export default {
  name: "ModalEditFold",
  props: {
    value: Boolean,
    // 编辑的条目
    fold: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      modal: this.$props.value,
      formEdit: { ...DEFAULT, ...(this.$props.fold || {}) }
    };
  },
  computed: {
    ...mapState({
      folds: state => state.Fold.folds,
      pathAppData: state => state.App.pathAppData
    }),

    // 递归处理数组，增加缩进效果
    indentFolds: function() {
      let folds = [...this.folds];
      if (!Array.isArray(folds) || !folds.length) return [];

      function _each(parent = "0", path = [], data = [], level = 0) {
        folds.forEach((fold, index) => {
          let item = { ...fold };
          if (fold.parent === parent) {
            let _path = [...path, item.title];
            item.level = level;
            item.path = _path;
            data.push(item);
            data = data.concat(_each(item.uuid, _path, [], level + 1));
          }
        });
        return data;
      }

      return _each();
    }
  },
  watch: {
    value: function(val) {
      this.modal = val;
      // 初始化数据
      const form = { ...DEFAULT, ...(this.$props.fold || {}) };
      this.form = form;
      this.formEdit = form;
    },
    modal: function(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    handleRestore() {
      this.formEdit = { ...DEFAULT, ...this.$props.fold };
    },
    handleReset() {
      this.formEdit = { ...DEFAULT, ...this.$props.fold };
      this.modal = false;
    },
    handleSubmit() {
      // 创建到缓存
      this.$store.dispatch(
        this.formEdit.uuid ? "Fold/updateFold" : "Fold/addFold",
        { ...this.formEdit }
      );
      // 关闭弹窗
      this.modal = false;
    }
  }
};
</script>

<style lang="less" scoped>
.form-wrap {
  margin: -15px;
}

.form {
  margin: 48px auto;
  padding-right: 64px;
  width: 480px;
}
</style>