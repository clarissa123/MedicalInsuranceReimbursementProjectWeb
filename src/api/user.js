/*
 * @Author: your name
 * @Date: 2020-08-06 10:59:57
 * @LastEditTime: 2020-08-19 11:57:34
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \MedicalInsuranceReimbursementProjectWeb\src\api\user.js
 */
import axios from '@/axios'

// // 获取用户信息
// export const fetchUser = (userId, config) => axios.get(`/api/user/userId/${userId}`, config)
// // 登陆
// export const login = data => axios.post('/auth/login', data)
// // 刷新token
// export const refreshToken = data => axios.post('/auth/refreshToken', data)
// // 退出登录
// export const loginOut = () => axios.post('/logout')


// POST
// /auth/checkSmsCode
// 验证码校验并修改密码
export const checkSmsCode = data => axios.post('/auth/checkSmsCode', data)

// POST
// /auth/dist
// insertDist
export const insertDist = data => axios.post('/auth/dist', data)

// POST
// /auth/getSmsCode
// 获取验证码
export const getSmsCode = data => axios.post('/auth/getSmsCode', data)

// POST
// /medicare/login/login    
// 用户登录 获取token       
// export const login = data => axios.post('/medicare/login/login', data)
export const login = data => axios.post(`/medicare/login/login?param=${data}`)

// POST
// /medicare/login/loginOut
// 注销登录
export const logout = data => axios.post('/medicare/login/loginOut', data)

// POST
// /auth/refreshToken
// 刷新token
export const refreshToken = data => axios.post('/auth/refreshToken', data)

// POST
// /auth/updatePassword
// 修改密码
export const updatePassword = data => axios.post('/auth/updatePassword', data)

// POST
// /auth/getPublicKey
// 获取公钥
export const getPublicKey = data => axios.post('/auth/getPublicKey', data)

// POST
// /medicare/organization/selectBy
// 根据名字模糊查询组织机构
export const selectBy = data => axios.get(`/medicare/organization/selectBy?organizationName=${data}`)

// POST
// /medicare/role/selectAll
// 查询所有角色信息
export const selectAll = data => axios.post('/medicare/role/selectAll', data)

// GET
// /medicare/user/selectAllOrg
// 查询所有机构
export const selectAllOrg = data => axios.get('/medicare/user/selectAllOrg', data)

