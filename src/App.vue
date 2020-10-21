<!--
 * @Author: your name
 * @Date: 2020-08-06 10:59:57
 * @LastEditTime: 2020-09-07 13:50:04
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \MedicalInsuranceReimbursementProjectWeb\src\App.vue
-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import AppHeader from '@/components/layer/AppHeader'
  import AppFooter from '@/components/layer/AppFooter'

  export default {
    name: 'App',
    components: {
      AppHeader,
      AppFooter
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style lang="scss">
  [v-cloak] {
    display: none;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  #app {
    width: 100%;
    height: 100%;
    font-family: 'PingFang Medium';
  }

  .cursor {
    cursor: pointer;
  }

  /*滚动条样式*/
  *::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }

  *::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(227, 228, 234, 1);
    background: rgba(0, 0, 0, 0.2);
  }

  *::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(227, 228, 234, 1);
    border-radius: 0;
    background: rgba(221, 230, 240, 1);
  }
</style>