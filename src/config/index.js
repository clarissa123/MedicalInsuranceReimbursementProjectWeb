/*
 * @Author: your name
 * @Date: 2020-08-04 09:04:44
 * @LastEditTime: 2020-11-04 21:20:35
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \frontend-web-dev20200525-de0e7f353523879bd322d438277d27acc05193b6\src\config\index.js
 */
// Ajax统一状态码
export const statusCode = {
  SUCCESS: 1000, // 成功
  NOT_LOGIN: 503, // 未登录
  TOKEN_EXPIRED: 1002, // TOKEN过期
  INVALID_PARAM: 1003, // 无效参数
  BAD_AUTHORIZED: 1004, // 未授权
  EMPTY_RESULT: 1005, // 结果为空
  DATABASE_EXCEPTION: 1006, // 数据库异常
  UNKNOW_USERNAME: 2001, // 未知用户
  INVALID_VERIFICATION_CODE: 2001, // 无效验证码
  FILE_SIZE_EXCEED_MAX: 3001, // 文件尺寸超过最大值
  EMPTY_FILE: 3002, // 文件为空
  FILE_HANDLER_EXCEPTION: 3003, // 文件处理异常
  EMPTY_FILENAME: 3004, // 文件名为空
  INVALID_FILE_TYPE: 3005 // 无效文件类型

}

export const projectTitle = '智能医保报销助手'
export const baseURL = '暂无地址'

// KEYS
export const KEYS = {
  //跨域认证token
  JWTToken: 'JWTToken',
  //延长用户的登录信息的token
  RefreshToken: 'RefreshJWTToken',
  UserId: 'libraUserId',
  UserInfo: 'UserInfo',
}

export const headerCellStyle = {
  color: '#1448AD',
  background: 'rgba(225, 236, 255, 0.2)',
  textAlign: 'center',
  height: '60px',
  fontWeight: 400
}

export const rowStyle = {
  color: '#7F7F7F',
  textAlign: 'center',
  fontWeight: 400,
  height: '60px',
}