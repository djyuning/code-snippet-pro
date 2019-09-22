<template>
  <div class="editor">
    <div class="basic">
      <div class="options">
        <Icon class="item" type="md-arrow-back" @click="handleCancel" />
      </div>
      <div class="title">
        <input v-model="article.title" placeholder="输入代码片段标题" @change="handleTitleChange" />
      </div>
    </div>

    <div class="window">
      <div class="sub">
        <codemirror
          v-model="article.content"
          class="codemirror"
          ref="codemirror"
          :options="cmOptions"
          :style="cmStyle"
          @changes="handleCMChange"
        />
      </div>
      <div v-if="markdownReview" class="sub">
        <vue-markdown v-if="isMarkDown" class="markdown-body" :source="article.content" html />
      </div>
    </div>

    <div class="status-bar">
      <span v-if="isMarkDown" class="handle" @click="markdownReview = !markdownReview">预览</span>

      <div class="handle">
        行 {{ row }}
        列 {{ column }}
      </div>

      <div class="handle-dropdown">
        <span class="handle" title="选择语言模式">{{ currentLang }}</span>
        <div class="handle-dropdown-content">
          <div class="lang-menu">
            <ul>
              <li
                v-for="(item, index) in mode"
                :class="[currentLang === item.name ? 'current' : '']"
                :value="item.name"
                :key="index"
                @click="currentLang = item.name"
              >{{ item.name }}（{{ item.mode }}）</li>
            </ul>
          </div>
        </div>
      </div>

      <span class="handle" title="自动换行" @click="handleToggleWordWrap">
        <template v-if="wordWrap">禁用自动换行</template>
        <template v-if="!wordWrap">自动换行</template>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

// 导入模块和主题配置
import theme from "@/lib/theme";
import mode from "@/lib/mode";

// 导出模块和主题
import "@/lib/themes";
import "@/lib/modes";

// 行选择
import "codemirror/addon/selection/active-line.js";

// 代码折叠
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";

export default {
  name: "Edit",
  components: {
    VueMarkdown: () => import("vue-markdown")
  },
  data() {
    return {
      article: {
        title: "",
        content: "",
        lang: "Markdown"
      }, // 编辑的文章拷贝
      cm: null, // 实例
      currentLang: "Markdown",
      lineWrapping: false,
      row: 0,
      column: 0,
      mode,
      theme,
      markdownReview: false
    };
  },
  computed: {
    ...mapState({
      editArticle: state => state.Contents.editArticle,
      codeTheme: state => state.Settings.codeTheme,
      codeFontFamily: state => state.Settings.codeFontFamily,
      codeFontSize: state => state.Settings.codeFontSize,
      lineNumber: state => state.Settings.lineNumber,
      wordWrap: state => state.Settings.wordWrap
    }),

    // 编辑器额外样式
    cmStyle: function() {
      return {
        fontFamily: this.codeFontFamily,
        fontSize: `${this.codeFontSize}px`
      };
    },

    // codemirror 实例配置
    cmOptions: function() {
      return {
        indentUnit: 2, // 2 个空格缩进
        tabSize: 4,
        indentWithTabs: false, // 不使用 tab 缩进
        mode: this.currentLangObj.mode,
        theme: this.codeTheme || "default",
        lineNumbers: this.lineNumber,
        line: true,
        lineWrapping: this.wordWrap, // 超出长度换行
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      };
    },

    // 选择的语言
    currentLangObj: function() {
      let current = this.mode.find(
        item => item.name === (this.currentLang || "Markdown")
      );
      return current;
    },

    // 是否是 MarkDown 文档
    isMarkDown: function() {
      if (!this.currentLang) {
        this.cm.setOption("mode", "Markdown");
        this.$store.dispatch("Contents/updateArticle", this.article);
        return true;
      }
      return this.currentLang.toLowerCase() === "markdown";
    }
  },
  watch: {
    codeTheme: function(theme) {
      this.cm.setOption("theme", theme);
    },

    lineNumber: function(visible) {
      this.cm.setOption("lineNumbers", visible);
    },

    editArticle: {
      handler(newValue, oldValue) {
        // 拷贝编辑的文章
        this.article = { ...newValue };

        // 因此 markdown 预览面板
        this.markdownReview = false;

        // 切换语言高亮
        let lang = this.article ? this.article.lang : "Markdown";
        this.currentLang = lang;
        this.cm.setOption("mode", lang);

        // 设置编辑器内容
        this.cm.refresh();
      },
      deep: true
    },

    currentLang: function(lang) {
      this.$store.dispatch("Contents/updateArticle", {
        ...this.article,
        ...{
          lang
        }
      });
    }
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },

    // 更新鼠标位置
    updateCurrentPos() {
      let { cm } = this;
      let pos = cm.getCursor();
      this.row = cm.findPosV({ line: pos.line, ch: pos.ch }).line + 1;
      this.column = cm.findPosH({ line: pos.line, ch: pos.ch }).ch + 1;
    },

    // 保存数据
    handleSave() {
      this.$store.dispatch("Contents/updateArticle", this.article);
      this.$Message.success("保存成功");
    },

    // 监听编辑器点击事件
    handleClickInside(e) {
      if (this.$el.contains(e.target)) {
        this.updateCurrentPos();
      }
    },

    // 退出编辑
    handleCancel() {
      this.$store.dispatch("Contents/setEditArticle", null);
    },

    handleCMChange(e) {
      this.$store.dispatch("Contents/updateArticle", this.article);
    },

    handleTitleChange() {
      this.$store.dispatch("Contents/updateArticle", this.article);
    },

    handleToggleWordWrap() {
      this.$store.dispatch(
        "Settings/setWordWrap",
        this.wordWrap ? false : true
      );
    }
  },
  mounted() {
    // 初始化编辑器
    this.cm = this.$refs.codemirror.codemirror;

    // 初始化编辑的内容
    this.article = { ...this.editArticle };
    this.currentLang = this.article.lang;

    // 监听文档点击事件
    document.addEventListener("click", this.handleClickInside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickInside);
  }
};
</script>

