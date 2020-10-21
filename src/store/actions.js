/*
 * @Author: your name
 * @Date: 2020-08-04 09:04:44
 * @LastEditTime: 2020-09-07 11:31:59
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \frontend-web-dev20200525-de0e7f353523879bd322d438277d27acc05193b6\src\store\actions.js
 */
import {
  SET_LOCALSTORAGE,
  SET_AUTHORITYLOCALSTORAGE,
  SAVE_ACTIVECLS
} from './mutationTypes.js'

const actions = {
  setLocalStorage({
    commit
  }, menuList) {
    commit(SET_LOCALSTORAGE, menuList);
  },

  setAuthorityToLocalStorage({
    commit
  }, authorityList) {
    commit(SET_AUTHORITYLOCALSTORAGE, authorityList);
  },

  saveActiveCls({
    commit
  }, flag) {
    commit(SAVE_ACTIVECLS, flag);
  },

}

export default actions