<template>
  <div>
    <div class="table">
      <div class="head">
        <div style='margin-right: 24px;'>
          <span style="width: 80px;font-size:14px">报销状态：</span>
          <el-select v-model="search.state" placeholder="请选择" size="small" clearable @change="goSearch">
            <el-option v-for="item in optionsState" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="timeP">
          <el-radio-group v-model="radioTime" size="small" class="search-radioTime" style="display: flex;"
            @change="changeTimeBtn">
            <el-radio-button v-for="(item,index) in timeDatas" :key="index" :label="item.code" border>{{item.name}}
            </el-radio-button>
          </el-radio-group>
          <el-date-picker v-show="isZdy" @change="goSearch('time')" size="small" v-model="ZdyTime" type="daterange"
            :picker-options="pickerOptions" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div style="margin-left: 15px; margin-right: 24px">
          <span style="width: 80px;font-size:14px">核算比例：</span>
          <el-select v-model="search.rateRange" placeholder="请选择" size="small" clearable @change="changeRateRange">
            <el-option v-for="item in rateRangeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-right: auto">
          <el-input placeholder="请输入内容" v-model="search.words" class="search-words" size="small"
            suffix-icon="el-icon-search" @input="goSearch" clearable>
          </el-input>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" @cell-dblclick='editClick' :header-cell-style="headerCellStyle"
          :cell-style="{'text-align': 'center'}" stripe v-loading="loading" :row-style="rowStyle">
          <el-table-column width="150x" label="社保编码">
            <template slot-scope="scope">
              <span
                v-show="editId.indexOf(scope.row.id)<0 || editId.indexOf('socialSecurityCode')<0">{{scope.row.socialSecurityCode}}</span>
              <el-input v-show="editId.indexOf(scope.row.id)>-1 && editId.indexOf('socialSecurityCode')>-1"
                v-model="scope.row.socialSecurityCode" placeholder="社保编码" :ref='scope.row.id+"socialSecurityCode"'
                @blur="subEdit(scope.row)" @keyup.enter.native="$event.target.blur"></el-input>
            </template>
          </el-table-column>
          <el-table-column width="150px" label="报销人姓名">
            <template slot-scope="scope">
              <span v-show="editId.indexOf(scope.row.id)<0 || editId.indexOf('patient')<0">{{scope.row.patient}}</span>
              <el-input v-show="editId.indexOf(scope.row.id)>-1 && editId.indexOf('patient')>-1"
                v-model="scope.row.patient" placeholder="报销人姓名" :ref='scope.row.id+"patient"' @blur="subEdit(scope.row)"
                @keyup.enter.native="$event.target.blur"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="flowStatusCn" label="报销状态">
          </el-table-column>
          <el-table-column prop="totalMoney" label="报销金额">
            <template slot-scope="scope">
              <span
                v-show="editId.indexOf(scope.row.id)<0 || editId.indexOf('totalMoney')<0">{{scope.row.totalMoney}}</span>
              <el-input v-show="editId.indexOf(scope.row.id)>-1 && editId.indexOf('totalMoney')>-1"
                v-model="scope.row.totalMoney" placeholder="报销金额" :ref='scope.row.id+"totalMoney"'
                @blur="subEdit(scope.row)" @keyup.enter.native="$event.target.blur"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="reiburseTotalMoney" label="核算金额">
          </el-table-column>
          <el-table-column prop="reiburseRate" label="核算比例">
          </el-table-column>
          <el-table-column prop="createTime" label="上传时间">
          </el-table-column>
          <el-table-column width="300" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <span class="look" v-show="(role === 'RE_EXAMINE') && (scope.row.flowStatus !== 'WAIT_OCR')"
                  @click="goDetail(scope.row, '/documents/docIndex/documentsDetFuHe')" v-if="detailBtn">详情</span>
                <span class="look" v-show="(scope.row.flowStatus === 'EXAMINE_SUCCESS') && (role === 'RE_EXAMINE')"
                  @click="goDetail(scope.row,'/documents/docIndex/summaryFuHe')" v-if="returnBtn">单据回填</span>
                <span class="look" v-show="(scope.row.flowStatus === 'WAIT_EXAMINE') && (role === 'RE_EXAMINE')"
                  @click="goDetail(scope.row,'/documents/docIndex/summaryFuHe')" v-if="passBtn">审批</span>
                <span class="look look-red" @click="handleDeleteDocItem(scope.row)" v-if="deleteBtn">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination @current-change="handleCurrentChange" :background="true" :current-page.sync="search.currentPage"
          :page-size="10" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 手动上传 -->
    <el-dialog title="上传" :visible.sync="flieDialogVisible" width="25%" :close-on-click-modal="false" class="upDiaBox"
      close center>
      <el-upload class="upload-demo" ref="upload" action="" multiple :http-request="httpRequest"
        :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :before-upload="beforeAvatarUpload"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">添加文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传 pdf 文件，且不超过500M</div>
      </el-upload>
    </el-dialog>
    <el-dialog title="单据预览" :visible.sync="lookVisible" width="45%" :before-close="handleClose" center>
      <div v-loading="loadingImg" style="minHeight:50px;minWidth:50px">
        <img :src="lookImg" class='lookimg' alt="">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('1')">取 消</el-button>
        <el-button type="primary" @click="handleClose('1')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    isAuth
  } from '@/router/index.js';
  import PageHeader from '@/components/layer/PageHeader'
  import Api from '@/api'
  import {
    headerCellStyle,
    rowStyle,
    baseURL,
    KEYS
  } from '@/config'
  import {
    getStorageItem,
    setStorageItem,
    removeStorageItem,
    getDateByType
  } from '@/utils'

  export default {
    name: 'docList',
    components: {
      PageHeader
    },
    data() {
      return {
        loadingImg: false,
        role: '',
        optionsState: [{
          value: '',
          label: '全部'
        }, {
          value: 'WAIT_OCR',
          label: '待识别'
        }, {
          value: 'NLP_SUCCESS',
          label: '待调整'
        }, {
          value: 'COMPLETE_CALCULATION',
          label: '待汇总'
        }, {
          value: 'SUMMARY',
          label: '已汇总'
        }, {
          value: 'WAIT_EXAMINE',
          label: '待审批'
        }, {
          value: 'EXAMINE_SUCCESS',
          label: '审批通过'
        }, {
          value: 'EXAMINE_ERROR',
          label: '审批不通过'
        }, {
          value: 'BACKFILL',
          label: '已报销'
        }],
        timeDatas: [{
            name: '全部',
            code: ''
          },
          {
            name: '近7天',
            code: '7days'
          },
          {
            name: '今天',
            code: 'today'
          },
          {
            name: '自定义时间',
            code: 'RKSJ_ZDY'
          }
        ],
        search: {
          state: '',
          words: '',
          valueTime: '',
          currentPage: 1,
          pageSize: 10,
          rateRange: '',
          rateRangeMax: '',
          rateRangeMin: ''
        },
        radioTime: '',
        tableData: [],
        flieDialogVisible: false,
        lookVisible: false,
        lookImg: '',
        fileList: [],
        ZdyTime: [],
        multipleSelection: [],
        headerCellStyle,
        rowStyle,
        total: 0,
        loading: false,
        pickerOptions: {
          disabledDate: time => time.getTime() > Date.now()
        },
        fileData: new FormData(),
        editId: '',
        rateRangeOptions: [{
            label: '0%-20%',
            value: '0-0.2',
          },
          {
            label: '20%-40%',
            value: '0.2-0.4'
          },
          {
            label: '40%-60%',
            value: '0.4-0.6'
          },
          {
            label: '60%-80%',
            value: '0.6-0.8'
          },
          {
            label: '80%-100%',
            value: '0.8-1'
          },
        ],
        //按钮权限
        detailBtn: '',
        passBtn: '',
        returnBtn: '',
        deleteBtn: '',
      }
    },
    watch: {
      lookImg(nV, oV) {
        if (nV !== oV) {
          this.loadingImg = false
        }
      }
    },
    computed: {
      isZdy() {
        return this.radioTime === 'RKSJ_ZDY'
      }
    },
    mounted() {
      //报销审核员
      this.role = 'RE_EXAMINE';
      this.detailBtn = isAuth("/medicare/reimbursement/detail");
      this.passBtn = isAuth("/medicare/reimburseList/updateStatus");
      this.returnBtn = isAuth("/fuHeList/return"); //单据回填暂时没有
      this.deleteBtn = isAuth("/medicare/calculation/deleteReimbursement");
      this.getList()
    },
    methods: {
      /**
       * @author: Homastin
       * @date: 2020/5/26  6:00 下午
       * @Description: 删除单据
       */
      handleDeleteDocItem(row) {
        console.log(row);
        Api.submit.deleteDocItem(row.id).then(res => {
          if (res.code === 1000) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
      },
      handleClose(done) {
        this.lookVisible = false
        this.lookImg = ''
        if (done !== '1') {
          done()
        }
      },
      editClick(row, column, cell, event) { // 双击修改
        console.log(row, column, cell, event)
        let refName = ''
        if (column.label === '社保编码') {
          refName = `${row.id}socialSecurityCode`
        } else if (column.label === '报销人姓名') {
          refName = `${row.id}patient`
        } else if (column.label === '报销金额') {
          refName = `${row.id}totalMoney`
        }
        this.editId = refName
        this.$nextTick(() => {
          this.$refs[refName].$el.querySelector('input').focus()
        })
      },
      subEdit(row) { // 提交修改信息接口
        const req = {
          id: row.id,
          patient: row.patient,
          socialSecurityCode: row.socialSecurityCode,
          totalMoney: row.totalMoney
        }
        Api.submit.updateDetail(req).then((res) => {
          if (res.code === 1000) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.editId = ''
            this.getList()
          } else {
            this.$message.error('修改失败')
          }
        }).catch((err) => {
          this.$message.error('修改失败')
        })
      },
      httpRequest(file) {
        this.fileList.push(file.file)
      },
      // 手动上传 1
      submitUpload() {
        this.$refs.upload.submit()
        this.fileData = new FormData()
        this.fileList.forEach((file) => {
          this.fileData.append('file', file)
        })
        Api.submit.mulUpload(this.fileData).then((res) => {
          if (res.code === 1000) {
            console.log('上传成功')
            this.fileData = null
            this.fileList = []
            this.flieDialogVisible = false
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        }).catch((err) => {
          this.$message.error('上传失败')
        })
      },
      // 手动上传 2
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      // 手动上传 3
      handlePreview(file) {
        console.log(file)
      },
      // 手动上传 0上传文件之前的钩子
      beforeAvatarUpload(file) {
        const isJPG = (file.type.indexOf('application/pdf') === 0) && (/\.(?:pdf|PDF)$/.test(file.name))
        const isLt2M = file.size / 1024 / 1024 < 400
        if (!isJPG) {
          this.$message.error('上传的文件只能是 pdf 格式!')
        } else if (!isLt2M) {
          this.$message.error('上传的文件大小不能超过 500MB!')
        }
        // console.log(file, this.fileList)
        return isJPG && isLt2M
      },
      // 时间按钮切换 全部 近7天 今天 自定义
      changeTimeBtn(val) {
        console.log(val)
        if (val !== 'RKSJ_ZDY') {
          this.search.valueTime = val === '' ? '' : getDateByType(val)
        }
        this.goSearch()
      },
      /**
       * @author: Homastin
       * @date: 2020/5/6  10:18 上午
       * @Description: 增加核算比例
       */
      changeRateRange(e) {
        console.log(e);
        const rateArr = e.split('-')
        this.search.rateRangeMin = rateArr[0]
        this.search.rateRangeMax = rateArr[1]
        this.goSearch()
      },
      goSearch(type) { // 下拉框搜索
        if (type === 'time') {
          console.log(this.ZdyTime)
          this.search.valueTime = [`${this.ZdyTime[0]} 00:00:00`, `${this.ZdyTime[1]} 23:59:59`]
        }
        this.search.currentPage = 1
        this.getList()
      },
      getList() {
        this.loading = true
        this.multipleSelection = []
        let req = {
          endTime: this.search.valueTime ? this.search.valueTime[1] : '',
          flowStatus: this.search.state,
          keyWord: this.search.words,
          organizationId: '',
          pageNum: this.search.currentPage,
          pageSize: 10,
          startTime: this.search.valueTime ? this.search.valueTime[0] : ''
        }
        if (this.search.rateRangeMin !== '') {
          req.rateRangeMin = this.search.rateRangeMin
        }
        if (this.search.rateRangeMax !== '') {
          req.rateRangeMax = this.search.rateRangeMax
        }
        console.log(req)
        Api.submit.reimburseList(req).then((res) => {
          if (res.code === 1000) {
            console.log(res.data)
            this.tableData = res.data.list
            this.total = res.data.total
          } else {
            this.$message.error('获取数据失败')
          }
          this.loading = false
        }).catch((err) => {
          this.$message.error('获取数据失败')
          this.loading = false
        })
      },
      importF() {
        this.currentFile = 1
        this.fileList = []
        this.allFile = 0
        this.imageL = []
        this.flieDialogVisible = true
      },
      handleCurrentChange(val) {
        this.search.currentPage = val
        this.getList()
      },
      goDetail(data, type) {
        if (type === 'look') { //预览
          this.loadingImg = true
          Api.submit.downloadFileStream(data.firstUrl).then((res) => {
            const imgbase64 =
              `data:image/png;base64,${btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`
            this.lookImg = imgbase64
          })
          this.$nextTick(() => {
            this.lookVisible = true
          })
          return
        }
        setStorageItem('fileSize', data.fileSize)
        this.$router.push({
          path: type,
          query: {
            id: data.id,
            status: data.flowStatus,
          }
        })
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "../../assets/myStyle/mixin.scss";

  .el-pagination {
    text-align: center;
  }

  /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
    background: rgba(64, 104, 182, 1);
    border-radius: 6px;
  }

  /deep/.el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 6px;
  }

  .table {
    background-color: #fff;
    border-radius: 10px;
    margin-top: 22px;
    min-height: calc(100vh - 355px);

    .head {
      display: flex;
      align-items: center;
      color: 14px;
      padding: 0 32px;
      box-sizing: border-box;

      .timeP {
        .el-range-editor--small.el-input__inner {
          width: 270px;
          margin-left: 15px;
        }

        /deep/.el-date-editor .el-range-separator {
          width: 10%;
        }
      }

      /deep/ .el-input--small .el-input__inner {
        height: 40px;
        line-height: 40px;
      }

      /deep/.search-state {
        width: 180px;
      }

      /deep/.search-rateRange {
        width: 180px;
      }

      /deep/.search-radioTime {
        .el-radio-button--small .el-radio-button__inner {
          height: 40px;
          font-size: 14px;
          color: #7F7F7F;
          padding: 12px 15px;
        }

        .el-radio-button__orig-radio:checked+.el-radio-button__inner {
          color: #fff;
        }
      }

      .el-range-editor--small.el-input__inner {
        height: 40px;
      }

      .el-range-editor--small .el-range-separator {
        line-height: 30px;
      }

      /deep/.search-words {
        width: 322px;
      }

    }

    .head>div {
      display: flex;
      align-items: center;

      .el-select {
        width: 140px;
      }
    }

    .table {
      padding: 0 15px;

      .look {
        color: $font-btn-blue;
        cursor: pointer;
        margin: 0 20px;
      }

      .look-red {
        color: $font-btn-red;
      }
    }

    .page {
      text-align: center;
      padding: 20px 0;
    }
  }

  /deep/.upload-demo {
    text-align: center
  }

  .lookimg {
    width: 100%;
  }
</style>