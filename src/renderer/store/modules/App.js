export default {
  namespaced: true,

  state: {
    // 代码主题风格
    codeTheme: 'default'
  },

  getter: {

    codeTheme: state => state.codeTheme

  },

  mutations: {
    setCodeTheme(state, theme) {
      state.codeTheme = theme;
    }
  },

  actions: {
    setCodeTheme(context, theme) {
      context.commit('setCodeTheme', theme);
    }
  }

};