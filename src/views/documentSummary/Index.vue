<template>
  <div class="documentSu">
    <div class="list">
      <div class="listBox">
        <div class="top">
          <div class="top-left">
            <el-radio-group v-model="isCollapse">
              <el-radio-button :label="true" class="left">单据详情</el-radio-button>
              <el-radio-button :label="false" class="right">处理日志</el-radio-button>
            </el-radio-group>
          </div>
          <div class="top-right" v-show="isCollapse">
            <el-button type="primary" @click="excel" :disabled="disabled" class="left-btn">导出数据</el-button>
            <el-button type="primary" @click="subSp" :disabled="disabled" v-if="flowStatus === 'SUMMARY'"
              class="right-btn">提交审批</el-button>
          </div>
        </div>
        <div class="tit" v-show="isCollapse">
          <div class="listCity">{{tableData.hospitalName}}</div>
        </div>
        <div class="table" v-show="isCollapse">
          <table v-loading="loading">
            <tr>
              <td class="name">医院名称</td>
              <td colspan="3">{{tableData.hospitalName}}</td>
              <td class="name">医院编码</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">医院级别</td>
              <td>{{tableData.hospitalLevel}}</td>
            </tr>
            <tr>
              <td class="name">病员姓名</td>
              <td>{{tableData.name}}</td>
              <td class="name">性别</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">身份证号</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">年龄</td>
              <td>{{tableData.hosCode}}</td>
            </tr>
            <tr>
              <td class="name">病员单位</td>
              <td colspan="3">{{tableData.hosName}}</td>
              <td class="name">单位编码</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">社保编码</td>
              <td>{{tableData.hosLevel}}</td>
            </tr>
            <tr>
              <td class="name">入院时间</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">出院时间</td>
              <td>{{tableData.hosLevel}}</td>
              <td class="name">住院天数</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">联系电话</td>
              <td>{{tableData.hosLevel}}</td>
            </tr>
            <tr>
              <td class="name">出院诊断</td>
              <td>{{tableData.hosCode}}</td>
              <td colspan="2" class="name">在职、离休“二等、乙级”退休、退职</td>
              <td colspan="2">{{tableData.hosLevel}}</td>
              <td class="name" rowspan="2">病员或家属签字确认是否结清消费</td>
              <td rowspan="2">{{tableData.hosCode}}</td>
            </tr>
            <tr>
              <td class="name">住院医疗费总额</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">上年度职工平均工资</td>
              <td>{{tableData.hosLevel}}</td>
              <td class="name">是否异地或安置人员</td>
              <td>{{tableData.hosCode}}</td>
            </tr>
            <tr>
              <td class="name" :rowspan="proNameLength">
                <span style="display:inline-block;width:20px">个人首先自付金额</span>
              </td>
              <td class="name" colspan="2">项目</td>
              <td class="name">金额</td>
              <td class="name">自付比列</td>
              <td class="name">自付金额</td>
              <td class="name" colspan="2">项目名称</td>
            </tr>
            <!-- zhongbu -->
            <tr v-for="(item, ind) in proName" :key="ind">
              <td class="name2" colspan="2">{{item.summaryType}}</td>
              <td>{{item.summaryMoney}}</td>
              <td>{{item.rate}}</td>
              <td>{{item.typeMoney}}</td>
              <td colspan="2"></td>
            </tr>
            <!-- xiabu -->
            <tr>
              <td class="name" colspan="3">进入统筹支付计算金额</td>
              <td>{{tableData.hosCode}}</td>
              <td class="name">统筹支付比例</td>
              <td class="name" colspan="3">{{tableData.hosCode}}</td>
            </tr>
            <tr>
              <td class="name" colspan="3">统筹支付</td>
              <td colspan="5">{{tableData.hosCode}}</td>
            </tr>
            <tr>
              <td class="name" colspan="3">统筹支付</td>
              <td colspan="5">{{tableData.hosCode}}</td>
            </tr>
            <tr>
              <td class="name" colspan="3">审核应拨金额</td>
              <td colspan="3">{{tableData.hosCode}}</td>
              <td class="name">审批人</td>
              <td class="name">{{tableData.hosLevel}}</td>
            </tr>
            <tr>
              <td class="name" colspan="3">实拨金额</td>
              <td colspan="3">{{tableData.hosCode}}</td>
              <td class="name">审批人</td>
              <td class="name">{{tableData.hosLevel}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="cont" v-show="!isCollapse">
        <div class="block-box">
          <div class="block">
            <el-table :data="activities" style="width: 100%" :header-cell-style="headerCellStyle"
              :cell-style="{'text-align': 'center'}" stripe v-loading="loading">
              <el-table-column type="index" label="序号" :index="indexMethod"></el-table-column>
              <el-table-column prop="userName" label="用户名"></el-table-column>
              <el-table-column prop="describe" label="操作内容"></el-table-column>
              <el-table-column prop="createTime" label="操作时间"></el-table-column>
            </el-table>
          </div>
          <div class="page">
            <el-pagination @current-change="handleCurrentChange" :background="true" :hide-on-single-page="true"
              :current-page.sync="queryParams.pageNum" :page-size="queryParams.pageSize"
              layout="prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 审批 -->
    <el-dialog title="汇总审批" :visible.sync="spDialogVisible" width="20%" class="spD" center>
      <div class="centerD">
        <el-radio v-model="isPass" label="1">通过</el-radio>
        <el-radio v-model="isPass" label="0">不通过</el-radio>
        <div v-show="isPass !== '1'" class="centerBox">
          <div style="text-align: left;margin-bottom:5px">
            <span style="color:red">*</span>不通过原因
          </div>
          <el-input type="textarea" v-model="refReason"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="spDialogVisible = false" type="primary" plain>取 消</el-button>
        <el-button type="primary" @click="subCheck">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 回填业务系统 -->
    <el-dialog title="自动录入" :visible.sync="htDialogVisible" width="30%" class="lrDia" center>
      <div class="centerBox2">
        <img src="@/assets/loading.jpg" alt />
        <span style="display:inline-block;padding:30px 0 0 0;">系统正在将报销结算表录入系统，请不要操作电脑…</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="htDialogVisible = false" type="primary" plain>取 消</el-button>
        <el-button type="primary" @click="htDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    headerCellStyle,
    baseURL,
    KEYS
  } from "@/config";
  import {
    getStorageItem,
    setStorageItem,
    exportExcel
  } from "@/utils";
  import Api from "@/api";

  export default {
    name: "Index",
    data() {
      return {
        headerCellStyle,
        isCollapse: true,
        activities: [],
        spDialogVisible: false,
        htDialogVisible: false,
        tableData: {
          //姓名
          name: '',
          //医院等级
          hospitalLevel: '',
          //医院名字
          hospitalName: '',
          hosName: "",
          hosCode: "",
          hosLevel: "",
        },
        loading: false,
        proName: [],
        refReason: "",
        isPass: "1",
        role: "",
        dataId: "",
        disabled: false,
        flowStatus: "SUMMARY",
        queryParams: {
          pageSize: 10,
          pageNum: 1,
        },
        total: 0,
      };
    },
    computed: {
      proNameLength() {
        return this.proName ? this.proName.length + 1 : 1;
      },
    },
    mounted() {
      this.flowStatus = this.$route.query.status;
      this.$eventBus.$emit("bread", "hyo");
      this.dataId = this.$route.query.id;
      this.getData();
      this.getProgress();
    },
    methods: {
      handleCurrentChange(val) {
        this.queryParams.pageNum = val;
        this.getData();
      },
      indexMethod(index) {
        return (
          index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
        );
      },
      excel() {
        const winHeight = window.document.documentElement.clientHeight - 10;
        const url = `${baseURL}/medicare/calculation/summary/excel?id=${this.dataId}`;
        const formStr =
          `<form style="visibility:hidden;" method="POST" action="${url}">` +
          "</form>";
        const win = window.open(
          "",
          "_blank",
          `height=${winHeight},top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes`
        );
        win.document.body.innerHTML = formStr;
        win.document.forms[0].submit();
        // window.open(`${baseURL}/calculation/summary/excel/${this.dataId}`)
        // this.disabled = true
        // Api.submit.excel(this.dataId).then((res) => {
        //   exportExcel(res, '.xlsx')
        //   this.disabled = false
        // }).catch(() => {
        //   this.disabled = false
        //   this.$message.error('系统错误')
        // })
      },
      getProgress() {
        let params = {
          id: this.dataId,
          pageSize: this.queryParams.pageSize,
          pageNum: this.queryParams.pageNum,
        };
        Api.submit
          .history(params)
          .then((res) => {
            if (res.code === 1000) {
              this.activities = res.data.list;
              this.total = res.data.total;
            } else {
              this.$message.error("系统错误");
            }
          })
          .catch(() => {
            this.$message.error("系统错误");
          });
      },
      subSp() {
        // tijiao
        this.disabled = true;
        this.loading = true;
        const req = {
          flowStatus: "WAIT_EXAMINE",
          id: this.dataId,
        };
        Api.submit
          .checkData(req)
          .then((res) => {
            if (res.code === 1000) {
              this.$message({
                showClose: true,
                message: "提交成功",
                type: "success",
              });
              this.$router.push({
                path: "/documents/docIndex/summary",
                query: {
                  id: this.dataId,
                  status: "WAIT_EXAMINE",
                },
              });
              this.flowStatus = "WAIT_EXAMINE";
              this.disabled = false;
            } else {
              this.$message.error("系统错误");
              this.disabled = false;
            }
            this.loading = false;
          })
          .catch(() => {
            this.$message.error("系统错误");
            this.disabled = false;
            this.loading = false;
          });
      },
      subCheck() {
        // 提交审核原因
        const req = {
          flowStatus: this.isPass === "1" ? "EXAMINE_SUCCESS" : "EXAMINE_ERROR",
          id: this.dataId,
          reason: this.refReason,
        };
        if (this.isPass === "0" && !this.refReason) {
          this.$message.error("请填写不通过的原因");
          return;
        }
        Api.submit
          .checkData(req)
          .then((res) => {
            if (res.code === 1000) {
              this.$message({
                showClose: true,
                message: "审核成功",
                type: "success",
              });
              this.spDialogVisible = false;
              this.$router.push({
                path: "/documents/list",
              });
            } else {
              this.$message.error("系统错误");
            }
          })
          .catch(() => {
            this.$message.error("系统错误");
          });
      },
      getData() {
        this.loading = true;
        Api.submit
          .summary(this.dataId)
          .then((res) => {
            if (res.status === 200) {
              this.proName = res.data.detailResDTOS;
              // this.hosName = res.data.hospitalName;
              this.tableData = res.data;
              // setStorageItem('summ', res.data.detailResDTOS)
            } else {
              this.$message.error(res.message);
            }
            this.loading = false;
          })
          .catch((err) => {
            // this.$message.error('系统错误！')
            this.loading = false;
          });
      },
      toGo(desc) {
        let url = "";
        switch (desc) {
          case "上传文件":
            url = "/documents/docIndex/documentsDet";
            break;
          case "OCR文本识别,数据处理":
            url = "/documents/docIndex/documentsDet";
            break;
          case "单据核算":
            url = "/documents/docIndex/documentsDet";
            break;
          case "单据汇总":
            url = "/documents/docIndex/cacResult";
            break;
          case "提交审批":
            url = "/documents/docIndex/summary";
            break;
          case "审批通过":
            url = "/documents/docIndex/summary";
            break;
          default:
            url = "/documents/docIndex/summary";
        }
        const obj = {
          id: this.dataId,
        };
        if (url === "/documents/docIndex/documentsDet") {
          obj.status = "SUMMARY";
        }
        console.log(url, obj);
        this.$router.push({
          path: url,
          query: obj,
        });
      },
    },
  };
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

  .documentSu {
    background-color: #fff;
    border-radius: 10px;
    height: calc(100vh - 130px);
    overflow: hidden;

    /deep/.el-radio-button__inner {
      height: 40px;
      padding: 5px 20px;
      line-height: 30px;
    }

    /deep/.left {
      .el-radio-button__inner {
        border-radius: 100px 0px 0px 100px;
      }
    }

    /deep/.right {
      .el-radio-button__inner {
        border-radius: 0px 100px 100px 0px;
      }
    }

    /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background: rgba(92, 150, 255, 1);
    }
  }

  .list {
    position: relative;

    .btn {
      width: inherit;
      text-align: center;
      padding: 25px 0;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      right: 0;
      box-shadow: 0 -1px 5px rgba(214, 213, 213, 0.5);
      border-radius: 0 0 10px 10px;
    }

    .cont {
      height: calc(100vh - 130px);
      width: 100%;
      overflow-y: scroll;
      position: absolute;
      padding: 5px;
      top: 100px;
      padding: 0 32px;
      box-sizing: border-box;
    }

    width: 100%;

    .listBox {
      height: calc(100vh - 130px);
      overflow-y: scroll;
      padding: 24px 32px;
      box-sizing: border-box;

      .top {
        display: flex;
        justify-content: space-between;

        .top-left {}

        .top-right {
          display: flex;
          justify-content: flex-end;

          .left-btn,
          .right-btn {
            width: 120px;
            height: 50px;
            background: rgba(64, 104, 182, 1);
            border-radius: 25px;
            border-color: transparent;
            font-family: "PingFang Medium";
          }
        }
      }
    }

    .tit {
      text-align: center;
      padding: 10px 0;

      .listCity {
        font-size: 20px;
        font-weight: bolder;
      }

      .titCity {
        font-size: 20px;
      }
    }

    .time {
      width: 800px;
      margin: 0 auto;
      text-align: right;

      .timeB {
        display: inline-block;
        text-align: center;
        border-bottom: 1px solid #a7a7b7;
        min-width: 80px;
      }
    }

    .table {
      width: 960px;
      margin: 10px auto 20px;

      table {
        // width: 300px;
        width: 100%;
        border: 1px solid #a7a7b7;
        border-collapse: collapse;

        /*关键代码*/
        th,
        td {
          text-align: center;
          border: 1px solid #a7a7b7;
        }

        .name {
          color: #333;
          width: 110px;
          padding: 10px 5px;
        }

        .name2 {
          padding: 10px 5px;
          color: #333;
        }
      }
    }
  }

  .centerD {
    width: 100%;
    text-align: center;
    padding: 0 15px;

    .centerBox {
      margin: 20px 0 0 0;
    }
  }

  .dialog-footer {
    /deep/.el-button--primary {
      padding: 8px 30px;
    }
  }

  .lrDia {
    img {
      height: 100px;
      transform: scale(3);
    }

    .centerBox2 {
      display: flex;
      flex-flow: column;
      align-items: center;
    }
  }
</style>