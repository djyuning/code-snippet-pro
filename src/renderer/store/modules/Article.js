// 文章
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

// 文章加密密钥
const secret = 'com.tperiod.com';

// 读取指定目录下的全部文章
const eachArticlesInFold = (store, fold) => {
  // 获取高亮目录下的所有文章
  let _fold = path.join(store.state.App.pathAppData, fold.uuid);

  // 检测目录是否存在，不存在则创建，下次访问即可存在
  if (!fs.existsSync(_fold)) {
    fs.mkdirSync(_fold, "0775", error => {
      console.error(error);
    });
    console.warning(`目录 ${fold.title} 不存在，已自动创建！`);
  }

  // 遍历文件
  const files = fs.readdirSync(_fold, error => {
    if (error) {
      console.error(error);
      return [];
    }
  });

  if (!files.length) return [];

  // 遍历文件
  let articles = [];

  files.forEach(file => {
    if (/^\./.test(file)) return;
    let _file = path.join(_fold, file);
    let stat = fs.statSync(_file);

    if (!stat.isFile()) return;

    let content = fs.readFileSync(_file, error => {
      if (error) {
        console.error(error);
        return;
      }
    });

    if (!content) return;

    // 解密文件内容
    try {
      let encContent = CryptoJS.AES.decrypt(content.toString(), secret).toString(CryptoJS.enc.Utf8);
      if (!encContent) return;
      articles.push(JSON.parse(encContent));
    } catch (error) {
      console.error(error);
    }
  });

  return articles.sort((a, b) => moment(a.updateAt).isBefore(b.updateAt));
};

