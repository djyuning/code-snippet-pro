<template>
  <div id="app">
    <Layout class="app-main">
      <header ref="header" class="app-main-header">
        <!-- mac 窗口控件 -->
        <div class="window-control window-control-mac" v-if="isMac">
          <div class="control" @click="handleWindowClose ">
            <svg x="0" y="0" viewBox="0 0 10 10">
              <circle
                fill="#ff5e54"
                stroke="rgba(0, 0, 0, .1)"
                stroke-width="0.5"
                cx="5"
                cy="5"
                r="5"
              />
            </svg>
          </div>
          <div class="control" @click="handleWindowMinimize">
            <svg x="0" y="0" viewBox="0 0 10 10">
              <circle
                fill="#ffbf06"
                stroke="rgba(0, 0, 0, .1)"
                stroke-width="0.5"
                cx="5"
                cy="5"
                r="5"
              />
            </svg>
          </div>
          <div class="control" @click="handleWindowMaximize">
            <svg x="0" y="0" viewBox="0 0 10 10">
              <circle
                fill="#12cc3a"
                stroke="rgba(0, 0, 0, .1)"
                stroke-width="0.5"
                cx="5"
                cy="5"
                r="5"
              />
            </svg>
          </div>
        </div>

        <div class="logo">{{ $config.app.title }}</div>

        <!-- 应用菜单 -->
        <div class="menu-main">
          <Dropdown placement="bottom-start" @on-click="handleMenuFileChange">
            <span class="menu-main-item">文件</span>
            <DropdownMenu slot="list">
              <DropdownItem name="addArticle">创建</DropdownItem>
              <DropdownItem name="addFold">创建目录</DropdownItem>
              <DropdownItem name="addTag">创建标签</DropdownItem>
              <DropdownItem name="exportArticleAsPNG" :disabled="!editArticle" divided>导出当前文章为 PNG</DropdownItem>
              <DropdownItem name="exportArticleAsPDF" :disabled="!editArticle">导出当前文章为 PDF</DropdownItem>
              <DropdownItem name="quite" divided>退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown placement="bottom-start" @on-click="handleMenuViewChange">
            <span class="menu-main-item">视图</span>
            <DropdownMenu slot="list">
              <DropdownItem name="toggleResourceSide">
                <template v-if="resourceSideCollapsed">显示边栏</template>
                <template v-else>隐藏边栏</template>
              </DropdownItem>
              <DropdownItem name="toggleListSide">
                <template v-if="listSideCollapsed">显示列表栏</template>
                <template v-else>隐藏列表栏</template>
              </DropdownItem>
              <DropdownItem name disabled divided>卡片式列表栏</DropdownItem>
              <DropdownItem name disabled divided>显示迷你地图</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span class="menu-main-item" @click="modalSettings = true">偏好</span>
          <span class="menu-main-item" @click="modalAbout = true">关于</span>
        </div>

        <!-- 可拖动占位分隔 -->
        <div class="split"></div>

        <!-- windows 窗口控件 -->
        <div class="window-control" v-if="isWin">
          <div class="control win" @click="handleWindowMinimize">
            <svg x="0" y="0" viewBox="0 0 10 1">
              <rect fill="#000000" width="10" height="1" />
            </svg>
          </div>
          <div class="control win" @click="handleWindowMaximize">
            <svg v-if="!maximize" class="fullscreen-svg" x="0" y="0" viewBox="0 0 10 10">
              <path
                fill="#000000"
                d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z "
              />
            </svg>
            <svg v-if="maximize" class="maximize-svg" x="0" y="0" viewBox="0 0 10 10">
              <mask id="Mask">
                <rect fill="#FFFFFF" width="10" height="10" />
                <path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
                <path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
              </mask>
              <path
                fill="#000000"
                d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z"
                mask="url(#Mask)"
              />
            </svg>
          </div>
          <div class="control win closebel" @click="handleWindowClose">
            <svg x="0" y="0" viewBox="0 0 10 10">
              <polygon fill="#000000" points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5" />
            </svg>
          </div>
        </div>
      </header>
      <Layout>
        <!-- 资源边栏 -->
        <Sider v-show="!resourceSideCollapsed" class="app-main-side" :width="mainSideSize">
          <div class="serach-wrap" style="padding: 10px;">
            <Search v-model="searchKeyword" />
          </div>

          <!-- 文件夹 -->
          <SidePanel title="文件夹" icon="md-archive">
            <Icon slot="options" class="handle" type="md-add" @click="modalEditFold = true" />
            <SideMenu
              :active="foldActive ? foldActive.uuid : null"
              @on-change="handleFoldChange"
              @on-edit="handleFoldEdit"
            >
              <SideMenuItem v-for="(fold, index) in treeFolds" :key="index" :item="fold" options />
            </SideMenu>
          </SidePanel>

          <!-- 语言 -->
          <SidePanel title="语言" icon="md-document">
            <SideMenu @on-change="handleLangChange">
              <SideMenuItem v-for="(mod, index) in modes" :key="index" :item="mod" />
            </SideMenu>
          </SidePanel>

          <!-- 标签 -->
          <SidePanel title="标签" icon="md-pricetags">
            <template slot="options">
              <Icon v-if="!editTags" class="handle" type="md-create" @click="editTags = true" />
              <Icon v-if="editTags" class="handle" type="md-checkmark" @click="editTags = false" />
              <Icon class="handle" type="md-add" @click="modalEditTag = true" />
            </template>
            <Tooltip
              v-for="(tag, index) in tags"
              :key="index"
              class="title-wrap"
              :content="tag.remark || tag.title"
              max-width="200"
              :delay="1000"
              placement="top-start"
              transfer
            >
              <Tag
                :closable="editTags"
                :title="tag.remark"
                @on-close="handleTagDelete(index, tag)"
              >{{ tag.title }}</Tag>
            </Tooltip>
          </SidePanel>
        </Sider>

        <!-- 文章列表边栏 -->
        <Sider v-show="!listSideCollapsed" class="app-main-sub-side" :width="subSideSize">
          <ArticleList ref="articleList" class="article-list">
            <ArticleRow
              v-for="(article, index) in articlesUse"
              :key="article.uuid"
              :article="article"
              @on-change="editArticle = article"
              @on-handle-move="handleMoveArticle"
            />
          </ArticleList>

          <div class="app-main-sub-side-options">
            <Button type="success" @click="handleCreate" long>创建</Button>
          </div>
        </Sider>

        <!-- 内容操作区域 -->
        <Content class="app-main-content">
          <!-- 欢迎界面 -->
          <Welcome v-show="!editArticle" />

          <!-- 文章编辑器 -->
          <Edit
            v-if="editArticle"
            ref="edit"
            :article="editArticle"
            @on-cancel="editArticle = null"
          />
        </Content>
      </Layout>
    </Layout>

    <!-- 目录编辑弹窗 -->
    <ModalEditFold v-model="modalEditFold" :fold="editFold" />
    <!-- 标签编辑弹窗 -->
    <ModalEditTag v-model="modalEditTag" />
    <!-- 设置弹窗 -->
    <ModalSettings v-model="modalSettings" />
    <!-- 关于弹窗 -->
    <ModalAbout v-model="modalAbout" />
    <!-- 移动文章目录选择弹窗 -->
    <ModalMoveTo v-model="modalMoveTo" :article="movingArticle" @on-change="handleMoveToChange" />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import hotkeys from "hotkeys-js";

