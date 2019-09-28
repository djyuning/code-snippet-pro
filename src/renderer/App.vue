<template>
  <div id="app">
    <Layout class="app-main">
      <header ref="header" class="app-main-header">
        <div class="logo">{{ $config.app.title }}</div>
        <Dropdown placement="bottom-start" @on-click="handleMenuDropdownClick">
          <span class="handle">文件</span>
          <DropdownMenu slot="list">
            <DropdownItem name="addArticle">新建片段</DropdownItem>
            <DropdownItem name="quite">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span class="handle" @click="modalSettings = true">偏好</span>
        <span class="handle" @click="modalAbout = true">关于</span>
      </header>
      <Layout>
        <Sider class="app-main-side" :width="mainSideSize">
          <!-- 文件夹 -->
          <SidePanel title="文件夹" icon="md-archive">
            <Icon slot="options" class="handle light" type="md-add" @click="modalEditFold = true" />
            <SideMenu :active="foldActive" @on-change="handleFoldChange">
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
              <Icon
                v-if="!editTags"
                class="handle light"
                type="md-create"
                @click="editTags = true"
              />
              <Icon
                v-if="editTags"
                class="handle light"
                type="md-checkmark"
                @click="editTags = false"
              />
              <Icon class="handle light" type="md-add" @click="modalEditTag = true" />
            </template>
            <Tag
              color="primary"
              v-for="(tag, index) in tags"
              :key="index"
              :closable="editTags"
              @on-close="handleTagDelete(index, tag)"
            >{{ tag.title }}</Tag>
          </SidePanel>
        </Sider>
        <Layout>
          <Sider class="app-main-sub-side" :width="subSideSize">
            <PasswordCheck
              v-if="foldActiveLock"
              :tips="foldActiveData.passwordTips"
              @on-submit="checkActiveFoldPassword"
            />

            <template v-if="!foldActiveLock">
              <div class="serach-wrap" style="padding: 10px;">
                <Search v-model="searchKeyword" />
              </div>

              <ArticleList ref="articleList" class="article-list">
                <ArticleRow
                  v-for="(article, index) in allArticles"
                  :key="article.uuid"
                  :article="article"
                  @on-change="editArticle = article"
                />
              </ArticleList>

              <div class="app-main-sub-side-options">
                <Button type="success" @click="handleCreate" long>创建</Button>
              </div>
            </template>
          </Sider>
          <Content class="app-main-content">
            <Welcome v-show="!editArticle" />
            <Edit v-if="editArticle" :article="editArticle" @on-cancel="editArticle = null" />
          </Content>
        </Layout>
      </Layout>
    </Layout>

    <div class="window-control">
      <div class="control minimize" @click="handleWindowMinimize">
        <svg x="0" y="0" viewBox="0 0 10 1">
          <rect fill="#000000" width="10" height="1" />
        </svg>
      </div>
      <div class="control maximize" @click="handleWindowMaximize">
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
      <div class="control closebel" @click="handleWindowClose">
        <svg x="0" y="0" viewBox="0 0 10 10">
          <polygon fill="#000000" points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5" />
        </svg>
      </div>
    </div>

    <ModalEditFold v-model="modalEditFold" />
    <ModalEditTag v-model="modalEditTag" />

    <ModalSettings v-model="modalSettings" />
    <ModalAbout v-model="modalAbout" />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";

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
    ArticleList: () => import("@/components/ArticleList"),
    ArticleRow: () => import("@/components/ArticleRow"),
    Edit: () => import("@/components/Edit"),
    Search: () => import("@/components/Search"),
    PasswordCheck: () => import("@/components/PasswordCheck")
  },
  data() {
    return {
      // 主侧边栏的尺寸
      mainSideSize: 200,
      mainSideSizeCollspace: 64,
      subSideSize: 240,
      maximize: false,
      modalEditFold: false,
      modalEditTag: false,
      modalSettings: false,
      modalAbout: false,
      allArticles: [],
      searchKeyword: "",
      searchTimer: null,
      editTags: false
    };
  },
  computed: {
    ...mapState({
      editArticle: state => state.Contents.editArticle,
      articles: state => state.Contents.articles,
      folds: state => state.Contents.folds,
      tags: state => state.Contents.tags,
      foldActive: state => state.Contents.foldActive,
      foldActiveData: state => state.Contents.foldActiveData,
      foldActiveLock: state => state.Contents.foldActiveLock
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
      this.allArticles = [...this.articles];
    },

    // 搜索文章
    searchKeyword: function(keyword) {
      this.searchFilter(keyword);
    }
  },
  methods: {
    handleWindowMinimize() {
      ipcRenderer.send("window-minimize");
    },
    handleWindowMaximize() {
      ipcRenderer.send("window-toggle");
    },
    handleWindowClose() {
      ipcRenderer.send("window-close");
    },

    /////////////////////////////////////////////

    // 搜索文章
    searchFilter(keyword) {
      if (this.searchTimer) return;

      if (this.editArticle) {
        this.$store.dispatch("Contents/setEditArticle", null);
      }

      this.allArticles.splice(0);

      if (!keyword) {
        this.allArticles = [...this.articles];
        return;
      }

      this.searchTimer = setTimeout(() => {
        this.allArticles = [...this.articles].filter(article =>
          article.title.toLocaleLowerCase().includes(keyword)
        );

        this.searchTimer = clearTimeout(this.searchTimer);
      }, 400);
    },

    /////////////////////////////////////////////

    // 新建片段
    handleCreate() {
      this.$store.dispatch("Contents/addArticle");
    },

    // 文件目录选择
    handleFoldChange(fold) {
      this.$store.dispatch("Contents/setEditArticle", null);
      this.$store.dispatch("Contents/setActiveFold", fold);
    },

    // 菜单事件监听
    handleMenuDropdownClick(name) {
      // 新建片段
      if (name === "addArticle") {
        this.$store.dispatch("Contents/addArticle");
        this.$store.dispatch("Contents/setEditArticle", this.articles[0]);
        return;
      }

      // 退出应用
      if (name === "quite") {
        ipcRenderer.send("window-close");
        return;
      }
    },

    // 验证文件夹访问密码
    checkActiveFoldPassword(password) {
      if (password === this.foldActiveData.password) {
        this.$store.dispatch("Contents/unlockActiveFold");
        this.$Message.success("解锁成功!");
      } else {
        this.$Message.error("密码错误，请重新输入!");
      }
    },

    // 语言标签可查看文章
    handleLangChange(item) {
      let lang = item.title;

      this.$store.dispatch("Contents/setEditArticle", null);

      if (lang === "All") {
        this.allArticles = [...this.articles];
        return;
      }

      this.allArticles = [...this.articles].filter(
        article => article.lang === lang
      );
    },

    // 删除标签
    handleTagDelete(index, tag) {
      this.$store.dispatch("Contents/deleteTag", tag.uuid);
    }
  },
  mounted() {
    // 响应窗口尺寸变化
    ipcRenderer.on("window-toggle", (e, isMaximized) => {
      this.maximize = isMaximized ? true : false;
    });

    // 初始化用户数据存储位置
    ipcRenderer.send("get-user-data-path");
    ipcRenderer.on("get-user-data-path", (e, userDataPath) => {
      this.$store.dispatch("Contents/setPathUserData", userDataPath);
    });

    // 初始化高亮目录

    // 获取全部文章
    this.allArticles = [...this.articles];
  }
};
</script>

<style lang="less">
@import "./styles/app.less";
</style>
