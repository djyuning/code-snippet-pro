const fs = require("fs");
const path = require("path");

export default {
  namespaced: true,

  state: {
    resourceSideCollapsed: false, // 边栏是否已收起
    listSideCollapsed: false, // 列表栏是否已收起
  },

  mutations: {

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

    toggleResourceSide(context, status) {
      context.commit('toggleResourceSide', status);
    },

    toggleListSide(context) {
      context.commit('toggleListSide', status);
    },

  }

};