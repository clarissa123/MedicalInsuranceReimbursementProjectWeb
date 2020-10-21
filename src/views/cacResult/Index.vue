<template>
  <div class="document-wrapper">
    <div class="box">
      <div class="titBox">
        <div class="title">报销单据原件</div>
        <div class="full-screen-checkbox">
          <el-switch active-text="全屏查看" v-model="open"></el-switch>
          <el-switch active-text="展示其他类别" v-model="showOtherClass"></el-switch>
        </div>
      </div>
      <div class="pagePart">
        <div style="textAlign: center;" class="page-item">
          <i class="el-icon-arrow-left" @click="changePage(0)"></i>
          <el-input v-model="curPage" @keyup.enter.native="changePage(2)"></el-input>/
          <span class="iconPage">{{imgLength}}</span>
          <i class="el-icon-arrow-right" @click="changePage(1)"></i>
        </div>
        <div class="page-item cu-right">
          <div class="table-page">
            <i class="el-icon-arrow-left" @click="changePage(0)"></i>
            <el-input v-model="curPage" @keyup.enter.native="changePage(2)"></el-input>/
            <span class="iconPage">{{imgLength}}</span>
            <i class="el-icon-arrow-right" @click="changePage(1)"></i>
          </div>
        </div>
      </div>
      <div v-loading="loading" class="cu-check-list-box">
        <div class="ttt">
          <Check-list
            :open.sync="open"
            :reimburseId="dataId"
            :canvasId="canvasId"
            :showOtherClass.sync="showOtherClass"
            :rotationAngle.sync="rotationAngle"
            :width.sync="wrapperWidth"
            :editData.sync="editData"
            @changEdit="changEdit"
            :refresh="refresh"
            :tableData.sync="docCheData"
            :hosName.sync="hosName"
            @getCheckData="getCheckData"
            :personType="personType"
            :updatedReimbursementKinds.sync="updatedReimbursementKinds"
            :src.sync="imageSrc"
          ></Check-list>
        </div>
      </div>
      <div class="tipPart">
        <!-- <div class="center"> -->
        <!-- <img src="@/assets/warning.png" alt class="icon1" />
          <span>温馨提示：单击关注要素，可对比原件与OCR差异</span>
          <div style="flex:1;margin-left:25px;">
            <span v-for="(i, ind) in dataExm" :key="ind">
              <el-tag :color="i.color" class="squa" effect="dark"></el-tag>
              {{i.name}}
            </span>
        </div>-->
        <!-- <div style="margin-left:24px;" v-show="totalM != 0">
            费用合计：
            <span>{{totalM}}</span>
          </div>
        </div>-->
        <div class="btns">
          <!-- <el-button type="primary" @click="ppDialogVisible = true" v-if="(flowStatsu == '0')||(flowStatsu == '1')">提交核算</el-button> -->
          <el-button type="primary" @click="beforeSubCal" v-if="(flowStatsu == '2')">提交汇总</el-button>
        </div>
      </div>
    </div>
    <!-- 汇总/核算/上传成功 -->
    <el-dialog
      :title="tipName"
      :visible.sync="tipDialogVisible"
      width="25%"
      :close-on-click-modal="false"
      :show-close="false"
      class="tipDialog"
      center
    >
      <!-- 汇总 /核算 -->
      <div v-if="diaState === '1'" class="tipDiaBox">
        <img src="@/assets/loading.jpg" alt class="img1" />
        <div style="padding:30px 0 20px 0;">{{tipContent1}}</div>
        <div>{{tipContent2}}</div>
      </div>
      <!-- 上传成功 -->
      <div v-else class="tipDiaBox">
        <img src="@/assets/fin.png" alt class="img2" />
        <div>{{tipContent3}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import PageHeader from '@/components/layer/PageHeader'
import { getStorageItem, setStorageItem, exportFile } from "@/utils";
import annotationData from "@/components/text-annotation/text-annotation.json";
import { baseURL, KEYS } from "@/config";
import Api from "@/api";
import axios from "@/axios";
import { setInterval, clearInterval, setTimeout, clearTimeout } from "timers";
import CheckList from "@/components/checkList/CheckList";

export default {
  name: "DataDetail",
  components: {
    "Check-list": CheckList,
  },
  data() {
    return {
      open: true,
      dataId: "",
      isExist: false,
      totalM: 0,
      dataExm: [
        {
          name: "需确认诊疗项目",
          color: "rgba(43,135,238,.2)",
        },
        {
          name: "需确认药品备注",
          color: "rgba(255,192,203,.5)",
        },
        {
          name: "需确认手术名称",
          color: "rgba(128,128,128,.5)",
        },
        {
          name: "数据异常",
          color: "rgba(128, 15, 0, 0.5)",
        },
        {
          name: "模糊匹配项目",
          color: "rgba(235, 224, 128, 0.5)",
        },
        {
          name: "精确匹配项目",
          color: "rgba(105, 179, 105, 0.5)",
        },
        {
          name: "已修改数据",
          color: "rgba(155, 104, 236, 0.5)",
        },
      ],
      tipDialogVisible: false,
      imageList: [], // 图片数组
      curPage: 0,
      tipName: "要素整理",
      tipContent1: "正在自动识别单据要素，请稍后…",
      tipContent2: "",
      tipContent3: "正在整理单据要素数据，即将完成…",
      diaState: "2",
      canvasId: "canvas",
      imageSrc: "",
      loading: false,
      docData: null, // 单据详情源数据
      wrapperWidth: "", // 组件容器宽度
      refresh: true,
      flowStatsu: "0", // 流转状态
      docCheData: [], // 核算后源数据
      hosName: "", // xingming
      imageL: [],
      canGo: true,
      rotationAngle: 0,
      editData: [], // 批量修改的数据
      role: "",
      personType: "",
      updatedReimbursementKinds: {
        ownCostIds: [],
        updateSummaryReqDTOS: [],
        toClGroupIds: [],
        toYpGroupIds: [],
        toZlGroupIds: [],
      },
      showOtherClass: true,
    };
  },
  computed: {
    fileListLength() {
      return this.imageL.length;
    },
    imgLength() {
      return this.imageList.length;
    },
  },
  mounted() {
    // 拿到id及状态，确认面包屑 breadList内容，
    this.dataId = this.$route.query.id;
    this.pages = getStorageItem("fileSize"); // 单据数量
    this.role = getStorageItem("UserInfo")
      ? getStorageItem("UserInfo").roleType
      : "";
    this.getCheckData();
    this.init();
  },
  methods: {
    changEdit(req) {
      let change = false;
      this.editData.forEach((ele) => {
        if (ele.groupId === req.groupId) {
          ele = req;
          change = true;
        }
      });
      if (!change) {
        this.editData.push(req);
      }
    },
    async beforeSubCal() {
      // 提交汇总前
      this.tipDialogVisible = true;
      this.$nextTick(() => {
        this.tipName = "自动汇总";
        this.tipContent3 = "系统正在汇总报销结算表，请稍后…";
        this.diaState = "3";
      });
      if (this.editData.length > 0) {
        // 提交编辑当前页面
        Api.submit
          .updateRemiburseMoneys(this.editData)
          .then(async (res) => {
            if (res.code === 1000) {
              this.editData = [];
              this.updateCostKinds();
              this.subCal();
            } else {
              this.tipDialogVisible = false;
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.tipDialogVisible = false;
            this.$message.error("修改自费金额失败");
          });
      } else {
        this.updateCostKinds();
        this.subCal();
      }
    },
    subCal() {
      Api.submit
        .summary(this.dataId)
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data)
            this.tipDialogVisible = false;
            // this.$eventBus.$emit('bread', '面包') // 面包屑刷新
            this.$router.push({
              path: "/documents/docIndex/summary",
              query: {
                id: this.dataId,
                status: "SUMMARY",
              },
            });
            // setStorageItem('summ', res.data.detailResDTOS)
          } else {
            this.$message.error(res.message);
            this.tipDialogVisible = false;
          }
        })
        .catch((err) => {
          this.tipDialogVisible = false;
          this.$message.error("操作失败,存在未确认的项目！");
        });
    },
    /**
     * @author: Homastin
     * @date: 2020/5/26  5:11 下午
     * @Description: calculation/updatePage 更新报销分类
     */
    updateCostKinds() {
      let ownCostIds = this.updatedReimbursementKinds.ownCostIds;
      let updateSummaryReqDTOS = this.updatedReimbursementKinds
        .updateSummaryReqDTOS;
      updateSummaryReqDTOS.map((u) => {
        const groupIdIndex = ownCostIds.findIndex((o) => o === u.groupId);
        if (groupIdIndex > -1) {
          ownCostIds.splice(groupIdIndex, 1);
        }
      });
      this.updatedReimbursementKinds.toClGroupIds = this.updatedReimbursementKinds.toClGroupIds.map(
        (m) => m.groupId
      );
      this.updatedReimbursementKinds.toYpGroupIds = this.updatedReimbursementKinds.toYpGroupIds.map(
        (m) => m.groupId
      );
      this.updatedReimbursementKinds.toZlGroupIds = this.updatedReimbursementKinds.toZlGroupIds.map(
        (m) => m.groupId
      );

      if (
        !ownCostIds.length &&
        !updateSummaryReqDTOS.length &&
        !this.updatedReimbursementKinds.toClGroupIds.length &&
        !this.updatedReimbursementKinds.toYpGroupIds.length &&
        !this.updatedReimbursementKinds.toZlGroupIds.length
      ) {
        return;
      }
      Api.submit
        .updateKindPage(this.updatedReimbursementKinds)
        .then((res) => {
          console.log(res, "updatedReimbursementKinds");
          this.updatedReimbursementKinds.ownCostIds = [];
          this.updatedReimbursementKinds.updateSummaryReqDTOS = [];
          this.updatedReimbursementKinds.toClGroupIds = [];
          this.updatedReimbursementKinds.toYpGroupIds = [];
          this.updatedReimbursementKinds.toZlGroupIds = [];
        })
        .catch((err) => {
          this.$message.error("更新报销分类失败");
        });
    },
    getCheckData(editFresh) {
      // 获取核算之后的右侧列表
      this.loading = true;
      Api.submit
        .calList(this.dataId)
        .then((res) => {
          console.log("res", res);
          if (res.code === 1000) {
            this.$eventBus.$emit("bread", "面包"); // 面包屑刷新
            // console.log(res, '获取核算之后的右侧列表')
            this.allDocCheData = res.data.fileResDTOS; // 个人所有页
            // 名字
            this.hosName = res.data.hospitalName;
            this.personType = res.data.personType;
            // 总费用
            this.totalM = 0;
            this.imageList = [];
            this.allDocCheData.forEach((ele) => {
              this.imageList.push(ele.fileUrl);
            });
            if (editFresh) {
              // 如果是编辑刷新
              const arr = [];
              res.data.fileResDTOS[
                this.curPage - 1
              ].calculationTrResDTOS.forEach((ele) => {
                ele.calculationTdDetailResDTOS.forEach((row) => {
                  arr.push(row);
                });
              });
              this.docCheData = arr;
              console.log("this.docCheData0", this.docCheData);
              this.rotationAngle =
                res.data.fileResDTOS[this.curPage - 1].rotationAngle;
              this.isExist = false;
              this.$nextTick(() => {
                this.flowStatsu = "2";
                this.isExist = true;
                this.loading = false;
                this.imageListDown(0, this.imageList[this.curPage - 1]);
              });
              return;
            }
            this.curPage = 1;
            // 第一页
            const arr = [];
            res.data.fileResDTOS[0].calculationTrResDTOS.forEach((ele) => {
              ele.calculationTdDetailResDTOS.forEach((row) => {
                row.originType = row.dictType;
                arr.push(row);
              });
            });
            this.rotationAngle = res.data.fileResDTOS[0].rotationAngle;
            this.docCheData = arr;
            console.log("this.docCheData1", this.docCheData);
            this.isExist = false;
            this.$nextTick(() => {
              this.flowStatsu = "2";
              this.isExist = true;
              this.imageListDown(0, this.imageList[0]);
            });
          } else {
            this.$message.error("核算后展示失败");
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("核算后展示失败");
        });
    },
    imageListDown(cur, fileUrl) {
      // console.log(fileUrl)
      Api.submit.downloadFileStream(fileUrl).then((res) => {
        const imgbase64 = `data:image/png;base64,${btoa(
          new Uint8Array(res).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;
        this.imageSrc = imgbase64;
        this.refresh = !this.refresh;
        this.$nextTick(() => {
          this.loading = false;
          this.tipDialogVisible = false;
          clearTimeout(this.goTimer);
          this.goTimer = null;
          this.canGo = true;
        });
      });
    },
    subPro() {
      this.goTimer = setTimeout(() => {
        this.canGo = true;
      }, 2000);
    },
    changePage(type) {
      // 0 ⬅️ // 1 ➡️
      this.subPro();
      if (!this.canGo) {
        return;
      }
      this.canGo = false;
      console.log(type, this.curPage);
      if (type === 0) {
        if (
          parseInt(this.curPage) < 2 ||
          parseInt(this.curPage) > this.imgLength
        ) {
          this.canGo = true;
          clearTimeout(this.goTimer);
          this.goTimer = null;
          return;
        }
        this.curPage -= 1;
      } else if (type === 1) {
        if (
          parseInt(this.curPage) >= this.imgLength ||
          parseInt(this.curPage) < 1
        ) {
          this.canGo = true;
          clearTimeout(this.goTimer);
          this.goTimer = null;
          return;
        }
        this.curPage = this.curPage - 0 + 1;
      } else if (type === 2) {
        if (
          parseInt(this.curPage) < 1 ||
          parseInt(this.curPage) > this.imgLength ||
          isNaN(this.curPage - 0)
        ) {
          this.canGo = true;
          clearTimeout(this.goTimer);
          this.goTimer = null;
          this.$message.error("请输入正确的页数");
          return;
        }
      }
      this.loading = true;
      // 翻页提交修改
      /**
       * @author: Homastin
       * @date: 2020/7/1  3:56 下午
       * @Description: hongfajing add change page use updateCostKinds
       */
      this.updateCostKinds();
      const arr = [];
      this.allDocCheData[this.curPage - 1].calculationTrResDTOS.forEach(
        (ele) => {
          ele.calculationTdDetailResDTOS.forEach((row) => {
            arr.push(row);
          });
        }
      );
      this.docCheData = arr;
      console.log("this.docCheData2", this.docCheData);
      this.rotationAngle = this.allDocCheData[this.curPage - 1].rotationAngle;
      this.imageListDown(this.curPage - 1, this.imageList[this.curPage - 1]);
      let container = this.$el.querySelector(".el-table__body-wrapper");
      container.scrollTop = 0;
      // 暂时注释 2020-07-01 15:43 杨晓电话请求修改
      // if (this.editData.length > 0) {
      //   Api.submit.updateRemiburseMoneys(this.editData).then((res) => {
      //     if (res.code === 1000) {
      //       this.editData = []
      //       this.getCheckData(true)
      //     } else {
      //       this.$message.error('修改自费金额失败')
      //     }
      //   }).catch((err) => {
      //     this.$message.error('修改自费金额失败')
      //   })
      // } else {
      //   // 没有修改
      //   const arr = []
      //   this.allDocCheData[this.curPage - 1].calculationTrResDTOS.forEach((ele) => {
      //     ele.calculationTdDetailResDTOS.forEach((row) => {
      //       arr.push(row)
      //     })
      //   })
      //   this.docCheData = arr
      //   this.rotationAngle = this.allDocCheData[this.curPage - 1].rotationAngle
      //   this.imageListDown(this.curPage - 1, this.imageList[this.curPage - 1])
      // }
    },
    // 获取整个网页高度与宽度
    getPageArea() {
      return {
        width: Math.max(
          document.documentElement.scrollWidth,
          document.documentElement.clientWidth
        ),
        height: Math.max(
          document.documentElement.scrollHeight,
          document.documentElement.clientHeight
        ),
      };
    },
    // 获取 组件容器的宽度
    getWrapperWidth() {
      // 单据详情的宽度 = 网页宽度 - 左侧菜单宽度
      const appMenu = document.querySelector(".cu-app-menu");
      const offsetWidth = appMenu.offsetWidth; // 左侧菜单宽度
      console.log(this.getPageArea().width - offsetWidth);
      return this.getPageArea().width - offsetWidth - 30;
    },
    init() {
      this.wrapperWidth = this.getWrapperWidth();
      // console.log(this.getWrapperWidth())
      setTimeout(() => {
        // this.loading = false
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
/deep/.el-tag {
  margin-left: 0;
}

.icon1 {
  width: 18px;
  height: 18px;
  margin: 0 10px;
}

.hosDialog {
  .sele {
    margin-top: 20px;
    width: 100%;
  }

  /deep/ .el-button--primary {
    padding: 8px 30px;
  }
}

.ppDialog {
  .ppBox {
    display: flex;
    flex-flow: column;
    text-align: center;

    .el-radio {
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }

  /deep/ .el-button--primary {
    padding: 8px 30px;
  }
}

.tipDialog {
  .img1 {
    height: 100px;
    transform: scale(3);
  }

  .img2 {
    height: 80px;
    margin-bottom: 20px;
  }

  .centerBox2 {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .tipDiaBox {
    text-align: center;
    color: #666666;
  }

  /deep/ .el-button--primary {
    padding: 8px 30px;
  }
}

.already {
  color: #2e8bf0;
}

.upDia {
  text-align: center;
  margin: 0 -33px;

  .proWord {
    display: flex;
    justify-content: space-around;
    font-weight: bolder;
  }

  .pro {
    /deep/ .el-progress-bar {
      width: 110%;
    }

    margin: 10px 0 20px 0;
  }

  .img1 {
    height: 100px;
    transform: scale(3);
  }
}

.upDiaBox {
  /deep/ .el-dialog--center .el-dialog__body {
    overflow: hidden;
  }
}

.box {
  background-color: #fff;
  border-radius: 10px;
  position: relative;

  .titBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(
      to right,
      rgba(69, 114, 162, 0.05) 50%,
      #fff 50%
    );
    border-radius: 10px 10px 0 0;

    .title {
      text-align: center;
      padding: 20px 0;
      font-size: 24px;
      font-weight: 500;
      color: #333333;
      margin-left: 350px;
    }

    .full-screen-checkbox {
      margin-right: 30px;

      .el-switch + .el-switch {
        margin-left: 20px;
      }
    }
  }

  .boxBox {
    display: flex;
  }

  .pagePart {
    background: linear-gradient(
      to right,
      rgba(69, 114, 162, 0.2) 50%,
      rgba(49, 86, 161, 0.05) 50%
    );
    display: flex;
    /*justify-content: space-around;*/
    align-items: center;
    height: 50px;

    .page-item {
      flex: 1;

      &.cu-right {
        display: flex;
        justify-content: space-between;

        &:before {
          content: "";
          display: block;
        }

        .table-page {
          margin-left: auto;
          margin-right: 65px;
        }
      }
    }

    .iconPage {
      display: inline-block;
      margin: 0 15px;
    }

    .el-icon-arrow-left,
    .el-icon-arrow-right {
      cursor: pointer;
    }

    /deep/ .el-input {
      width: 50px;
    }

    /deep/ .el-input__inner {
      height: 30px;
      width: 42px;
      padding: 0 12px;
    }
  }

  .text-annotation-container {
    height: calc(100vh - 245px);
    overflow-y: scroll;
    padding: 20px 0 120px 0;
  }

  .ttt {
    height: calc(100vh - 245px);
    overflow-y: scroll;
    padding: 20px 0 120px 0;
  }

  .left {
    width: 50%;
    background-color: rgba(69, 114, 162, 0.05);
    min-height: calc(100vh - 245px);
    position: relative;
    text-align: center;

    .cenBox {
      width: 500px;
      text-align: center;
      margin: 0 auto;

      .pss {
        width: 500px;
        text-align: center;
        position: absolute;
        left: calc(50% - 250px);
        top: calc(50% - 100px);
      }

      .ps1 {
        color: #333333;
        font-size: 28px;
        margin: 20px 0;
      }

      .ps2 {
        color: #2e8bf0;
      }

      .ps3 {
        color: #d03d38;
        margin-bottom: 20px;
      }

      /deep/ .el-button--primary {
        padding: 8px 40px;
      }
    }
  }

  .right {
    width: 50%;
    min-height: calc(100vh - 245px);
    position: relative;

    .cenBox {
      text-align: center;
      position: absolute;
      left: calc(50% - 50px);
      top: calc(50% - 50px);
    }
  }

  .tipPart {
    width: 100%;
    color: #777777;
    background-color: #fff;
    position: absolute;
    bottom: 0px;
    font-size: 14px;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 -1px 5px rgba(214, 213, 213, 0.5);
    z-index: 1000;

    .center {
      display: flex;
      align-items: center;
      padding: 15px 0;

      .squa {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin: 0 5px 0 15px;
      }

      /deep/ .el-tag--dark {
        border: none;
      }
    }

    .btns {
      border-top: 1px solid #d8d8e9;
      text-align: center;
      padding: 15px 0;

      /deep/ .el-button--primary {
        padding: 8px 30px;
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
</style>