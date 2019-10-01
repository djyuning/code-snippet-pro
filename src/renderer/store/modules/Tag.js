// 文章
import uuidv1 from "uuid/v1";
import moment from "moment";
import Message from 'iview/src/components/message';

export default {
  namespaced: true,

  state: {
    tags: [], // 标签
  },

  mutations: {

    // 新增标签
    addTag(state, tag) {
      let title = (tag.title || '').replace(/(^\s+)|(\s+$)/g, '');
      if (!title) return;
      tag.title = title;

      // 标签不允许重复
      let extend = state.tags.find(t => t.title === title);
      if (extend) {
        Message.warning('标签已存在！');
        return;
      }

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

    // 删除标签
    deleteTag(state, tag) {
      let index = state.tags.findIndex(tag => tag.uuid === tag.uuid);
      if (index === -1) return;
      state.tags.splice(index, 1);
    },

  },

  actions: {

    addTag(context, tag) {
      context.commit('addTag', tag);
    },

    deleteTag(context, tag) {
      context.commit('deleteTag', tag);
    },

  }

};