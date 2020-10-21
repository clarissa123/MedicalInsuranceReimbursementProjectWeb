/*
 * @Descripttion: 
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-08-06 10:59:57
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-10-18 16:48:45
 */
import axios from '@/axios'

// export const fetchUser = (userId, config) => axios.get(`/user/userId/${userId}`, config)

// POST
// /reimburseList/getFlowStatus
// 获取当前状态
export const getFlowStatus = id => axios.post(`/medicare/reimburseList/getFlowStatus?id=${id}`)

// POST
// /reimburseList/dist
// insertDist
export const insertDist = data => axios.post('/medicare/reimburseList/dist', data)

// DELETE
// /reimbursementEvidence/evidence/{id}
// 删除文件
export const deleteEvi = id => axios.delete(`/medicare/reimbursementEvidence/evidence?id=${id}`)

// POST
// /medicare/reimburseList/updateDetail
// 修改列表元素信息
export const updateDetail = data => axios.post('/medicare/reimburseList/updateDetail', data)

// post
// /medicare/reimburseList/list
// 报销列表
export const reimburseList = data => axios.post('/medicare/reimburseList/list', data)

// PUT
// /calculation/chooseRemark
// 选择备注
export const chooseRemark = data => axios.put('/medicare/calculation/chooseRemark', data)

// PUT
// /calculation/batchsurge
// 批量选择手术
export const batchsurge = data => axios.put('/medicare/calculation/batchsurge', data)

// GET
// /calculation/list/{id}
// 核算之后列表接口
export const calList = id => axios.get(`/medicare/calculation/list?id=${id}`)

// GET
// /calculation/materialSurge
// 通过关键字搜索材料相关手术
export const materialSurge = key => axios.get(`/medicare/calculation/materialSurgee?key=${key}`)

// GET
// /calculation/medicinalSearch
// 药品获取备注
export const medicinalSearch = dictId => axios.get(`/medicare/calculation/medicinalSearch?name=${dictId}`)

// GET
// /calculation/summary
// 汇总清单
export const summary = id => axios.get(`/medicare/recheck/summary?rimbursementId=${id}`)

// PUT
// /calculation/updateRemiburseMoney
// 修改报销金额
export const updateRemiburseMoney = data => axios.put('/medicare/calculation/updateRemiburseMoney', data)

// PUT
// /calculation/updateRemiburseMoneys
// 批量修改报销金额
export const updateRemiburseMoneys = data => axios.put('/medicare/calculation/updateRemiburseMoneys', data)

// GET
// /calculation/dynamicInfo
// 动态返回核算进度信息
export const dynamicInfo = id => axios.get(`/medicare/calculation/dynamicInfo?id=${id}`)

// POST
// /calculation/start/{id}
// 开始核算
export const start = id => axios.post(`/medicare/calculation/start?id=${id}`)

// POST
// /reimburseList/updateStatus
// 状态变更 (审批/提交审批)
export const checkData = data => axios.post('/medicare/reimburseList/updateStatus', data)


// --------------------------------  //

// GET
// /reimbursement/detail/{reimbursementId}
// 获取报销单详情
export const reimbursementId = reimbursementId => axios.get(`/medicare/reimbursement/detail?reimbursementId=${reimbursementId}`)

// POST
// /reimbursement/hospitalInfo
// 添加报销医院信息
export const hospitalInfo = data => axios.post('/medicare/reimbursement/hospitalInfo', data)

// GET
// /reimbursement/hospitalLevelList
// 医院等级列表
export const hospitalLevelList = () => axios.get('/medicare/reimbursement/hospitalLevelList')

// GET
// /reimbursement/nlpResult
// nlp数据处理结果 （数据处理）
export const nlpResult = id => axios.get(`/medicare/reimbursement/nlpResult?reimbursementId=${id}`)

// GET
// /reimbursement/ocrResult
// ocr数据处理结果（流程）
export const ocrResult = id => axios.get(`/medicare/reimbursement/ocrResult?reimbursementId=${id}`)

// POST
// /reimbursement/ocrTextAndHandle
// OCR文本识别并数据处理 （要素识别）
export const ocrTextAndHandle = data => axios.post(`/medicare/reimbursement/ocrTextAndHandle?reimbursementId=${data}`);

// POST
// /medicare/reimbursement/ocrResult
// 手动调整表格数据
export const changeOcrResult = data => axios.post('/medicare/reimbursement/ocrResult',data);


// POST
// /reimbursement/personType
// 添加报销人类别
export const personType = data => axios.post('/medicare/reimbursement/personType', data)


// GET
// /reimbursement/personTypeList
// 报销人类别列表
export const personTypeList = () => axios.get('/medicare/reimbursement/personTypeList')

// POST
// /reimbursement/saveResult
// 保存修改后的数据
export const saveResult = data => axios.post('/reimbursement/saveResult', data)


// GET
// /common/file/downloadFileStream
// 注意：responseType必须是arrayBuffer，json是不行的
// 下载文件（文件流）
export const downloadFileStream = fileUrl => axios.get(`/medicare/common/file/downloadFileStream?fileUrl=${fileUrl}`, {
    responseType: 'arraybuffer'
})


// POST
// /common/file/mulUpload
// 多文件上传
export const mulUpload = data => axios.post('/medicare/common/file/mulUpload', data)

// POST
// /calculation/summary/excel/{id}
// 导出
export const excel = id => axios.post(`/medicare/calculation/summary/excel/${id}`, {
    responseType: 'arraybuffer'
})

// POST
// /common/file/upload
// 文件上传
// `${baseURL}/common/file/mulUpload?id=${data.id}`
export const upload = data => axios.post('/medicare/common/file/mulUpload', data)

// POST
// /calculation/history/{id}
// export const history = id => axios.post(`/medicare/recheck/history/${id}`)
export const history = data => axios.post("/medicare/calculation/history", data, {
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * @author: Homastin
 * @date: 2020/3/6  4:06 下午
 * @Description: hongfajing新增 关于header增加的搜索功能接口
 */

/** 获取搜索类型字典表 */
export const dictTypeList = () => axios.get('/medicare/search/DictTypeList')
/** 诊疗列表 */
export const pageDiagnosis = data => axios.post('/medicare/search/pageDiagnosis', data)
/** 材料列表 */
export const pageMaterial = data => axios.post('/medicare/search/pageMaterial', data)
/** 药品列表 */
export const pageMedicinal = data => axios.post('/medicare/search/pageMedicinal', data)
/** 保存单据修改信息 */
export const saveMedicalDoc = data => axios.post('/medicare/reimbursement/updatePage', data)

/**
 * @author: Homastin
 * @date: 2020/5/25  8:01 下午
 * @Description: 新增关于单据核算的 报销分类接口
 */
/** 获取药品分类 **/
export const getSummary = data => axios.get(`/medicare/calculation/getSummary?personType=${data.personType}&type=${data.type}`)

/** 更新药品分类 **/
export const updateKindPage = data => axios.put(`/medicare/calculation/updatePage`, data)

/** 删除单据 **/
export const deleteDocItem = id => axios.delete(`/medicare/calculation/deleteReimbursement?id=${id}`)

/** 修改项目大类分类 **/
export const updateProjectType = data => axios.get(`/medicare/calculation/updateType?groupId=${data.groupId}&type=${data.type}&reimburseId=${data.reimburseId}`)

