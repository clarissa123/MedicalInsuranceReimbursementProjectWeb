/*
 * @Author: your name
 * @Date: 2020-08-06 10:59:57
 * @LastEditTime: 2020-10-12 13:43:05
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \MedicalInsuranceReimbursementProjectWeb\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
//引入自定义字体
import './assets/font/font.css'
//引入分页样式
import './assets/css/page.scss'
import './element-ui'
// 引入echarts
import echarts from 'echarts';

import {
  setMenuTree
} from './router'
// 开发环境启动Mock;
// process.env.NODE_ENV === 'development' && import('@/mock')
// 挂载自定义axios实例在Vue的原型链上，使用时使用this.$axios(...)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
Vue.prototype.$eventBus = Vue.prototype.$eventBus || new Vue()

export let getMenuFuc = function (list) {
  setMenuTree(list)
}

if (window.localStorage.getItem("menu") != null) {
  let menuTree = JSON.parse(window.localStorage.getItem("menu"))
  getMenuFuc(menuTree)
}

new Vue({
  router,
  store,
  render: h => h(App),
  eventBus: new Vue()
}).$mount('#app')