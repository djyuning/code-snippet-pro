<template>
  <Modal v-model="modal" title="选择新的目录" width="480" transfer>
    <Alert v-if="tips" type="warning" show-icon>{{ tips }}</Alert>
    <Tree ref="tree" :data="treeFolds" children-key="child" />
    <div slot="footer">
      <Button type="text" @click="handleCancel">取消</Button>
      <Button type="primary" @click="handleConfirm">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ModalMoveTo",
  props: {
    // 显隐状态
    value: Boolean,
    // 提示文本
    tips: String
  },
  data() {
    return {
      modal: this.$props.value
    };
  },
  computed: {
    ...mapState({
      folds: state => state.Contents.folds
    }),

    // 树组件使用的目录数据
    treeFolds: function() {
      function _recursion(parent, folds) {
        folds = JSON.parse(JSON.stringify(folds));
        let res = [];

        folds.forEach((fold, index) => {
          if (fold.parent == parent) {
            fold.child = _recursion(fold.uuid, folds);
            res.push(fold);
          }
        });

        return res;
      }

      return _recursion("0", this.folds);
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
    handleCancel() {
      this.modal = false;
    },

    handleConfirm() {
      this.$emit("on-change", this.$refs.tree.getSelectedNodes()[0]);
      this.modal = false;
    }
  }
};
</script>

<style>
</style>