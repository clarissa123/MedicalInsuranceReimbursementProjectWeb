/*
 * @Descripttion: 
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-08-19 14:11:06
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-09-07 10:40:05
 */
import axios from '@/axios'

// 菜单权限     
// GET
// /medicare/authority/getMenuPort     
// 新增的时候查询菜单权限  
export const getMenuPort = () => axios.get(`/medicare/authority/getMenuPort`)

//------------------------用户信息----------------------------------------------------

// GET
// /medicare/user/get
// 查询单个账号信息  
export const getUserDetail = id => axios.get(`/medicare/user/get?userId=${id}`);

// POST
// /medicare/user/addUpdate
// 修改用户  
export const editUser = data => axios.post('/medicare/user/addUpdate', data);

// POST
// /medicare/user/updateSelf
// 用户修改密码和用户名  
export const updateSelf = data => axios.post('/medicare/user/updateSelf', data);

//------------------------机构管理----------------------------------------------------
// POST
// /medicare/region/selectByLeavel
// 根据上级(上级为空则查询最上层)或层级查询区域  
export const selectByLeavel = data => axios.post(`/medicare/region/selectByLeavel?parentId=${data}`);

// POST
// /medicare/organization/deleted
// 删除组织机构
export const orgDeleted = data => axios.post(`/medicare/organization/deleted?organizationId=${data}`);

// POST
// /medicare/organization/addUpdate
// 新增机构
export const orgAdd = data => axios.post('/medicare/organization/addUpdate', data);

// GET
// /medicare/organization/get
// 查询单个机构信息  
export const getOrg = id => axios.get(`/medicare/organization/get?organizationId=${id}`);


// POST
// /medicare/organization/addUpdate
// 修改机构
export const orgUpdate = data => axios.post('/medicare/organization/addUpdate', data);

//------------------------统计分析----------------------------------------------------
// 搜索机构名     
// GET
// /medicare/organization/selectBy
export const searchOrg = data => axios.get(`/medicare/organization/selectBy?organizationName=${data}`);

// 获取省/市/县的下拉列表     
// POST
// /medicare/report/getCount
export const getPro = data => axios.post(`/medicare/region/selectByLeavel?parentId=${data}`);

// 获取省、市、县、机构的默认值     
// GET
// /medicare/report/getCountRegion
export const getCountRegion = () => axios.get(`/medicare/report/getCountRegion`);

// POST
// /medicare/report/get
// 获取报销比例
export const getRang = data => axios.post('/medicare/report/get', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// POST
// /medicare/report/get
// 获取报销金额分布
export const getMoney = data => axios.post('/medicare/report/getT', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

//------------------------报销规则管理----------------------------------------------------
// POST
// /medicare/dict/selectMedicinal
// 分页查询药品
export const selectMedicinal = data => axios.post('/medicare/dict/selectMedicinal', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// POST
// /medicare/dict/addMedicinalToDict
// 新增药品
export const addMedicinalToDict = data => axios.post('/medicare/dict/addMedicinalToDict', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// POST
// /medicare/dict/addMedicinalToDict
// 修改药品
export const editMedicinalToDict = data => axios.post('/medicare/dict/addMedicinalToDict', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// 删除药品     
// DELETE
// /medicare/dict/deleteMedicinal
export const deleteMedicinal = data => axios.delete(`/medicare/dict/deleteMedicinal?id=${data}`);

// POST
// /medicare/dict/selectDiagnosis
// 分页查询诊疗
export const selectDiagnosis = data => axios.post('/medicare/dict/selectDiagnosis', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// POST
// /medicare/dict/addDiagnosisToDict
// 新增诊疗
export const addDiagnosisToDict = data => axios.post('/medicare/dict/addDiagnosisToDict', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// POST
// /medicare/dict/addDiagnosisToDict
// 修改诊疗
export const editDiagnosisToDict = data => axios.post('/medicare/dict/addDiagnosisToDict', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// 删除诊疗
// DELETE
// /medicare/dict/deleteDiagnosis
export const deleteDiagnosis = data => axios.delete(`/medicare/dict/deleteDiagnosis?id=${data}`);

// POST
// /medicare/dict/selectMaterial
// 分页查询材料
export const selectMaterial = data => axios.post('/medicare/dict/selectMaterial', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// POST
// /medicare/dict/addMaterialToDict
// 新增材料
export const addMaterialToDict = data => axios.post('/medicare/dict/addMaterialToDict', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// POST
// /medicare/dict/addMaterialToDict
// 修改材料
export const editMaterialToDict = data => axios.post('/medicare/dict/addMaterialToDict', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

// 删除材料
// DELETE
// /medicare/dict/deleteMaterial
export const deleteMaterial = data => axios.delete(`/medicare/dict/deleteMaterial?id=${data}`);