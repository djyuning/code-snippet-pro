// http://eslint.org/docs/user-guide/configuring
module.exports = {
  // 将 ESLint 限制到一个特定的项目，在配置文件里设置 "root": true。ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true,

  // 检测 ES6 代码
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  // 消除 no-undef 影响
  globals: {
    _: true
  },

  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended'
  ],

  // add your custom rules here
  // 0或’off’：关闭规则。
  // 1或’warn’：打开规则，并且作为一个警告（并不会导致检查不通过）。
  // 2或’error’：打开规则，并且作为一个错误 (退出码为1，检查不通过)。

  // 参数说明：
  // 参数1 ： 错误等级
  // 参数2 ： 处理方式
  'rules': {
    'prefer-promise-reject-errors': 0,
    'space-unary-ops': 0,
    'no-unused-expressions': 0,
    'no-useless-return': 0,
    'standard/no-callback-literal': 0,
    'import/first': 0,
    'import/export': 0,
    'no-mixed-operators': 0,
    'no-use-before-define': 0,
    // 允许使用分号
    'semi': [0, 'never'],
    // 允许使用==
    'eqeqeq': 0,
    // 缩进使用不做限制
    'indent': 0,
    // 允许使用 tab
    'no-tabs': 0,
    // 函数圆括号之前是否保留空格
    'space-before-function-paren': [2, "always"],
    // 不要求块内空格填充格式
    'padded-blocks': 0,
    // 不限制变量一起声明
    'one-var': 0,
    // debugger使用
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 开发模式允许使用console
    'no-console': 0,
    // 条件语句中复制操作符需要用圆括号括起来
    'no-cond-assign': [2, 'except-parens'],
    // 允许使用条件表达式使用常量
    'no-constant-condition': 0,
    // 单行可忽略大括号，多行不可忽略
    'curly': [2, 'multi-line'],
    // 不允许使用 var 变量
    'no-var': 2,
    // 不允许出现多个空格
    'no-multi-spaces': ["error", {
      ignoreEOLComments: true
    }],
    'camelcase': 0,
    // 对象字面量的键值空格风格
    'key-spacing': 2,
    // if 语句包含一个 return 语句， else 就多余
    'no-else-return': 2,
    // 建议将经常出现的数字提取为变量
    'no-magic-numbers': [0, {
      ignoreArrayIndexes: true
    }],
    // 不允许重复声明变量
    'no-redeclare': [2, {
      builtinGlobals: true
    }],
    // 立即执行函数风格
    'wrap-iife': [2, 'inside'],
    // 不允许圆括号中出现空格
    'space-in-parens': [2, 'never'],
    // 确保运算符周围有空格
    'space-infix-ops': 2,
    // 强制点号与属性同一行
    'dot-location': [2, 'property'],
    // 强制单行代码使用空格
    'block-spacing': [2, 'always'],
    // 约束 for-in 使用 hasOwnProperty 判断
    'guard-for-in': 0,
    // 采用 one true brace style 大括号风格
    'brace-style': [2, '1tbs', {
      'allowSingleLine': true
    }],
    // 统一逗号周围空格风格
    'comma-spacing': [2, {
      'before': false,
      'after': true
    }],
    // 禁止出现多个空行
    'no-multiple-empty-lines': [2, {
      'max': 1,
      'maxEOF': 2
    }],
    // 允许箭头函数不使用圆括号
    'arrow-parens': 0,
    // 规范 generator 函数的使用
    'generator-star-spacing': [2, {
      'before': false,
      'after': true
    }],
    // 注释附近的换行
    'lines-around-comment': [2, {
      'beforeBlockComment': false,
      'afterBlockComment': false,
      'beforeLineComment': false,
      'afterLineComment': false
    }],
    // 换行风格
    'linebreak-style': [0, 'error', 'windows'],

    // Vue 规则，更多参考：https://eslint.vuejs.org/rules
    // 自闭和标签
    "vue/html-self-closing": ["error", {
      "svg": "always",
      "math": "always",
      "img": "any",
    }],
    // 存在多个属性时换行展示
    "vue/max-attributes-per-line": ["error", {
      "singleline": 1,
      "multiline": {
        "max": 1, // 每行最多显示多少个属性
        "allowFirstLine": true, // 第一个属性不需要换行
      }
    }]
  }
}