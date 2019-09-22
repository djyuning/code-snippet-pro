<template>
  <Modal v-model="modal" title="偏好" width="640" footer-hide>
    <div class="settings-tab">
      <ul>
        <li :class="{current: tab === 'basic'}" @click="tab = 'basic'">
          <span>全局</span>
        </li>
        <li :class="{current: tab === 'codeTheme'}" @click="tab = 'codeTheme'">
          <span>代码风格</span>
        </li>
      </ul>
    </div>
    <div class="settings-tab-content">
      <!-- 全局设置 -->
      <div v-if="tab === 'basic'" class="form-wrap">
        <Form class="form" ref="form" :label-width="120">
          <FormItem label="界面主题" prop="theme">
            <RadioGroup v-model="form.theme" @on-change="handleThemeChange">
              <Radio
                v-for="(item, index) in form.themes"
                :key="index"
                :label="item.value"
                :disabled="!item.enabled"
              >{{ item.title }}</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="代码字体" prop="codeFontFamily">
            <Input
              v-model="form.codeFontFamily"
              placeholder="Consolas,Menlo,Courier,monospace"
              @on-change="handleCodeFontFamilyChange"
            ></Input>
          </FormItem>

          <FormItem label="代码字号" prop="codeFontSize">
            <Input
              v-model="form.codeFontSize"
              placeholder="14"
              @on-change="handleCodeFontSizeChange"
            >
              <span slot="append">px</span>
            </Input>
          </FormItem>

          <FormItem label="自动换行" prop="wordWrap">
            <i-switch v-model="form.wordWrap" size="large" @on-change="handleWordWrapChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>

          <FormItem label="显示行号" prop="lineNumber">
            <i-switch v-model="form.lineNumber" size="large" @on-change="handleLineNumberChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>

          <FormItem label="自动保存" prop="autoSave" @on-change="handleAutoSaveChange">
            <i-switch v-model="form.autoSave" size="large">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>

          <FormItem label="自动保存间隔" prop="autoSaveInterval">
            <Input
              v-model="form.autoSaveInterval"
              placeholder="5"
              :disabled="!form.autoSave"
              style="width: 100px;"
              @on-change="handleAutoSaveIntervalChange"
            >
              <span slot="append">秒</span>
            </Input>
          </FormItem>
        </Form>
      </div>
      <!-- 代码主题风格 -->
      <div v-if="tab === 'codeTheme'" class="theme-checker-wrap">
        <RadioGroup
          v-model="form.codeTheme"
          class="theme-checker"
          @on-change="handleCodeThemeChange"
        >
          <Radio v-for="(item, index) in theme" :key="index" :label="item">
            <span class="cover">
              <img :src="`static/theme/${item}.png`" :alt="item" />
            </span>
            <span class="title">{{item}}</span>
          </Radio>
        </RadioGroup>
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapState } from "vuex";

// 导入模块和主题配置
import theme from "@/lib/theme";

export default {
  name: "ModalSettings",
  props: {
    value: Boolean
  },
  data() {
    return {
      modal: this.$props.value,
      tab: "basic",
      theme,
      form: {}
    };
  },
  computed: {
    ...mapState({
      settings: state => state.Settings
    })
  },
  watch: {
    value: function(val) {
      this.modal = val;
    },
    modal: function(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    dispatchAction(action, value) {
      this.$store.dispatch(`Settings/${action}`, value);
    },

    handleThemeChange(theme) {
      this.dispatchAction("setTheme", theme);
    },

    handleCodeThemeChange(theme) {
      this.dispatchAction("setCodeTheme", theme);
    },

    handleCodeFontFamilyChange() {
      this.dispatchAction("setCodeFontFamily", this.form.codeFontFamily);
    },

    handleCodeFontSizeChange() {
      this.dispatchAction("setCodeFontSize", this.form.codeFontSize);
    },

    handleWordWrapChange(wrap) {
      this.dispatchAction("setWordWrap", wrap);
    },

    handleLineNumberChange(visible) {
      this.dispatchAction("setLineNumber", visible);
    },

    handleAutoSaveChange(status) {
      this.dispatchAction("setAutoSave", status);
    },

    handleAutoSaveIntervalChange() {
      this.dispatchAction("setAutoSaveInterval", this.form.autoSaveInterval);
    }
  },
  mounted() {
    this.form = { ...this.settings };
  }
};
</script>

<style lang="less" scoped>
.settings-tab {
  border-bottom: 1px #e8eaec solid;
  margin: -15px -15px 0;
  overflow: auto;
  position: relative;

  ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    position: relative;

    li {
      border-right: 1px #e8eaec solid;
      flex: 1;
      position: relative;

      &:last-of-type {
        border-right: none;
      }

      span {
        cursor: pointer;
        display: block;
        line-height: 32px;
        position: relative;
        text-align: center;
      }

      &:hover {
        background-color: #fafafa;
      }

      &.current {
        background-color: #fafafa;
        font-weight: bold;
      }
    }
  }
}

.settings-tab-content {
  margin: 0 -15px -15px;
  max-height: 400px;
  overflow: auto;
}

.form {
  margin: 48px auto;
  padding-right: 64px;
  width: 480px;
}
</style>