export default {
  name: "App",
  components: {
    Welcome: () => import("@/components/Welcome"),
    SidePanel: () => import("@/components/SidePanel"),
    SideMenu: () => import("@/components/SideMenu"),
    SideMenuItem: () => import("@/components/SideMenuItem"),
    ModalEditFold: () => import("@/components/ModalEditFold"),
    ModalEditTag: () => import("@/components/ModalEditTag"),
    ModalSettings: () => import("@/components/ModalSettings"),
    ModalAbout: () => import("@/components/ModalAbout"),
    ModalMoveTo: () => import("@/components/ModalMoveTo"),
    ArticleList: () => import("@/components/ArticleList"),
    ArticleRow: () => import("@/components/ArticleRow"),
    Edit: () => import("@/components/Edit"),
    Search: () => import("@/components/Search"),
    PasswordCheck: () => import("@/components/PasswordCheck")
  },
  data() {
    return {
      isMac: process.platform === "darwin", // 是否为 mac 平台
      isWin: ["win", "win32", "win64"].includes(process.platform), // 是否为 windows 平台
      mainSideSize: 200, // 资源边栏的尺寸
      subSideSize: 240, // 列表栏尺寸
      maximize: false, // 窗口是否处于最大化状态

      articlesUse: [], // 列表栏渲染的文章

      modalEditFold: false, // 是否显示编辑文件夹弹窗
      modalEditTag: false, // 是否显示添加标签弹窗
      modalSettings: false, // 是否显示设置弹窗
      modalAbout: false, // 是否显示关于弹窗
      modalMoveTo: false, // 是否显示移动文章弹窗

      searchKeyword: "", // 搜索关键字
      searchTimer: null, // 搜索防抖计时器

      editTags: false, // 是否正在编辑标签
      editFold: null, // 正在编辑的目录

      movingArticle: {} // 正在移动的文章
    };
  },
  computed: {
    // 目录
    ...mapState({
      folds: state => state.Fold.folds,
      foldActive: state => state.Fold.active,
      foldUnlocked: state => state.Fold.unlocked
    }),

    // 文章
    ...mapState({
      articles: state => state.Article.articles,
      editArticle: state => state.Article.editArticle,
      activeArticles: state => state.Article.activeArticles
    }),

    // 标签
    ...mapState({
      tags: state => state.Tag.tags
    }),

    // 应用
    ...mapState({
      pathUserData: state => state.App.pathUserData,
      pathAppData: state => state.App.pathAppData,
      pathDownload: state => state.App.pathDownload,
      resourceSideCollapsed: state => state.App.resourceSideCollapsed,
      listSideCollapsed: state => state.App.listSideCollapsed
    }),

    // 递归处理的目录
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
    },

    // 从现有文章中，读取存在的文档格式
    modes: function() {
      let modes = [
        {
          title: "All",
          icon: "md-document",
          count: this.articles.length
        }
      ];
      if (!this.articles.length) return modes;

      this.articles.forEach(article => {
        let extend = modes.find(m => m.title === article.lang);
        if (extend) {
          extend.count += 1;
        } else {
          modes.push({
            title: article.lang,
            icon: "md-document",
            count: 1
          });
        }
      });

      return modes;
    }
  },
  watch: {
    articles: function() {
      this.articlesUse = [...this.articles];
    },

    activeArticles: function() {
      this.articlesUse = [...this.activeArticles];
    },

    // 搜索文章
    searchKeyword: function(keyword) {
      this.searchFilter(keyword);
    },

    // 目录窗口关闭时，清除编辑的目录
    modalEditFold: function(visible) {
      if (!visible) {
        this.editFold = null;
      }
    },

    modalMoveTo: function(visible) {
      if (!visible) {
        this.movingArticle = {};
      }
    }
  },
  methods: {
    // 窗口操作
    handleWindowMinimize() {
      ipcRenderer.send("window-minimize");
    },

    handleWindowMaximize() {
      ipcRenderer.send("window-toggle");
    },

    handleWindowClose() {
      ipcRenderer.send("window-close");
    },

    // 渲染线程初始化
    initRenderProcess() {
      // 响应窗口尺寸变化
      ipcRenderer.on("window-toggle", (e, isMaximized) => {
        this.maximize = isMaximized ? true : false;
      });

      ////////////////////////////////////////////////////////////////

      // 初始化用户数据存储位置
      ipcRenderer.send("get-user-data-path");
      ipcRenderer.on("get-user-data-path", (e, userDataPath) => {
        this.$store.dispatch("App/setPathUserData", userDataPath);
      });

      // 初始化用户下载目录
      ipcRenderer.send("get-user-download-path");
      ipcRenderer.on("get-user-download-path", (e, downloadPath) => {
        this.$store.dispatch("App/setPathDownload", downloadPath);
      });
    },

    // 快捷键绑定
    initHotKeys() {
      // 新建文章
      hotkeys("ctrl+n, command+n", () => {
        this.handleCreate();
        return false;
      });

      // 新建目录
      hotkeys("ctrl+f, command+f", () => {
        this.modalEditFold = true;
        return false;
      });

      // 新建标签
      hotkeys("ctrl+t, command+t", () => {
        this.modalEditTag = true;
        return false;
      });

      // 打开设置面板
      hotkeys("ctrl+k, command+k", () => {
        this.modalSettings = true;
        return false;
      });
    },

    /////////////////////////////////////////////

    // 搜索文章
    searchFilter(keyword) {
      if (this.searchTimer) return;

      if (!keyword || keyword === "") {
        this.articlesUse = [...this.articles];
        return;
      }

      // 取消正在编辑的文章
      if (this.editArticle) {
        this.$store.dispatch("Article/setEditArticle", null);
      }

      this.articlesUse.splice(0);

      this.searchTimer = setTimeout(() => {
        this.articlesUse = [...this.articles].filter(
          article =>
            article.title.toLowerCase().includes(keyword) ||
            article.lang.toLowerCase().includes(keyword)
        );
        this.searchTimer = clearTimeout(this.searchTimer);
      }, 400);
    },

    /////////////////////////////////////////////

    // 新建文章
    handleCreate() {
      this.$store.dispatch("Article/addArticle");
      this.$store.dispatch("Article/setEditArticle", this.articles[0]);
    },

    // 文件目录选择
    handleFoldChange(fold) {
      this.$store.dispatch("Article/setEditArticle", null);
      this.$store.dispatch("Fold/setActiveFold", fold);
    },

    // 编辑目录
    handleFoldEdit(fold) {
      this.editFold = fold;
      this.modalEditFold = true;
    },

    // 菜单事件监听
    handleMenuFileChange(name) {
      // 新建片段
      if (name === "addArticle") {
        this.handleCreate();
        return;
      }

      // 新建目录
      if (name === "addFold") {
        this.modalEditFold = true;
        return;
      }

      // 新建标签
      if (name === "addTag") {
        this.modalEditTag = true;
        return;
      }

      // 导出当前文章为 PNG
      if (name === "exportArticleAsPNG") {
        if (!this.editArticle) return;
        this.$refs.edit.exportAsImage();
        return;
      }

      // 导出当前文章为 PDF
      if (name === "exportArticleAsPDF") {
        if (!this.editArticle) return;
        this.$refs.edit.exportAsPDF();
        return;
      }

      // 退出应用
      if (name === "quite") {
        ipcRenderer.send("window-close");
        return;
      }
    },

    // 视图菜单操作
    handleMenuViewChange(name) {
      if (name === "toggleResourceSide") {
        return this.$store.dispatch("App/toggleResourceSide");
      }

      if (name === "toggleListSide") {
        return this.$store.dispatch("App/toggleListSide");
      }
    },

    // 语言标签可查看文章
    handleLangChange(item) {
      let lang = item.title;

      // 移除正在编辑的文章
      this.$store.dispatch("Article/setEditArticle", null);
      // 移除高亮的目录
      this.$store.dispatch("Fold/setActiveFold", null);

      if (lang === "All") {
        this.articlesUse = [...this.articles];
        return;
      }

      this.articlesUse = [...this.articles].filter(
        article => article.lang === lang
      );
    },

    // 删除标签
    handleTagDelete(index, tag) {
      this.$store.dispatch("Tag/deleteTag", tag);
    },

    // 唤醒移动文章
    handleMoveArticle(article) {
      this.movingArticle = article;
      this.modalMoveTo = true;
    },

    // 确定移动文章
    handleMoveToChange(target) {
      console.log(this.movingArticle, target);

      this.$store.dispatch("Article/moveArticleToFold", {
        article: this.movingArticle,
        target: target
      });
    }
  },
  mounted() {
    // 渲染线程初始化
    this.initRenderProcess();
    // 快捷键绑定
    this.initHotKeys();
    // 初始化全部文章
    this.$store.dispatch("Article/eachArticles");
  },
  beforeDestroy() {
    // 移除快捷键监听
    hotkeys.unbind("*");
    // 重置应用状态
    this.$store.dispatch("Article/setEditArticle", null);
    this.$store.dispatch("Fold/setActiveFold", null);
    this.$store.dispatch("Fold/updateUnlocked", null);
  }
};
</script>

<style lang="less">
@import "./styles/app.less";
</style>