<style lang="less">
// 编辑器
.editor {
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;

  // 基础信息
  .basic {
    align-items: center;
    background-color: white;
    border-bottom: 1px #c9d2de solid;
    display: flex;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;

    // 标题输入
    .title {
      flex-grow: 1;
      position: relative;

      input {
        background-color: #c9d2de;
        border: none;
        border-radius: 3px;
        box-sizing: border-box;
        color: #333;
        font-size: 18px;
        font-weight: bold;
        line-height: 20px;
        outline: none;
        padding: 6px 16px;
        width: calc(100% - 4px);

        &::placeholder {
          color: rgba(100, 100, 100, 0.3);
        }
      }
    }

    // 操作
    .options {
      align-items: center;
      display: flex;
      flex-shrink: 0;
      position: relative;

      // 操作条目
      & > .item {
        cursor: pointer;
        display: block;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        width: 40px;
      }
    }
  }

  // 编辑窗口
  .window {
    background-color: white;
    bottom: 24px;
    display: flex;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 41px;
    z-index: 1;

    // 子窗口
    .sub {
      flex: 1;
      overflow: hidden;
      height: 100%;
      position: relative;

      &:last-of-type {
        border-left: 1px #eee solid;
      }
    }

    // markdown 预览
    .markdown-body {
      background-color: white;
      box-sizing: border-box;
      font-family: -apple-system, "微软雅黑", BlinkMacSystemFont, Segoe UI,
        Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
        Segoe UI Symbol;
      overflow: auto;
      padding: 40px;
      height: 100%;
    }
  }

  // 状态
  .status-bar {
    align-items: center;
    background-color: white;
    border-top: 1px #eee solid;
    bottom: 0;
    display: flex;
    height: 24px;
    justify-content: flex-end;
    left: 0;
    position: absolute;
    right: 0;
    z-index: 2;

    // 操作项
    .handle {
      cursor: pointer;
      display: block;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      margin: 0 4px;
      padding: 0 4px;
      position: relative;
      user-select: none;
      min-width: 24px;
      z-index: 2;

      &:hover {
        background-color: #5cc779;
        color: white;
      }
    }
  }

  // 展开菜单
  .handle-dropdown {
    position: relative;

    // 内容
    &-content {
      display: none;
      bottom: 0;
      padding-bottom: 24px;
      position: absolute;
      right: 0;
      z-index: 1;
    }

    &:hover > .handle {
      background-color: #5cc779;
      color: white;
    }

    &:hover > .handle-dropdown-content {
      display: block;
    }
  }

  // 语言选择
  .lang-menu {
    background-color: white;
    border: 1px #eee solid;
    border-bottom: none;
    max-height: 480px;
    overflow: auto;

    ul {
      list-style: none;

      li {
        cursor: default;
        font-size: 12px;
        line-height: 30px;
        position: relative;
        padding: 0 16px;
        user-select: none;
        white-space: nowrap;

        &:hover {
          background-color: #eee;
          color: #5cc779;
        }

        &.current {
          background-color: #5cc779;
          color: white;
        }
      }
    }
  }
}
</style>
