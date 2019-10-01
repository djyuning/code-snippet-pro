const fs = require("fs");
const path = require("path");

export default {
  namespaced: true,

  state: {
    pathUserData: null, // 用户数据存储目录
    pathAppData: null, // 应用缓存目录
    pathDownload: null, // 用户下载目录
    resourceSideCollapsed: false, // 边栏是否已收起
    listSideCollapsed: false, // 列表栏是否已收起
  },

  mutations: {

    setPathUserData(state, userDataPath) {
      state.pathUserData = userDataPath;

      // 初始化数据目录时，会同步初始化应用数据目录
      const pathAppData = path.join(userDataPath, "CodeSnippetStore");
      if (!fs.existsSync(pathAppData)) {
        // 创建数据缓存目录
        fs.mkdirSync(pathAppData, '0775', error => {
          console.error(error);
        });
      }

      state.pathAppData = pathAppData;
    },

    setPathDownload(state, downloadPath) {
      state.pathDownload = downloadPath;
    },

    // 展开/收起边栏
    toggleResourceSide(state, status) {
      if (status === undefined || status === '') {
        state.resourceSideCollapsed = !state.resourceSideCollapsed;
        return;
      }
      state.resourceSideCollapsed = !!status;
    },

    // 展开/收起列表栏
    toggleListSide(state, status) {
      if (status === undefined || status === '') {
        state.listSideCollapsed = !state.listSideCollapsed;
        return;
      }
      state.listSideCollapsed = !!status;
    },

  },

  actions: {

    setPathUserData(context, userDataPath) {
      context.commit('setPathUserData', userDataPath);
    },

    setPathDownload(context, downloadPath) {
      context.commit('setPathDownload', downloadPath);
    },

    toggleResourceSide(context, status) {
      context.commit('toggleResourceSide', status);
    },

    toggleListSide(context) {
      context.commit('toggleListSide', status);
    },

  }

};