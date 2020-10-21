<!--
 * @Author: your name
 * @Date: 2020-08-06 10:59:57
 * @LastEditTime: 2020-08-18 14:40:37
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \MedicalInsuranceReimbursementProjectWeb\src\views\Index.vue
-->
<template>
  <el-container direction="vertical">
    <el-container class="app-main">
      <app-menu :slideData="slideData"></app-menu>
      <div class="container">
        <app-header />
        <el-main class="main-body">
          <!-- <router-view></router-view> -->
          <section class="w100b">
            <transition name="fade-transform" mode="out-in">
              <router-view />
            </transition>
          </section>
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>

<script>
  import AppMenu from "@/components/layer/AppMenu";
  import AppHeader from "@/components/layer/AppHeader";

  export default {
    components: {
      AppMenu,
      AppHeader,
    },
    data() {
      return {
        slideData: {}
      }
    },
    created() {
      this.slideData = this.$router.options.routes[2].children;
    }
  };
</script>
<style scoped lang="scss">
  .el-main {
    padding: 0 15px 15px 15px;
    background: rgba(249, 249, 249, 1);
  }

  html,
  body {
    width: 100%;
  }

  .w100b {
    background: #fff;
    height: calc(100vh - 90px);
    overflow: auto;
    box-shadow: 0px 4px 16px 0px #ECECEC;
    border-radius: 4px;
    border: 1px solid #ECECEC;
  }

  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  /*fade*/
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  /*fade-transform*/
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.1s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>