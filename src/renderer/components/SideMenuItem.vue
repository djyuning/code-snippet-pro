<template>
  <div :class="['side-menu-item', expand ? 'expand' : '']">
    <div class="handler" :style="handleStyle" @click="handleClick">
      <Icon v-if="item.icon" class="icons" :type="item.icon" />
      <span class="name">{{ item.title }}</span>
      <div v-if="options" class="options">
        <Dropdown placement="bottom-end" @on-click="handleDropdownClick" transfer>
          <Icon class="handle" type="md-settings" />
          <DropdownMenu slot="list">
            <DropdownItem name="edit">编辑</DropdownItem>
            <DropdownItem class="danger" name="delete">删除</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Icon v-if="item.passwordEnable" class="icons" type="md-lock" />
      <Icon v-if="hasChild" class="icons icons-arrow" type="ios-arrow-down" />
    </div>
    <SideMenu v-if="hasChild" :level="level + 1" :expand="expand">
      <SideMenuItem
        v-for="(sub, index) in item.child"
        :key="`${level}-${index}`"
        :item="sub"
        :level="level + 1"
        :options="options"
      />
    </SideMenu>
  </div>
</template>

<script>
export default {
  name: "SideMenuItem",
  components: {
    SideMenu: () => import("./SideMenu")
  },
  props: {
    // 条目
    item: {
      type: Object,
      required: true,
      default() {
        return null;
      }
    },

    // 层级
    level: {
      type: Number,
      default: 0
    },

    // 显示操作
    options: Boolean
  },
  data() {
    return {
      expand: false
    };
  },
  computed: {
    handleStyle: function() {
      return {
        paddingLeft: `${this.$props.level * 12}px`
      };
    },
    hasChild: function() {
      let item = this.$props.item;
      if (!item) return false;
      return Array.isArray(item["child"]) && item["child"].length;
    }
  },
  methods: {
    handleDropdownClick(name) {
      let item = this.$props.item;

      // 编辑
      if (name === "edit") {
        return;
      }

      // 删除
      if (name === "delete") {
        // 有子目录时，不可删除
        if (this.hasChild)
          return this.$Modal.error({
            title: "操作提示",
            content: "请先删除当前目录下的子目录!"
          });

        this.$Modal.confirm({
          title: "操作提示",
          content: `确定删除 <b>${this.$props.item.title}</b> 目录？`,
          onOk: () => {
            this.$store.dispatch("Contents/deleteFold", this.$props.item.uuid);
          }
        });

        return;
      }
    },

    handleClick() {
      // 如果有子级，展开子级
      if (this.hasChild) {
        return (this.expand = !this.expand);
      }
      // 触发条目点击
      this.$emit("on-change", this.$props.item);
    }
  }
};
</script>

<style lang="less" scoped>
.side-menu-item {
  position: relative;
  user-select: none;

  // 触发器
  .handler {
    align-items: center;
    border-radius: 3px;
    color: #7c8da9;
    cursor: default;
    display: flex;
    justify-content: space-between;
    padding: 2px;
    position: relative;

    .icons,
    .name {
      display: block;
      height: 24px;
      line-height: 24px;
      overflow: hidden;
    }

    .icons {
      font-size: 14px;
      flex-shrink: 0;
      text-align: center;
      width: 24px;

      // 箭头
      &-arrow {
        color: #6a7491;
        font-size: 12px;

        &-expand {
          transform: rotate(180deg);
        }
      }
    }

    .name {
      font-size: 12px;
      flex-grow: 1;
      padding: 0 4px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .badge {
      background-color: #5cc779;
      border-radius: 2px;
      box-sizing: border-box;
      color: white;
      font-size: 12px;
      font-style: normal;
      font-weight: bold;
      line-height: 20px;
      margin: 2px;
      min-width: 20px;
      padding: 0 4px;
      text-align: center;
    }

    // 操作按钮
    .options {
      display: none;

      .handle {
        font-size: 12px;
        color: inherit;
      }
    }

    // 划过
    &:hover {
      background-color: #6a7491;
      color: white;

      // 箭头高亮
      .icons-arrow {
        color: white;
      }

      // 显示操作项
      .options {
        display: block;
      }
    }
  }

  // 已展开
  &.expand > .handler {
    color: white;
    text-shadow: 1px 1px 0 #6a7491;

    .icons-arrow {
      color: white;
      transform: rotate(180deg);
    }
  }
}
</style>