import axios from '@/axios'

// GET
// /org/area
// 地区接口
export const orgArea = id => axios.get(`/org/area?id=${id}`)

// GET
// /org/detail/{id}
// 机构详细
export const orgDetail = id => axios.get(`/org/detail/${id}`)

// POST
// /org/list
// 机构列表(包括模糊搜索)
export const orgList = data => axios.post('/org/list', data)

// PUT
// /org/update
// 修改机构
export const orgUpdate = data => axios.put('/org/update', data)


// //  renyuan
// POST
// /user/add
// 增加用户
export const userAdd = data => axios.post('/user/add', data)

// PUT
// /user/avtivity
// 启用
export const userAvtivity = id => axios.put(`/user/avtivity?id=${id}`)

// GET
// /user/detail/{id}
// 用户详细
export const userDetail = id => axios.get(`/user/detail/${id}`)

// PUT
// /user/limit
// 禁用
export const userLimit = id => axios.put(`/user/limit?id=${id}`, data)

// POST
// /medicare/role/select
// 人员列表 （搜索）
export const userList = data => axios.post('/medicare/role/select', data)

// POST
// /user/rolelist
// 角色列表
export const roleList = data => axios.post('/user/rolelist', data)

// 角色
// POST
// /medicare/role/updateAdd
// 增加角色
export const roleAdd = data => axios.post('/medicare/role/updateAdd', data)

// 角色
// POST
// /medicare/role/updateAdd
// 修改角色
export const roleEdit = data => axios.post('/medicare/role/updateAdd', data)


//删除角色
// POST
// /medicare/role/deleted
export const roleDelete = id => axios.post(`/medicare/role/deleted?roleId=${id}`)

// PUT
// /user/repass
// 重置密码
export const userRepass = id => axios.put(`/user/repass?id=${id}`)

// PUT
// /user/updateUser
// 修改用户
export const userUpdateUser = data => axios.put('/user/updateUser', data)

// 菜单权限     新增
// GET
// /medicare/authority/getMenuPort      
// 查询菜单权限  新增
export const getMenuPort = () => axios.get(`/medicare/authority/getMenuPort`)

// 菜单权限     修改
// GET
// /medicare/authority/getMenuPort      
// 查询菜单权限  修改
export const getMenuPortEdit = id => axios.get(`/medicare/authority/getMenuPort?roleId=${id}`)

// 父级角色
// POST
// /medicare/role/selectAll
// 查询菜单权限
export const selectParent = () => axios.post('/medicare/role/selectAll');

//保存菜单权限
// POST
// /medicare/authority/setMenu
export const setMenu = data => axios.post('/medicare/authority/setMenu', data);

//保存按钮权限
// POST
// /medicare/authority/setPort
export const setPort = data => axios.post('/medicare/authority/setPort', data);

// POST
// /medicare/role/get
// 根据ID查询角色信息
export const getRole = id => axios.post(`/medicare/role/get?roleId=${id}`)

// ------------------------------用户管理-----------------------------------
// POST
// /medicare/user/selectPage
// 分页查询用户列表
export const selectPage = data => axios.post('/medicare/user/selectPage', data);

// POST
// /medicare/user/addUpdate
// 新建用户
export const personAdd = data => axios.post('/medicare/user/addUpdate', data);

// POST
// /medicare/user/addUpdate
// 修改用户
export const personEdit = data => axios.post('/medicare/user/addUpdate', data);

//删除用户
// POST
// /medicare/user/deleted
export const personDeleted = id => axios.post(`/medicare/user/deleted?userId=${id}`)

// POST
// /medicare/role/selectParent
// 根据当前登录人查询可选父级角色
export const roleSelectParent = data => axios.post('/medicare/role/selectParent', data);

// POST
// /medicare/user/selectOrg
// 查询所有登陆者可创建账号的机构
export const userSelectOrg = data => axios.post('/medicare/user/selectOrg', data);

// POST
// /medicare/user/reset/pwd
// 重置密码
export const resetPwd = id => axios.post(`/medicare/user/reset/pwd?userId=${id}`)

// ------------------------------机构管理-----------------------------------
// POST
// /medicare/organization/select
// 分页查询组织机构
export const selectOrg = data => axios.post('/medicare/organization/select', data);

// POST
// /medicare/organization/addUpdate
// 新建机构
export const orgAdd = data => axios.post('/medicare/organization/addUpdate', data);

// POST
// /medicare/organization/addUpdate
// 修改机构
export const orgEdit = data => axios.post('/medicare/organization/addUpdate', data);

//删除机构
// POST
// /medicare/organization/deleted
export const orgDeleted = id => axios.post(`/medicare/organization/deleted?userId=${id}`)
