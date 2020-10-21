/*
 * @Author: your name
 * @Date: 2020-08-04 09:04:44
 * @LastEditTime: 2020-09-07 11:41:47
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \frontend-web-dev20200525-de0e7f353523879bd322d438277d27acc05193b6\src\store\mutations.js
 */
import {
  SET_LOCALSTORAGE,
  SET_AUTHORITYLOCALSTORAGE,
  SET_TOTAL,
  SAVE_ACTIVECLS
} from './mutationTypes.js'

const mutations = {
  [SET_LOCALSTORAGE]: (state, menu) => {
    //将菜单权限列表存入 localStorage
    window.localStorage.setItem('menu', JSON.stringify(menu));
  },
  [SET_AUTHORITYLOCALSTORAGE]: (state, authorityList) => {
    //将按钮权限列表存入 localStorage
    authorityList = authorityList.split(',');
    authorityList.pop();
    window.localStorage.setItem('authority', JSON.stringify(authorityList));
  },
  [SET_TOTAL]: (state, num) => {
    //修改 state 里全局总数变量的值
    state.globalTotal = num;
  },
  [SAVE_ACTIVECLS]: (state, flag) => {
    //将选中的tab页存入 sessionStorage
    window.sessionStorage.setItem('tab', JSON.stringify(flag));
  },
}

export default mutations