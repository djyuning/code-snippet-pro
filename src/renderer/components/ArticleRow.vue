<template>
  <div :class="{ 'article-row': true, current }" @click="handleClick">
    <div class="info">
      <Tooltip
        class="title-wrap"
        :content="article.title"
        max-width="200"
        :delay="1000"
        placement="top-start"
        transfer
      >
        <div class="title">
          <Icon class="icons" type="md-document" />
          <h4>{{ article.title }}</h4>
        </div>
      </Tooltip>

      <div class="attrs">
        <Tag class="tag" color="success">{{ article.lang }}</Tag>
        <Tag class="tag" color="cyan" v-if="article.content && article.content.length">字数: {{ article.content.length }}</Tag>
      </div>
      <div class="datetime">{{ article.createAt }}</div>
    </div>
    <div class="options" ref="options">
      <Dropdown placement="bottom-end" @on-click="handleDropdownClick">
        <Icon class="handle" type="md-settings" />
        <DropdownMenu slot="list">
          <DropdownItem name="moveTo">移动到</DropdownItem>
          <DropdownItem name="moveTo">设为私密</DropdownItem>
          <DropdownItem class="danger" name="delete">删除</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ArticleRow",
  props: {
    // 文章条目
    article: {
      type: Object,
      required: true,
      default() {
        return {
          title: "",
          content: ""
        };
      }
    }
  },
  computed: {
    ...mapState({
      editArticle: state => state.Contents.editArticle
    }),

    current: function() {
      if (!this.editArticle) return false;
      return this.editArticle.uuid === this.$props.article.uuid;
    }
  },
  methods: {
    handleClick(e) {
      if (!this.$refs.options.contains(e.target)) {
        this.$store.dispatch("Contents/setEditArticle", this.$props.article);
      }
    },

    handleDropdownClick(name) {
      // 删除文章
      if (name === "delete") {
        this.$Modal.confirm({
          title: "操作提示",
          content: `确定删除《${this.$props.article.title}》？`,
          onOk: () => {
            // 移除正在编辑的文章
            if (this.current) {
              this.$store.dispatch("Contents/setEditArticle", null);
            }
            // 删除当前文章
            this.$store.dispatch(
              "Contents/deleteArticle",
              this.$props.article.uuid
            );
          }
        });
        return;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.article-row {
  border-top: 1px #ced7e0 solid;
  cursor: default;
  padding: 16px 10px;
  position: relative;
  user-select: none;

  // 删除操作
  .danger {
    color: red;
  }

  // 基础信息
  .info {
    position: relative;

    // 标题
    .title {
      align-items: center;
      display: flex;
      position: relative;
      width: calc(100% - 32px);

      &-wrap {
        display: block !important;
        /deep/.ivu-tooltip-rel {
          display: block;
        }
      }

      .icons,
      h4 {
        display: block;
        line-height: 24px;
      }

      // 图标
      .icons {
        font-size: 16px;
        flex-shrink: 0;
        height: 24px;
        margin-right: 4px !important;
        text-align: center;
        width: 24px;
      }

      h4 {
        flex: 1;
        font-size: 14px;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    // 附加属性
    .attrs {
      display: flex;
      flex-wrap: wrap;
      pointer-events: none;
      padding: 5px 0;
      padding-left: 24px;

      .tag {
        font-size: 10px;
        height: 16px;
        line-height: 16px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }

    // 创建日期
    .datetime {
      color: #999;
      font-size: 12px;
      line-height: 20px;
      margin-left: 24px;
      overflow: hidden;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  // 操作
  .options {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    right: 10px;
    top: 10px;
    visibility: hidden;
    width: 24px;

    // 触发图标
    .handle {
      cursor: pointer;
      display: block;
      font-size: 16px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      width: 24px;
    }
  }

  // 划过
  &:hover,
  &.current {
    background-color: #f8f9fc;

    // 信息
    .info {
      .title {
        color: #333;
      }
    }

    // 显示操作
    .options {
      visibility: visible;
    }
  }
}
</style>