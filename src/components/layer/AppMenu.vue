<!-- 侧边导航栏 -->
<template>
  <div class="menu-list cu-app-menu">
    <div class="logo-box">
      <img src="@/assets/logo.png" />
    </div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      router
      :unique-opened="false"
    >
      <el-submenu v-for="v in menus" :index="v.path" :key="v.path">
        <template slot="title">
          <i class="el-icon-setting" v-if="v.meta.title == '系统管理'"></i>
          <i class="el-icon-bank-card" v-if="v.meta.title == '报销列表'"></i>
          <i class="el-icon-s-data" v-if="v.meta.title == '数据分析'"></i>
          <span class="tit1" @click="jumpTo(v.path)">{{v.meta.title}}</span>
        </template>
        <el-menu-item-group
          v-for="vv in v.children"
          index="vv.path"
          :key="vv.path"
          v-show="v.children!=null"
          class="tit2"
        >
          <el-menu-item :index="vv.path" @click="jumpTo(vv.path)">{{vv.meta.title}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
} from "@/utils";

export default {
  name: "AppMenu",
  data() {
    return {
      menus: [],
    };
  },
  props: {
    slideData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    this.menus = this.slideData;
  },
  methods: {
    handleSelect(key, keyPath) {},
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    jumpTo(path) {
      if (path == "/menu1" || path == "/menu2") {
        return false;
      }
      this.$router.push({
        path: path,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/myStyle/mixin.scss";

.menu-list {
  height: 100vh;
  background: url("../../assets/nav_bg.png") no-repeat 100% 100%;

  /deep/.el-menu {
    @include wh(180px, auto);
    border-right: none;
    background: rgba(255, 255, 255, 0.1);

    .iconfont {
      display: inline-block;
      margin-right: 12px;
    }

    i {
      color: $nav-font-blue;
    }

    /deep/.el-submenu {
      .el-submenu__title {
        margin-left: 7px;
        font-weight: 500;
        font-size: 16px;
        letter-spacing: 1px;
        color: $nav-font-blue;
        height: 60px;
        line-height: 60px;
      }

      .el-submenu__title:hover {
        background: transparent;
      }
    }

    /deep/li.el-submenu.is-opened {
      .el-submenu__title {
        background: transparent;
      }
    }

    .el-menu-item {
      text-align: center;
      font-weight: 500;
      font-size: 16px;
      letter-spacing: 1px;
      color: $nav-font-blue;
      height: 60px;
      line-height: 60px;
      min-width: auto;
    }

    /deep/.el-menu-item-group__title {
      padding: 0;
    }

    .el-menu-item.is-active {
      background: linear-gradient(
        270deg,
        rgba(64, 104, 182, 0.65) 0%,
        rgba(116, 161, 220, 0) 100%
      );
      border-radius: 2px;
      border-right: 3px solid #4068b6;
      color: rgba(255, 255, 255, 1);
      font-size: 18px;
      font-weight: 600;
    }

    .el-menu-item:hover {
      background: linear-gradient(
        270deg,
        rgba(64, 104, 182, 0.65) 0%,
        rgba(116, 161, 220, 0) 100%
      );
      border-radius: 2px;
      border-right: 3px solid #4068b6;
      color: rgba(255, 255, 255, 1);
      font-size: 18px;
      font-weight: 600;
    }
  }

  .logo-box {
    text-align: center;

    img {
      width: 62px;
      height: 58px;
      margin: 29px 59px 11px;
      cursor: pointer;
    }
  }
}
</style>