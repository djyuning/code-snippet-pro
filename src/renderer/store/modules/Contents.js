/**
 * 内容管理
 * 
 * 所有的内容使用 vuex 来管理，在任何组件都可以读取这些状态；
 */
import uuidv1 from "uuid/v1";
import moment from "moment";
import Message from 'iview/src/components/message';

const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");

// 文章基本属性
const ARTICLE = {
  title: null,
  lang: 'Markdown',
  category: null,
  tags: [],
  createAt: null,
  updateAt: null,
};

// 默认目录
const DEFAULT_FOLD = {
  uuid: 'default', // 默认目录
  parent: "0", // 上级目录
  title: "默认目录", // 名称
  remark: "默认目录，不可删除，仅可编辑部分信息", // 备注
  icon: "ios-folder", // 图标
  passwordEnable: false, // 启用访问密码
  password: "", // 访问密码
  passwordTips: "", // 密码提示
  color: "#000000" // 颜色表示
};

// 文章加密密钥
const secret = 'com.tperiod.com';

export default {
  namespaced: true,

  state: {
    editArticle: null, // 正在编辑的文章
    articles: [], // 代码片段
    folds: [DEFAULT_FOLD], // 目录
    foldDefault: DEFAULT_FOLD, // 默认目录，只读
    foldActive: DEFAULT_FOLD.uuid, // 高亮的目录
    foldActiveData: DEFAULT_FOLD,
    foldActiveLock: false,
    tags: [], // 标签
    pathUserData: null, // 用户数据存储目录
    appCachePath: null, // 应用缓存目录
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
      let uuid = uuidv1();

      // 合并属性
      article = {
        ...ARTICLE,
        ...{
          uuid, // 生成随机 ID
          title: now,
          createAt: now,
          updateAt: now,
        },
        ...article
      };

      // 创建文档数据
      const filePath = path.join(state.appCachePath, state.foldActive, uuid);

      // 创建二进制流
      const buffer = new Buffer.from(JSON.stringify(article), 'utf8');

      // 写入文件
      fs.writeFileSync(filePath, CryptoJS.AES.encrypt(buffer.toString(), secret), error => {
        console.error(error);
      });

      // 设置高亮文章
      this.dispatch('Contents/setEditArticle', article);

      // 读取目录下的文章
      this.dispatch('Contents/readArticlesByFoldID', state.foldActive);
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

      // 更新文章
      let _file = path.join(state.appCachePath, state.foldActive, article.uuid);

      const buffer = new Buffer.from(JSON.stringify(article), 'utf8');

      // 写入文件
      fs.writeFileSync(_file, CryptoJS.AES.encrypt(buffer.toString(), secret), error => {
        console.error(error);
      });

      state.articles.splice(index, 1, article);
    },

    // 删除文章
    deleteArticle(state, uuid) {
      let index = state.articles.findIndex(item => item.uuid === uuid);
      if (index === -1) return;

      // 从状态中删除文章
      state.articles.splice(index, 1);

      // 切换高亮
      if (state.editArticle && state.editArticle.uuid === uuid) {
        this.dispatch('Contents/setEditArticle', state.articles.length ? state.articles[0] : null);
      }

      // 删除硬盘中的目录
      const article = path.join(state.appCachePath, state.foldActive, uuid);
      const stat = fs.statSync(article, error => {
        console.error(error);
      });
      if (fs.existsSync(article) && stat && stat.isFile) {
        fs.unlink(article, error => {
          if (error) {
            console.error(error);
            Message.error(error);
            return;
          }
          Message.success('删除成功！');
        });
      }
    },

    // 移动文章到指定目录
    moveArticleToFold(state, options) {
      if (!options || Object.prototype.toString.call(options) !== '[object Object]') {
        return Message.error('无效的操作！');
      }

      options = Object.assign({}, {
        article: null, // 操作的文章
        target: null, // 目标文件夹
      }, options);

      if (!options.article || !options.article.uuid) {
        return Message.error('无效的操作，移动的文章不存在！');
      }

      if (!options.target || !options.target.uuid) {
        return Message.error('无效的操作，目标文件夹不存在！');
      }

      // 获取目录地址
      let targetPath = path.join(state.appCachePath, options.target.uuid);
      let articlePath = path.join(state.appCachePath, state.foldActive, options.article.uuid);

      // 目录不存在
      let targetStat = fs.statSync(targetPath);
      if (!targetStat || !targetStat.isDirectory) {
        return Message.error('无效的操作，目标文件夹不存在！');
      }

      // 文章不存在
      let articleStat = fs.statSync(articlePath);
      if (!articleStat || !articleStat.isFile) {
        return Message.error('无效的操作，移动的文章不存在！');
      }

      // 移动文件
      fs.copyFile(articlePath, path.join(targetPath, options.article.uuid), error => {
        if (error) {
          return Message.error(error || '移动失败！');
        }

        // 删除源文件
        fs.unlink(articlePath);

        // 刷新当前目录
        this.dispatch('Contents/readArticlesByFoldID', state.foldActive);

        Message.success('移动成功！');
      });
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

      // 创建对应的目录
      if (!fs.existsSync(state.appCachePath)) {
        console.error("用户缓存数据目录不存在");
        return;
      } else {
        // 创建目录
        const foldPath = path.join(state.appCachePath, "/", fold.uuid);

        fs.mkdirSync(foldPath, "0775", error => {
          console.error(error);
        });

        // 追加到缓存
        state.folds.push(fold);

        // 高亮
        this.dispatch('Contents/setActiveFold', fold);
      }
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
        this.dispatch('Contents/setActiveFold', DEFAULT_FOLD);
      }

      // 从状态中删除
      state.folds.splice(index, 1);

      // 删除硬盘中的目录
      const fold = path.join(state.appCachePath, "/", uuid);
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
      // 高亮文件夹
      state.foldActive = fold.uuid;
      state.foldActiveData = fold;
      state.foldActiveLock = fold.passwordEnable;

      // 读取目录下的文章
      this.dispatch('Contents/readArticlesByFoldID', fold.uuid);
    },

    // 读取指定目录下的全部文章，并更到 articles 列表
    readArticlesByFoldID(state, uuid) {
      // 清空状态中的文章
      state.articles.splice(0);

      // 需要输入目录密码
      if (state.foldActiveLock) {
        return;
      }

      // 获取高亮目录下的所有文章
      let _cacheFoldPath = path.join(state.appCachePath, uuid);

      // 读取文件
      if (!fs.existsSync(_cacheFoldPath)) {
        // 创建目录，下次访问即可存在
        fs.mkdirSync(_cacheFoldPath, "0775", error => {
          console.error(error);
        });
        console.warning(`目录 ${fold.title} 不存在，应用已自动创建！`);
      }

      // 遍历文件
      const files = fs.readdirSync(_cacheFoldPath, error => {
        console.error(error);
      });

      // 遍历文件
      let articles = [];
      files.forEach(file => {
        let _file = path.join(state.appCachePath, uuid, file);

        // 读取文件内容
        let content = fs.readFileSync(_file, error => {
          console.error(error);
        });

        // 解密文件内容
        try {
          let encContent = CryptoJS.AES.decrypt(content.toString(), secret).toString(CryptoJS.enc.Utf8);
          articles.push(JSON.parse(encContent));
        } catch (error) {
          console.error(error);
        }
      });

      // 更新状态
      state.articles = articles.sort((a, b) => moment(a.updateAt).isBefore(b.updateAt));
    },

    // 解锁目录
    unlockActiveFold(state) {
      // 解锁目录
      state.foldActiveLock = false;
      // 读取目录下的文章
      this.dispatch('Contents/readArticlesByFoldID', state.foldActive);
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

    // 删除标签
    deleteTag(state, uuid) {
      let index = state.tags.findIndex(tag => tag.uuid === uuid);
      if (index === -1) return;
      state.tags.splice(index, 1);
    },

    /////////////////////////////////////////////

    setPathUserData(state, userDataPath) {
      state.pathUserData = userDataPath;

      // 初始化自定义数据目录
      const appCachePath = path.join(userDataPath, "/CodeSnippetStore");
      if (!fs.existsSync(appCachePath)) {
        // 创建数据缓存目录
        fs.mkdirSync(appCachePath, '0775', error => {
          console.error(error);
        });
      }

      state.appCachePath = appCachePath;
    }

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

    moveArticleToFold(context, options) {
      context.commit('moveArticleToFold', options);
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

    setActiveFold(context, fold) {
      context.commit('setActiveFold', fold);
    },

    readArticlesByFoldID(context, uuid) {
      context.commit('readArticlesByFoldID', uuid);
    },

    unlockActiveFold(context) {
      context.commit('unlockActiveFold');
    },

    /////////////////////////////////////////////

    addTag(context, tag) {
      context.commit('addTag', tag);
    },

    deleteTag(context, uuid) {
      context.commit('deleteTag', uuid);
    },

    /////////////////////////////////////////////

    setPathUserData(context, userDataPath) {
      context.commit('setPathUserData', userDataPath);
    }

  }

}