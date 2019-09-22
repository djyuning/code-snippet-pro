// 偏好
export default {
  namespaced: true,

  state: {
    // 预设值主题
    themes: [{
        value: 'default',
        title: '默认',
        enabled: true,
      },
      {
        value: 'light',
        title: '亮色',
        enabled: false,
      },
      {
        value: 'dark',
        title: '暗色',
        enabled: false,
      },
      {
        value: 'atom',
        title: 'Atom',
        enabled: false,
      },
    ],

    // 界面主题
    theme: "default",

    // 代码视图主题
    codeTheme: "default",

    // 代码字体
    codeFontFamily: "Consolas,Menlo,Courier,monospace",

    // 字号
    codeFontSize: 12,

    // 自动换行
    wordWrap: false,

    // 显示行号
    lineNumber: true,

    // 自动保存
    autoSave: true,

    // 自动保存间隔
    autoSaveInterval: 5
  },

  mutations: {

    setTheme(state, theme) {
      state.theme = theme;
    },

    setCodeTheme(state, theme) {
      state.codeTheme = theme;
    },

    setCodeFontFamily(state, family) {
      state.codeFontFamily = family || 'Consolas,Menlo,Courier,monospace';
    },

    setCodeFontSize(state, size) {
      state.codeFontSize = parseInt(size, 10) || 12;
    },

    setWordWrap(state, wrap) {
      state.wordWrap = wrap;
    },

    setLineNumber(state, visible) {
      state.lineNumber = visible;
    },

    setAutoSave(state, status) {
      state.autoSave = status;
    },

    setAutoSaveInterval(state, interval) {
      state.autoSaveInterval = parseInt(interval, 10) || 5;
    },

  },

  actions: {
    setTheme(context, theme) {
      context.commit('setTheme', theme);
    },

    setCodeTheme(context, theme) {
      context.commit('setCodeTheme', theme);
    },

    setCodeFontFamily(context, family) {
      context.commit('setCodeFontFamily', family);
    },

    setCodeFontSize(context, size) {
      context.commit('setCodeFontSize', size);
    },

    setWordWrap(context, wrap) {
      context.commit('setWordWrap', wrap);
    },

    setLineNumber(context, visible) {
      context.commit('setLineNumber', visible);
    },

    setAutoSave(context, status) {
      context.commit('setAutoSave', status);
    },

    setAutoSaveInterval(context, interval) {
      context.commit('setAutoSaveInterval', interval);
    }
  }

};