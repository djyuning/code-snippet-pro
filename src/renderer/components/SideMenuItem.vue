<template>
  <div :class="classes">
    <div class="handler" :style="handleStyle">
      <Icon
        v-if="item.icon"
        class="icons"
        :type="item.icon"
        :style="iconStyle"
        @click="handleClick"
      />
      <span class="name" @click="handleClick">{{ item.title }}</span>
      <em class="badge" v-if="item.count">{{ item.count }}</em>
      <div v-if="options && item.uuid !== 'default'" class="options">
        <Dropdown placement="bottom-end" @on-click="handleDropdownClick" transfer>
          <Icon class="handle" type="md-settings" />
          <DropdownMenu slot="list">
            <DropdownItem name="edit">编辑</DropdownItem>
            <DropdownItem class="danger" name="delete">删除</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Icon v-if="item.passwordEnable" class="icons" type="md-lock" />
      <Icon
        v-if="hasChild"
        class="icons icons-arrow"
        type="ios-arrow-down"
        @click="expand = !expand"
      />
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
      expand: false,
      root: null, // 根节点
      active: false
    };
  },
  computed: {
    classes: function() {
      return {
        item: true,
        active: this.root.active && this.root.active === this.$props.item.uuid,
        expand: this.expand
      };
    },

    // 图标yangshi
    iconStyle: function() {
      let { item } = this.$props;
      return {
        color: item.color || "#7c8da9"
      };
    },

    // 条目属性
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
    // 递归获取当前元素发父组件，直到找到顶层的 SideMenu
    _getRootMenu(node) {
      let $parent = node.$parent;
      if ($parent.$parent.$options._componentTag === "SideMenuItem") {
        return this._getRootMenu(node.$parent.$parent);
      }
      return $parent;
    },

    handleDropdownClick(name) {
      let item = this.$props.item;

      // 编辑
      if (name === "edit") {
        this.root.$emit("on-edit", this.$props.item);
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

    handleClick(e) {
      // 触发条目点击
      this.root.$emit("on-change", this.$props.item);
    }
  },
  created() {
    // 获取根菜单
    this.root = this._getRootMenu(this);
  }
};
</script>

<style lang="less" scoped>
.side-menu > .item {
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
      background-color: #eee;
      color: #333;

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

  // 高亮
  &.active {
    & > .handler {
      background-color: #e1e4ec;
      color: #7c8da9;
    }
  }

  // 已展开
  &.expand > .handler {
    color: #7c8da9;

    .icons-arrow {
      color: #7c8da9;
      transform: rotate(180deg);
    }
  }
}
</style>