export default {
  namespaced: true,

  state: {
    articles: [], // 全部代码片段，会递归目录，并按照最后更新时间倒序排列
    activeArticles: [], // 高亮目录下的全部文章
    editArticle: null, // 正在编辑的文章
  },

  mutations: {

    // 设置正在编辑的文章
    setEditArticle(state, article) {
      state.editArticle = article;
      if (Object.prototype.toString.call(article) === '[object Object]') {
        this.dispatch('Fold/setActiveFold', this.state.Fold.folds.find(fold => fold.uuid === article.fold));
      }
    },

    // 遍历目录下的所有文章
    eachArticles(state) {
      state.articles.splice(0);

      // 递归处理
      const _each = (_path) => {
        let articles = [];

        // 读取当前目录
        let files = fs.readdirSync(_path, error => {
          if (error) {
            console.error(error);
            return;
          }
        });

        if (!files.length) return [];

        // 获取文件的状态
        files.forEach(file => {
          if (/^\./.test(file)) return;

          let filePath = path.join(_path, file);
          let stat = fs.statSync(filePath);

          // 如果是文件，则压入数组
          if (stat.isFile(filePath)) {
            // 读取文件内容
            let content = fs.readFileSync(filePath, error => {
              if (error) {
                console.error(error);
              }
            });

            // 解密文件内容
            try {
              let encContent = CryptoJS.AES.decrypt(content.toString(), secret).toString(CryptoJS.enc.Utf8);
              if (!encContent) return;
              articles.push(JSON.parse(encContent));
            } catch (error) {
              console.error(error);
            }
          }

          // 如果是目录，则继续递归处理
          if (stat.isDirectory(filePath)) {
            articles = articles.concat(_each(filePath));
          }
        });

        return articles;
      }

      state.articles = _each(this.state.App.pathAppData);
    },

    // 读取指定目录下的全部文章
    eachArticlesInFold(state, fold) {
      // 清空状态中的文章
      state.activeArticles.splice(0);

      // 递归获取当前目录的全部子菜单
      let folds = [];

      const _eachFolds = function (_fold) {
        folds.push(_fold);
        if (_fold.hasOwnProperty('child')) {
          _fold['child'].forEach(_subFold => {
            _eachFolds(_subFold);
          });
        }
      };

      _eachFolds(fold);

      // 获取全部文章
      let articles = [];

      folds.forEach(_fold => {
        articles.push(...eachArticlesInFold(this, _fold));
      });

      if (!articles.length) return;
      // 更新状态，文件会按最后更新时间倒序排列
      state.activeArticles = articles;
    },

    // 新增文章
    addArticle(state, article) {
      let targetFold = this.state.Fold.active || this.state.Fold.default;
      let targetPath = path.join(this.state.App.pathAppData, targetFold.uuid);

      // 目录不存在时，创建目录
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, "0775", error => {
          if (error) {
            console.error(error);
          }
        });
      }

      // 默认以当前时间为标题
      let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let uuid = uuidv1();

      // 合并属性
      article = {
        ...ARTICLE,
        ...{
          uuid, // 生成随机 ID
          fold: targetFold.uuid,
          title: now,
          createAt: now,
          updateAt: now,
        },
        ...article
      };

      // 创建文档数据
      const filePath = path.join(targetPath, uuid);

      // 创建二进制流
      const buffer = new Buffer.from(JSON.stringify(article), 'utf8');

      // 写入文件
      fs.writeFileSync(filePath, CryptoJS.AES.encrypt(buffer.toString(), secret), error => {
        if (error) {
          console.error(error);
        }
      });

      // 设置高亮文章
      this.dispatch('Article/setEditArticle', article);
      // 重新获取全部文章
      this.dispatch('Article/eachArticles');
      // 读取目录下的文章
      this.dispatch('Article/eachArticlesInFold', targetFold);
    },

    // 更新文章
    updateArticle(state, article) {
      // 获取所在目录
      let fold = this.state.Fold.folds.find(_fold => _fold.uuid === article.fold);

      article = {
        ...ARTICLE,
        ...{
          updateAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        },
        ...article
      };

      // 更新文章
      let _file = path.join(this.state.App.pathAppData, article.fold, article.uuid);

      const buffer = new Buffer.from(JSON.stringify(article), 'utf8');

      // 写入文件
      fs.writeFileSync(_file, CryptoJS.AES.encrypt(buffer.toString(), secret), error => {
        if (error) {
          console.error(error);
          Message.error(error || '更新失败！');
          return;
        }
      });

      // 重新获取全部文章
      this.dispatch('Article/eachArticles');
      // 读取目录下的文章
      this.dispatch('Article/eachArticlesInFold', fold);
    },

    // 删除文章
    deleteArticle(state, article) {
      // 获取所在目录
      let fold = this.state.Fold.folds.find(_fold => _fold.uuid === article.fold);

      // 切换高亮
      if (state.editArticle && state.editArticle.uuid === uuid) {
        this.dispatch('Article/setEditArticle', null);
      }

      // 删除硬盘中的目录
      const articlePath = path.join(this.state.App.pathAppData, article.fold, article.uuid);
      if (fs.existsSync(articlePath) && fs.statSync(articlePath).isFile) {
        fs.unlink(articlePath, error => {
          if (error) {
            console.error(error);
            Message.error(error);
            return;
          }
          Message.success('删除成功！');
        });
      }

      this.dispatch('Article/eachArticles');
      this.dispatch('Article/eachArticlesInFold', fold);
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
        return Message.error('无效的操作，文章不存在！');
      }

      if (!options.target || !options.target.uuid) {
        return Message.error('无效的操作，目标文件夹不存在！');
      }

      // 获取目录地址
      let pathAppData = this.state.App.pathAppData;
      let targetPath = path.join(pathAppData, options.target.uuid);
      let articlePath = path.join(pathAppData, options.article.fold, options.article.uuid);
      let distPath = path.join(pathAppData, options.target.uuid, options.article.uuid);
      let oldFold = this.state.Fold.folds.find(fold => fold.uuid === options.article.fold);

      // 目录不存在
      if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
        console.log(articlePath);
        return Message.error('无效的操作，目标文件夹不存在！');
      }

      // 文章不存在
      if (!fs.existsSync(articlePath) || !fs.statSync(articlePath).isFile()) {
        console.log(articlePath);
        return Message.error('无效的操作，文章不存在！');
      }

      // 解密文件内容
      try {
        // 修改文章的 fold 属性
        let content = fs.readFileSync(articlePath, error => {
          if (error) {
            console.error(error);
            Message.error(error || '移动失败！');
            return;
          }
        });

        if (!content) {
          Message.error(error || '移动失败，文章不存在！');
          return;
        }

        let encContent = CryptoJS.AES.decrypt(content.toString(), secret).toString(CryptoJS.enc.Utf8);

        encContent = JSON.parse(encContent);

        encContent.fold = options.target.uuid;

        // 创建二进制流
        const buffer = new Buffer.from(JSON.stringify(encContent), 'utf8');

        // 写入文件
        fs.writeFileSync(distPath, CryptoJS.AES.encrypt(buffer.toString(), secret), error => {
          if (error) {
            console.error(error);
            Message.error('移动失败！');
            return;
          }
          Message.success('移动成功！');
        });

        // 删除源文件
        fs.unlink(articlePath, error => {
          if (error) {
            console.error(error);
          }
        });

        // 刷新当前目录
        this.dispatch('Article/eachArticlesInFold', oldFold);
      } catch (error) {
        console.error(error);
        Message.success(error || '移动失败！');
      }
    },
  },

  actions: {

    setEditArticle(context, article) {
      context.commit('setEditArticle', article);
    },

    eachArticles(context) {
      context.commit('eachArticles');
    },

    eachArticlesInFold(context, fold) {
      context.commit('eachArticlesInFold', fold);
    },

    moveArticleToFold(context, options) {
      context.commit('moveArticleToFold', options);
    },

    addArticle(context, article) {
      context.commit('addArticle', article);
    },

    updateArticle(context, article) {
      context.commit('updateArticle', article);
    },

    deleteArticle(context, uuid) {
      context.commit('deleteArticle', uuid);
    },

  }

};