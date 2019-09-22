/**
 * 内容管理
 * 
 * 所有的内容使用 vuex 来管理，在任何组件都可以读取这些状态；
 */
import uuidv1 from "uuid/v1";
import moment from "moment";

// 文章基本属性
const ARTICLE = {
  id: null,
  title: null,
  lang: 'Markdown',
  category: null,
  tags: [],
  createAt: null,
  updateAt: null,
};

export default {
  namespaced: true,

  state: {
    editArticle: null, // 正在编辑的文章
    articles: [], // 代码片段
    folds: [{
      uuid: 'default', // 默认目录
      parent: "0", // 上级目录
      title: "默认目录", // 名称
      remark: "默认目录，不可删除，仅可编辑部分信息", // 备注
      icon: "ios-folder", // 图标
      passwordEnable: false, // 启用访问密码
      password: "", // 访问密码
      passwordTips: "", // 密码提示
      color: "#000000" // 颜色表示
    }], // 目录
    tags: [], // 标签
  },

  mutations: {

    // 设置正在编辑的文章
    setEditArticle(state, article) {
      state.editArticle = article;
    },


    /////////////////////////////////////////////

    // 新增文章
    addArticle(state, article) {
      // 默认以当前时间为标题
      let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

      // 合并属性
      article = {
        ...ARTICLE,
        ...{
          uuid: uuidv1(), // 生成随机 ID
          title: now,
          createAt: now,
          updateAt: now,
        },
        ...article
      };

      // 前置插入数据
      state.articles.splice(0, 0, article);
    },

    // 更新文章
    updateArticle(state, article) {
      let index = state.articles.findIndex(item => item.uuid === article.uuid);
      if (index === -1) return;

      article = {
        ...ARTICLE,
        ...{
          updateAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        },
        ...article
      };

      state.articles.splice(index, 1, article);
    },

    // 删除文章
    deleteArticle(state, uuid) {
      let index = state.articles.findIndex(item => item.uuid === uuid);
      if (index === -1) return;
      state.articles.splice(index, 1);
    },

    /////////////////////////////////////////////

    // 新增目录
    addFold(state, fold) {
      // 处理必要数据
      let title = (fold.title || '').replace(/(^\s+)|(\s+$)/g, '');
      if (!title) return;
      fold.title = title;

      // 添加时间标识
      let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

      // 合并属性
      fold = {
        ...{
          uuid: uuidv1(), // 生成随机 ID
          createAt: now,
          updateAt: now,
        },
        ...fold
      };

      state.folds.push(fold);
    },

    // 更新目录
    updateFold(state, fold) {
      let index = state.folds.findIndex(item => item.uuid === fold.uuid);
      if (index === -1) return;
      fold = {
        ...fold,
        ...{
          updateAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
      };
      state.folds.splice(index, 1, fold);
    },

    // 删除目录
    deleteFold(state, uuid) {
      let index = state.folds.findIndex(fold => fold.uuid === uuid);
      if (index === -1) return;
      state.folds.splice(index, 1);
    },

    /////////////////////////////////////////////

    // 新增标签
    addTag(state, tag) {
      // 处理必要数据
      let title = (tag.title || '').replace(/(^\s+)|(\s+$)/g, '');
      if (!title) return;
      tag.title = title;

      // 标签不允许重复
      let extend = state.tags.find(t => t.title === title);
      if (extend) return;

      // 添加时间标识
      let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

      // 合并属性
      tag = {
        ...{
          uuid: uuidv1(), // 生成随机 ID
          createAt: now,
          updateAt: now,
        },
        ...tag
      };

      state.tags.push(tag);
    },

    // 更新标签
    updateTag(state, tag) {
      let index = state.tag.findIndex(item => item.uuid === tag.uuid);
      if (index === -1) return;
      tag = {
        ...tag,
        ...{
          updateAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
      };
      state.tag.splice(index, 1, tag);
    },

    // 删除标签
    deleteTag(state, uuid) {
      let index = state.folds.findIndex(fold => fold.uuid === uuid);
      if (index === -1) return;
      state.tags.splice(index, 1);
    },

  },

  actions: {

    setEditArticle(context, article) {
      context.commit('setEditArticle', article);
    },

    /////////////////////////////////////////////

    addArticle(context, article) {
      context.commit('addArticle', article);
    },

    updateArticle(context, article) {
      context.commit('updateArticle', article);
    },

    deleteArticle(context, uuid) {
      context.commit('deleteArticle', uuid);
    },

    /////////////////////////////////////////////

    addFold(context, fold) {
      context.commit('addFold', fold);
    },

    updateFold(context, fold) {
      context.commit('updateFold', fold);
    },

    deleteFold(context, uuid) {
      context.commit('deleteFold', uuid);
    },

    /////////////////////////////////////////////

    addTag(context, tag) {
      context.commit('addTag', tag);
    },

    updateTag(context, tag) {
      context.commit('updateTag', tag);
    },

    deleteTag(context, uuid) {
      context.commit('deleteTag', uuid);
    },

  }

}