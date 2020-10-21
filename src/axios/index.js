/*
 * @Author: axios文件
 * @Date: 2020-08-06 10:59:57
 * @LastEditTime: 2020-10-21 14:49:11
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \MedicalInsuranceReimbursementProjectWeb\src\axios\index.js
 */
import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import {
  baseURL,
  statusCode,
} from '@/config'

// 创建实例
const instance = axios.create({
  baseURL,
  timeout: 0
})

// 请求拦截器
instance.interceptors.request.use((config) => {
  // 在响应中添加token
  const account = window.sessionStorage.getItem('userName')
  const token = window.sessionStorage.getItem('token')
  // 在请求头中携带token
  config.headers.token = `${token}`
  config.headers.account = `${account}`
  return config
}, (err) => {
  // 调用element-ui提示错误
  Vue.prototype.$message.error(err)
  Promise.reject(err)
})

const duration = 2000

// 响应拦截器
instance.interceptors.response.use(async (res) => {
  // 后续和后端协商响应状态码，添加统一的状态吗响应
  if (res.data.status === statusCode.NOT_LOGIN) {
    Vue.prototype.$message.error(res.data.msg);
    router.push({
      name: 'login',
    })
  }
  return res.data
}, (err) => {
  // 调用element-ui提示错误
  Vue.prototype.$message.error(err.response.data.message)
  Promise.reject(err)
})

export default instance