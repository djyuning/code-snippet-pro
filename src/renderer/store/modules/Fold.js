// 文章
import uuidv1 from "uuid/v1";
import moment from "moment";
import Message from 'iview/src/components/message';

const fs = require("fs");
const path = require("path");

// 默认目录
const DEFAULT_FOLD = {
  uuid: 'default', // 默认目录
  parent: "0", // 上级目录
  title: "默认目录", // 名称
  remark: "默认目录，不可删除，不可编辑", // 备注
  icon: "ios-folder", // 图标
  passwordEnable: false, // 启用访问密码
  password: "", // 访问密码
  passwordTips: "", // 密码提示
  color: "#000000" // 颜色表示
};

export default {
  namespaced: true,

  state: {
    folds: [DEFAULT_FOLD], // 全部目录
    default: DEFAULT_FOLD, // 默认目录，只读
    active: DEFAULT_FOLD, // 高亮的目录
    unlocked: [], // 允许访问的目录，应用退出时，清空该目录
  },

  mutations: {

    // 新增目录
    addFold(state, fold) {
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

      // 创建对应的目录
      const foldPath = path.join(this.state.App.pathAppData, fold.uuid);

      if (fs.existsSync(foldPath)) {
        Message.error('创建失败，目录已存在！');
        return;
      }

      fs.mkdirSync(foldPath, "0775", error => {
        if (error) {
          console.error(error);
          Message.error(error || '创建失败！');
          return;
        }
      });

      // 追加到缓存
      state.folds.push(fold);

      // 高亮
      this.dispatch('Fold/setActiveFold', fold);
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

      // 更新缓存
      state.folds.splice(index, 1, fold);
    },

    // 删除目录
    deleteFold(state, uuid) {
      let index = state.folds.findIndex(fold => fold.uuid === uuid);
      if (index === -1) return;

      // 如果当前文件夹为高亮，则切换到默认文件夹
      if (state.foldActive === uuid) {
        this.dispatch('Fold/setActiveFold', DEFAULT_FOLD);
      }

      // 从状态中删除
      state.folds.splice(index, 1);

      // 删除硬盘中的目录
      let fold = path.join(state.App.pathAppData, uuid);
      fs.rmdir(fold, error => {
        if (error) {
          console.error(error);
          Message.error(error);
          return;
        }
        Message.success('删除成功！');
      });
    },

    // 设置高亮目录
    setActiveFold(state, fold) {
      if (!fold) return;
      if (state.active.uuid === fold.uuid) return;
      state.active = fold;
      if (!fold) return;
      // 读取目录下的文章
      this.dispatch('Article/eachArticlesInFold', fold);
    },

    // 追加解锁的文件夹
    updateUnlocked(state, fold) {
      if (!fold || fold === undefined || fold === '') {
        state.Fold.unlocked.splice(0);
        return;
      }
      state.Fold.unlocked.push(fold);
    },

  },

  actions: {

    addFold(context, fold) {
      context.commit('addFold', fold);
    },

    updateFold(context, fold) {
      context.commit('updateFold', fold);
    },

    deleteFold(context, uuid) {
      context.commit('deleteFold', uuid);
    },

    setActiveFold(context, fold) {
      context.commit('setActiveFold', fold);
    },

    updateUnlocked(context, fold) {
      context.commit('updateUnlocked', fold);
    },

  }

};