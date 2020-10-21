import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  Message
} from 'element-ui';

const DocIndex = () => import('@/views/documentsList/docIndex.vue') // 详情导航
const DocumentSummary = () => import('@/views/documentSummary/Index.vue')
const DocumentSummaryFuHe = () => import('@/views/documentSummary/IndexFuHe.vue')
const DataDetail = () => import('@/views/documentsList/DataDetail.vue')
const DataDetailNew = () => import('@/views/documentsList/DataDetailNew.vue')
const DataDetailFuHe = () => import('@/views/documentsList/DataDetailFuHe.vue')
const CacResult = () => import('@/views/cacResult/Index.vue')

const UserList = () => import('@/views/userManage/UserList.vue')
//新增用户
const UserInfo = () => import('@/views/userManage/UserInfo.vue')
//修改用户
const UserInfoEdit = () => import('@/views/userManage/UserInfoEdit.vue')
const RoleList = () => import('@/views/roleManage/RoleList.vue')
const RoleInfo = () => import('@/views/roleManage/RoleInfo.vue')
const RoleInfoEdit = () => import('@/views/roleManage/RoleInfoEdit.vue')
//机构首页
const OrgList = () => import('@/views/orgManage/OrgList.vue')
//新增机构
const OrgInfo = () => import('@/views/orgManage/OrgInfo.vue')
//修改机构
const OrgInfoEdit = () => import('@/views/orgManage/OrgInfoEdit.vue')

const docList = () => import('@/views/documentsList/List.vue')

//数据分析
const Menu3 = () => import('@/views/menu3.vue')

//报销规则管理
const Menu4 = () => import('@/views/menu4.vue')

Vue.use(VueRouter)

const routes = [{
    path: "/",
    redirect: '/login'
  },
  {
    path: "/login",
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: "登陆",
    }
  },
  // {
  //   path: "/index",
  //   component: () => import('@/views/Index.vue'),
  //   name: 'index',
  //   children: []
  // },
  {
    path: '/documents',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    children: [
      // {
      //   path: '/documents/list',
      //   name: 'documentsList',
      //   component: docList,
      //   meta: {
      //     title: '报销列表',
      //     icon: 'wenjian',
      //   }
      // },
      // {
      //   path: '/usermanage/userlist',
      //   name: 'userList',
      //   component: UserList,
      //   meta: {
      //     title: '用户管理列表',
      //   }
      // },
      {
        path: '/usermanage/userinfo',
        name: 'userInfo',
        component: UserInfo,
        meta: {
          title: '新增用户',
        }
      },
      {
        path: '/usermanage/userinfoEdit/:id',
        name: 'userInfoEdit',
        component: UserInfoEdit,
        meta: {
          title: '修改用户',
        }
      },
      // {
      //   path: '/rolemanage/rolelist',
      //   name: 'rolelist',
      //   component: RoleList,
      //   meta: {
      //     title: '角色管理列表',
      //   }
      // },
      {
        path: '/rolemanage/roleinfo',
        name: 'roleinfo',
        component: RoleInfo,
        meta: {
          title: '新增角色',
        }
      },
      {
        path: `/rolemanage/roleinfoEdit/:id`,
        name: 'roleinfoEdit',
        component: RoleInfoEdit,
        meta: {
          title: '修改角色',
        }
      },
      // {
      //   path: '/orgmanege/orglist',
      //   name: 'orglist',
      //   component: OrgList,
      //   meta: {
      //     title: '机构管理列表',
      //   }
      // },
      {
        path: '/orgmanege/orginfo',
        name: 'orgInfo',
        component: OrgInfo,
        meta: {
          title: '新增机构',
        }
      },
      {
        path: '/orgmanege/OrgInfoEdit/:id',
        name: 'orgInfoEdit',
        component: OrgInfoEdit,
        meta: {
          title: '修改机构',
        }
      },
      {
        path: '/documents/docIndex',
        name: 'docIndex',
        component: DocIndex,
        meta: {
          title: '单据详情',
        },
        children: [{
            path: '/documents/docIndex/summary',
            name: 'documentSummary',
            component: DocumentSummary,
            meta: {
              title: '单据汇总',
            },
          }, {
            path: '/documents/docIndex/summaryFuHe',
            name: 'documentSummaryFuHe',
            component: DocumentSummaryFuHe,
            meta: {
              title: '审批',
            },
          },
          {
            path: '/documents/docIndex/documentsDet',
            name: 'documentsDet',
            component: DataDetail,
            meta: {
              title: 'OCR识别',
            }
          },
          {
            path: '/documents/docIndex/documentsDetNew',
            name: 'documentsDetNew',
            component: DataDetailNew,
            meta: {
              title: 'OCR识别新',
            }
          },
          {
            path: '/documents/docIndex/documentsDetFuHe',
            name: 'documentsDetFuHe',
            component: DataDetailFuHe,
            meta: {
              title: 'OCR识别',
            }
          },
          {
            path: '/documents/docIndex/cacResult',
            name: 'cacResult',
            component: CacResult,
            meta: {
              title: '核算结果',
            }
          }
        ]
      }
    ]
  },
]

const router = new VueRouter({
  // 路由模式
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  mode: "hash",
  routes,
})

export const setMenuTree = function (menuTree) {
  let temp = new Vue({
    router
  });
  temp.$router.options.routes[2].children = [];

  menuTree.forEach(v => {
    let route = {
      path: "/" + v.menuCode,
      name: v.menuCode,
      component: () => import('@/views' + v.menuUrl),
      children: [],
      meta: {
        title: v.menuName
      }
    };
    if (v.children != null) {
      v.children.forEach(vv => {
        let route1 = {
          path: "/" + vv.menuCode,
          name: vv.menuCode,
          component: () => import('@/views' + vv.menuUrl),
          children: [],
          meta: {
            title: vv.menuName
          }
        };
        let redirect = "/" + v.children[0].menuCode;
        route.redirect = redirect;
        route.children.push(route1);
      });
    }
    temp.$router.options.routes[2].children.push(route);
  });
  temp.$router.addRoutes(temp.$router.options.routes);
}

export const isAuth = function (uri) {
  let authority = JSON.parse(window.localStorage.getItem("authority"))
  if (authority.indexOf(uri) >= 0) {
    return true;
  }
  return false;
};


// 在路由跳转的时候同一个路由多次添加是不被允许的
// 重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}


// 路由钩子,导航之前
router.beforeEach(async (to, from, next) => {
  // 根据路由元信息设置文档标题
  window.document.title = to.meta.title || '智慧医保报销系统';
  next();
  // 获取token
  const access = window.sessionStorage.getItem('token');
  // 有token
  if (access) {
    // 直接放行
    next();
  } else { // 否则是没有
    // 如果去的是登录页
    if (to.path === '/login') {
      // 直接放行
      next();
    } else {
      // 如果去的是其他页,跳转到登录页
      Message.error('请登录以后再操作！')
      // 跳转到登录页
      return next({
        "path": "/login"
      })
    }
  }
})

export default router