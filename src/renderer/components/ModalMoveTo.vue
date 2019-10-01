<template>
  <Modal v-model="modal" title="选择新的目录" width="480" transfer>
    <Alert
      v-if="tips"
      type="warning"
      show-icon
    >{{ `正在移动《${ isArticle ? article.title : '--'}》到新的目录：` }}</Alert>
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
    // 操作的文章
    article: {
      type: Object,
      required: true,
      default: {}
    },
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
      folds: state => state.Fold.folds
    }),

    // 树组件使用的目录数据
    treeFolds: function() {
      if (!this.isArticle) return [];

      let article = this.$props.article;

      function _recursion(parent, folds) {
        folds = JSON.parse(JSON.stringify(folds));
        let res = [];

        folds.forEach((fold, index) => {
          if (fold.parent == parent) {
            // 是否选中
            fold.selected = fold.uuid === article.fold;
            // 递归子级
            fold.child = _recursion(fold.uuid, folds);
            // 压入数组
            res.push(fold);
          }
        });

        return res;
      }

      return _recursion("0", this.folds);
    },

    isArticle: function() {
      let article = this.$props.article;
      if (
        !article ||
        JSON.stringify(article) === "{}" ||
        Object.prototype.toString.call(article) !== "[object Object]"
      ) {
        return false;
      }
      return true;
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