<template>
  <div class="document">
    <div class="box">
      <!-- 标题 -->
      <div class="titBox">
        <div class="title">报销单据原件</div>
        <div class="title"></div>
      </div>
      <!-- 页码 -->
      <div class="pagePart">
        <div style="textAlign: center;">
          <i class="el-icon-arrow-left" @click="changePage(0)"></i>
          <el-input v-model="curPage" @keyup.enter.native="changePage(2)"></el-input>/
          <span class="iconPage">{{imgLength}}</span>
          <!-- <span class="iconPage already">{{curPage}}</span> / <span class="iconPage">{{imgLength}}</span> -->
          <i class="el-icon-arrow-right" @click="changePage(1)"></i>
        </div>
        <div style="textAlign:center">
          <i class="el-icon-arrow-left" @click="changePage(0)"></i>
          <el-input v-model="curPage" @keyup.enter.native="changePage(2)"></el-input>/
          <span class="iconPage">{{imgLength}}</span>
          <!-- <span class="iconPage already">{{curPage}}</span> / <span class="iconPage">{{imgLength}}</span> -->
          <i class="el-icon-arrow-right" @click="changePage(1)"></i>
        </div>
      </div>
      <div v-loading="loading">
        <div class="text-annotation-container" v-if="isExist">
          <text-annotation :canvasId="canvasId" :src.sync="imageSrc" :refresh='refresh' :data.sync="docData" :width="wrapperWidth">
          </text-annotation>
        </div>
      </div>
      <div class="tipPart">
        <div class="center-w" v-show="isExist">
          <img src="@/assets/warning.png" alt class="icon1" />
          <span>温馨提示：单击关注要素，可对比原件与OCR差异</span>
          <div style="flex:1;margin-left:25px;">
            <span v-for="(i, ind) in dataExm" :key="ind">
              <el-tag :color="i.color" class="squa" effect="dark"></el-tag>
              {{i.name}}
            </span>
          </div>
          <div style="margin-left:24px;font-weight: 500;" v-show="totalM != 0">
            费用合计：
            <span>{{totalM}}</span>
          </div>
        </div>
        <div v-show="isExist" class="btns">
          <!-- <el-button type="primary" @click="ppDialogVisible = true">提交核算</el-button> -->
          <!-- <el-button type="primary" @click="subCal" v-if="(flowStatsu == '2')">提交汇总</el-button> -->
        </div>
      </div>
    </div>
    <!-- 医院 -->
    <el-dialog title="医院级别选择" :visible.sync="hosDialogVisible" width="380px" class="hosDialog" left>
      <div style="text-align:center">
        <el-input v-model="hosInput" class="hospital-name-input" placeholder="请输入医院名称"></el-input>
        <el-select v-model="hosLevel" placeholder="请选择医院级别" class="sele">
          <el-option v-for="item in hosLevels" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="hosDialogVisible = false" plain class="left-btn">取 消</el-button>
        <el-button type="primary" @click="hosHandle" class="right-btn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 报销人员 -->
    <el-dialog title="报销人类别选择" :visible.sync="ppDialogVisible" width="380px" class="ppDialog" left>
      <div class="pp-radio-container">
        <el-radio-group v-model="ppType" class="ppBox">
          <el-radio :label="item.code" v-for="(item, ind) in ppTypes" :key="ind">{{item.desc}}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ppDialogVisible = false" plain class="left-btn">取 消</el-button>
        <el-button type="primary" @click="ppHandle" class="right-btn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 汇总/核算/上传成功 系统正在核算。。。-->
    <el-dialog :title="tipName" :visible.sync="tipDialogVisible" width="25%" :close-on-click-modal="false"
      :show-close="false" :before-close="handleDialogClose" class="tipDialog" center>
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
    <!-- 上传 -->
    <el-dialog title="上传" :visible.sync="upDialogVisible" width="25%" :close-on-click-modal="false" class="upDiaBox"
      @close="closeDialog" close center>
      <div class="upDia">
        <div>
          <div class="proWord">
            <span :class="{already: percentage >32}">上传单据</span>
            <span :class="{already: percentage >65}">要素识别</span>
            <span :class="{already: percentage >99}">数据处理</span>
          </div>
          <div class="pro">
            <el-progress :percentage="percentage" :color="customColor" :format="format"></el-progress>
          </div>
        </div>
        <img src="@/assets/loading.jpg" alt class="img1" />
        <div style="color: #666666;margin:20px 0;">{{tipContent1}}</div>
        <div style="color: #666666;">{{tipContent2}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getStorageItem,
    setStorageItem,
    exportFile
  } from "@/utils";
  // import TextAnnotation from "@/components/new-text-annotation";
  import TextAnnotation from "@/components/new-text-annotation/text-annotation-fuhe.vue";
  import {
    baseURL,
    KEYS
  } from "@/config";
  import Api from "@/api";
  import axios from "@/axios";
  import {
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout
  } from "timers";
  import CheckList from "@/components/checkList/CheckList";

  export default {
    name: "DataDetail",
    components: {
      "text-annotation": TextAnnotation,
      "Check-list": CheckList,
    },
    data() {
      return {
        mmm: "",
        dataId: "",
        isExist: false,
        totalM: 0,
        hosDialogVisible: false,
        hosLevel: "",
        hosLevels: [],
        hosInput: "",
        ppDialogVisible: false,
        ppTypes: [],
        dataExm: [{
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
        ],
        ppType: "",
        tipDialogVisible: false,
        fileList: [],
        imageList: [], // 图片数组
        docDataList: [],
        currentFile: 1,
        curPage: 0,
        tipName: "要素整理",
        tipContent1: "正在自动识别单据要素，请稍后…",
        tipContent2: "",
        tipContent3: "正在整理单据要素数据，即将完成…",
        diaState: "2",
        upDialogVisible: false,
        percentage: 1, // 进度
        customColor: "#2E8BF0",
        canvasId: "canvas",
        imageSrc: "",
        loading: false,
        docData: null, // 单据详情源数据
        wrapperWidth: "", // 组件容器宽度
        timer: null,
        timerOcr: null,
        refresh: true,
        // flowStatsu: '0', // 流转状态
        docCheData: [], // 核算后源数据
        titList: [], // xingming
        // imageL: [],
        canGo: true,
        rotationAngle: 0,
        allFile: 0,
        pages: 0,
        textAnnotationModified: {
          addTrReqDTOS: [],
          cells: [],
          deleteTrIds: [],
          headIds: [],
        },
        timeoutTime: 0,
      };
    },
    computed: {
      imgLength() {
        return this.imageList.length;
      },
    },
    mounted() {
      this.$store.commit("SET_TOTAL", 0);
      this.dataId = this.$route.query.id;
      this.getChoData();
      if (this.$route.query.status !== "WAIT_OCR") {
        // 开始展示结果
        this.prepareData();
        return;
      }
      this.pages = getStorageItem("fileSize"); // 单据数量
      console.log('想起阿哥在深山');
      this.getElement(); // 开始识别单据
      this.init();
    },
    methods: {
      handleDialogClose(done) {
        clearInterval(this.timer);
        this.timer = null;
        done();
      },
      getProjectType() {
        Api.submit
          .updateProjectType({
            groupId: "000a37ef941711ea9df5fa163e4f46f3",
            type: "cl",
            reimburseId: "32daecf82fff4ab68c824bc16a203087",
          })
          .then(async (res) => {
            console.log(res);
          });
      },
      closeDialog() {
        // 关闭上传 ocr 。。。
        clearInterval(this.timer);
        clearInterval(this.timerOcr);
        clearInterval(this.timerNlp);
      },
      // 编辑单元格
      editVal(col, row, rowIdx) {
        // 编辑修改
        console.log(row, "修改 新增 行");
        // 如果是新增的行 编辑 优先添加到参数 addTrReqDTOS
        if (row.isNew) {
          const rowReq = {
            reimbursementEvidenceId: this.docData.id,
            reimbursementId: this.dataId,
            trStyle: row.trStyle,
            tdReqDTOS: row.tdDomain,
            trCoordinate: JSON.stringify(row.trCoordinate),
            orderBy: rowIdx,
            timeStamp: row.timeStamp,
          };
          const idx = this.textAnnotationModified.addTrReqDTOS.findIndex(
            (f) => f.timeStamp === row.timeStamp
          );
          if (idx > -1) {
            this.textAnnotationModified.addTrReqDTOS.splice(idx, 1, rowReq);
            const idx = this.docData.tableContentTr.findIndex(
              (f) => f.timeStamp === row.timeStamp
            );
            this.docData.tableContentTr.splice(idx, 1, row);
          } else {
            this.textAnnotationModified.addTrReqDTOS.push(rowReq);
            this.docData.tableContentTr.push(row);
          }
          return;
        }
        // 否则 当初普通单元格的修改 添加到参数cells
        const cellReq = {
          id: col.id,
          value: col.value,
          reimbursementEvidenceId: this.docData.id,
        };
        if (!this.textAnnotationModified.cells.some((an) => an.id === col.id)) {
          this.textAnnotationModified.cells.push(cellReq);
        }
        // this.loading = true
        // Api.submit.saveResult(req).then((res) => {
        //   if (res.code === 1000) {
        //     this.$message({
        //       message: '修改成功',
        //       type: 'success'
        //     })
        //     this.totalM = res.data
        //   } else {
        //     this.$message.error('修改失败')
        //   }
        //   this.loading = false
        // }).catch((err) => {
        //   this.loading = false
        //   this.$message.error('修改失败')
        // })
      },
      // 删本页
      deletePage() {
        console.log(this.docData.id);
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          Api.submit
            .deleteEvi(this.docData.id)
            .then((res) => {
              if (res.code === 1000) {
                this.$message.success("删除成功");
                // 刷新
                this.imageList = [];
                this.prepareData();
              } else {
                this.$message.error("系统错误");
              }
            })
            .catch((err) => {
              this.$message.error("系统错误");
            });
        });
      },
      // 删除表格的上
      deleteTr(row) {
        console.log(row, "删除所在行");
        if (row.isNew) {
          const idx = this.textAnnotationModified.addTrReqDTOS.findIndex(
            (f) => f.timeStamp === row.timeStamp
          );
          if (idx > -1) {
            this.textAnnotationModified.addTrReqDTOS.splice(idx, 1);
          }
        } else {
          this.textAnnotationModified.deleteTrIds.push(row.id);
          const idx = this.docData.tableContentTr.findIndex(
            (f) => f.id === row.id
          );
          this.docData.tableContentTr.splice(idx, 1);
        }
      },
      // 把表头变成标体
      convertToBody(row) {
        console.log(row.id, "把表头变成标体");
        this.textAnnotationModified.headIds.push(row.id);

        const idx = this.docData.tableContentTr.findIndex((f) => f.id === row.id);
        this.docData.tableContentTr[idx].trStyle = "0";
      },
      // 在上面添加一行
      addFrontRow(data) {
        console.log(data, "在上面添加一行");
        const req = {
          reimbursementEvidenceId: this.docData.id,
          reimbursementId: this.dataId,
        };
        this.textAnnotationModified.addTrReqDTOS.push({
          ...data,
          ...req,
        });
      },
      // 在下面添加一行
      addBackRow(data) {
        console.log(data, "在下面添加一行");
        this.textAnnotationModified.addTrReqDTOS.push(data);
      },
      ppHandle() {
        // 人员类型确定
        if (!this.ppType) {
          this.$message.error("请选择人员类型");
          return;
        }
        const req = {
          personTypeCode: this.ppType,
          reimbursementId: this.dataId,
        };
        Api.submit
          .personType(req)
          .then((res) => {
            if (res.code === 1000) {
              this.ppDialogVisible = false;
              this.hosDialogVisible = true;
            } else {
              this.$message.error("人员类型选择失败");
            }
          })
          .catch((err) => {
            this.$message.error("人员类型选择失败");
          });
      },
      hosHandle() {
        // 医院确定
        if (!this.hosLevel || !this.hosInput) {
          this.$message.error("请填写医院信息");
          return;
        }
        const req = {
          hospitalLevelCode: this.hosLevel, // 医院等级CODE
          hospitalName: this.hosInput, // 医院名称
          reimbursementId: this.dataId, // 报销单ID
        };

        console.log(req);
        Api.submit
          .hospitalInfo(req)
          .then(async (res) => {
            if (res.code === 1000) {
              this.hosDialogVisible = false;
              this.diaState = "1";
              this.currentFile = 1;
              this.tipContent1 = "系统正在核算单据，请稍后…";
              this.tipContent2 = `你选择了${this.imgLength}份报销单，正在核验第${this.currentFile}份…`;
              this.tipDialogVisible = true;
              const data = await this.saveDocDetailModified();
              console.log(data);
              if (data !== false) {
                this.$message.success("操作成功");
              }
              this.startCheck(); // 开始核算api
            } else {
              this.$message.error("选择医院等级失败");
            }
          })
          .catch((err) => {
            this.$message.error("选择医院等级失败");
          });
      },
      // 先保存 修改的表格内容
      async saveDocDetailModified() {
        const textAnnValues = Object.values(this.textAnnotationModified);

        if (!textAnnValues.some((val) => val.length)) {
          return false;
        }
        try {
          const res = await Api.submit.saveMedicalDoc(
            this.textAnnotationModified
          );

          if (res.code !== 1000) {
            this.$message.error("操作失败");
            return false;
          }
          return res.data;
        } catch (e) {
          await Promise.reject(e.message || "网络错误");
        }
      },
      startCheck() {
        // 开始核算
        Api.submit
          .start(this.dataId)
          .then((res) => {
            if (res.code === 1000) {
              console.log(res, "开始核算------->");
              this.checkProcess();
            } else {
              this.$message.error(res.message);
            }
            // this.tipDialogVisible = false
          })
          .catch((err) => {
            this.$message.error("提交核算失败");
            this.tipDialogVisible = false;
          });
      },
      checkProcess() {
        // 查看核算进度
        let over = false;
        this.timer = setInterval(() => {
          // this.timeoutTime = this.timeoutTime + 1500000000000;
          // if (this.timeoutTime > 100000000000000000) {
          //   clearInterval(this.timer);
          //   return;
          // }
          if (over) {
            this.tipDialogVisible = false;
            this.loading = false;
            clearInterval(this.timer);
            this.timer = null;
          } else {
            Api.submit
              .dynamicInfo(this.dataId)
              .then((res) => {
                if (res.code === 1000) {
                  if (!res.data) {
                    this.$nextTick(() => {
                      this.currentFile = 1;
                    });
                    return;
                  }
                  this.$nextTick(() => {
                    this.currentFile = res.data.nowNum;
                    this.tipContent2 = `你选择了${this.pages}份报销单，正在核验第${this.currentFile}份…`;
                  });
                  console.log(res, "进度<------");
                  if (res.data.completeFlag) {
                    // 完成
                    clearInterval(this.timer);
                    this.tipDialogVisible = true;
                    this.timer = null;
                    this.$router.push({
                      path: "/documents/docIndex/cacResult",
                      query: {
                        id: this.dataId,
                      },
                    });
                    // this.$eventBus.$emit('bread', 'hyo')
                  } else if (res.data.errorFlag) {
                    this.$message.error("查看进度失败");
                    over = true;
                  }
                } else {
                  this.$message.error("查看进度失败");
                  over = true;
                }
              })
              .catch((err) => {
                over = true;
                this.$message.error("查看进度失败");
              });
          }
        }, 1500);
      },
      getChoData() {
        // 获取医院列表
        Api.submit
          .hospitalLevelList()
          .then((res) => {
            if (res.code === 1000) {
              this.hosLevels = res.data;
            } else {
              this.$message.error("获取医院等级失败");
            }
          })
          .catch((err) => {
            this.$message.error("获取医院等级失败");
          });
        // 人员
        Api.submit
          .personTypeList()
          .then((res) => {
            if (res.code === 1000) {
              this.ppTypes = res.data;
            } else {
              this.$message.error("获取人员类型失败");
            }
          })
          .catch((err) => {
            this.$message.error("获取人员类型失败");
          });
      },
      getElement() {
        console.log('月亮出来亮汪汪');
        // 2.获取要素
        this.upDialogVisible = true;
        this.percentage = 33;
        this.tipContent2 = `你选择了${this.pages}页报销单，正在识别第1页…`;
        const req = {
          reimbursementId: this.dataId,
          dataType: 2,
        };
        console.log(req);
        Api.submit
          .ocrTextAndHandle(req)
          .then((res) => {
            if (res.code === 1000) {
              this.dataId = res.data;
              setStorageItem("headId", res.data);
              this.ocrProcess(); // 获取id后查看进度
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("要素识别失败");
          });
      },
      ocrProcess() {
        // 查看ocr进度
        this.timerOcr = setInterval(() => {
          Api.submit
            .ocrResult(this.dataId)
            .then((res) => {
              if (res.code === 1000) {
                console.log(res, "!!!");
                if (res.data.isException) {
                  // yichang
                  clearInterval(this.timerOcr);
                  this.timerOcr = null;
                  this.upDialogVisible = false;
                  this.$message.error(`${res.data.message}请稍后重试`);
                  return;
                }
                this.currentFile = res.data.counter;
                this.$nextTick(() => {
                  this.tipContent2 = `你选择了${this.pages}页报销单，正在识别第${this.currentFile}页…`;
                });
                if (res.data.success) {
                  this.percentage = 66;
                  clearInterval(this.timerOcr);
                  this.timerOcr = null;
                  // this.upDialogVisible = false
                  this.saveData(); // 数据储存
                }
              } else {
                clearInterval(this.timerOcr);
                this.timerOcr = null;
                this.upDialogVisible = false;
                this.$message.error(`${res.message}请稍后重试`);
              }
            })
            .catch((err) => {
              clearInterval(this.timerOcr);
              this.timerOcr = null;
              this.upDialogVisible = false;
              console.log(err);
              this.$message.error("要素识别失败");
            });
        }, 4000);
      },
      saveData() {
        // 3.储存数据
        this.diaState = "3";
        this.tipName = "核算";
        this.timerNlp = setInterval(() => {
          Api.submit
            .nlpResult(this.dataId)
            .then((res) => {
              console.log(res.data.success, this.timerNlp, "1");
              if (res.code === 1000) {
                if (res.data.isException) {
                  clearInterval(this.timerNlp);
                  this.timerNlp = null;
                  this.upDialogVisible = false;
                  this.$message.error(`${res.data.message}, 请稍后重试`);
                  return;
                }
                if (res.data.success) {
                  clearInterval(this.timerNlp);
                  this.timerNlp = null;
                  this.upDialogVisible = false;
                  this.$router.push({
                    path: "/documents/docIndex/documentsDet",
                    query: {
                      id: this.dataId,
                      status: "NLP_SUCCESS",
                    },
                  });
                  this.prepareData(); // 详情接口
                }
              } else {
                clearInterval(this.timerNlp);
                this.timerNlp = null;
                this.upDialogVisible = false;
                this.$message.error(res.message);
              }
            })
            .catch((err) => {
              console.log(err);
              clearInterval(this.timerNlp);
              this.timerNlp = null;
              this.upDialogVisible = false;
              this.$message.error("数据处理失败");
            });
        }, 2000);
      },
      prepareData() {
        // 4.获取数据展示
        this.tipContent2 = "";
        this.tipContent1 = "正在整理单据要素数据，即将完成…";
        this.percentage = 99;
        this.tipDialogVisible = true;
        Api.submit
          .reimbursementId(this.dataId)
          .then((res) => {
            if (res.code === 1000) {
              setStorageItem("dataId", this.dataId);
              this.isExist = true;
              // this.flowStatsu = '1'
              this.docDataList = res.data.evidences; //扫描件照片
              this.curPage = 1;
              this.docData = this.docDataList[0];
              this.totalM = this.docData.totalCost; //总费用
              this.docDataList.forEach((ele) => {
                this.imageList.push(ele.fileUrl);
              });
              this.imageListDown(0, this.imageList[0]); // 下载文件（文件流）
            } else {
              this.$message.error(res.message);
              this.tipDialogVisible = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.tipDialogVisible = false;
            this.$message.error("数据处理失败");
          });
        // }, 3000)
      },
      // 下载文件（文件流）
      imageListDown(cur, fileUrl) {
        // console.log(fileUrl)
        Api.submit.downloadFileStream(fileUrl).then((res) => {
          //将图片转化成base64编码
          const imgbase64 = `data:image/png;base64,${btoa(
          new Uint8Array(res).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;
          this.imageSrc = imgbase64;
          //翻页刷新页面
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
      format(percentage) {
        console.log("percentage", percentage);
        return "";
      },
      subPro() {
        this.goTimer = setTimeout(() => {
          this.canGo = true;
        }, 2000);
      },
      // 翻页清楚上一页操作的数据
      clearPageData() {
        const textAnnotationKeys = Object.keys(this.textAnnotationModified);
        textAnnotationKeys.forEach((k) => {
          this.textAnnotationModified[k] = [];
        });
      },
      async changePage(type) {
        // 0 ⬅️ // 1 ➡️ ->
        this.subPro();
        if (!this.canGo) {
          return;
        }
        this.canGo = false;
        const docIdx = this.curPage - 1;
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
          // console.log(parseInt(this.curPage) < 1, parseInt(this.curPage) > this.imgLength, isNaN(this.curPage - 0))
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
        this.docData = this.docDataList[this.curPage - 1];
        this.refresh = !this.refresh;
        // 如果没做修改 就不走update单据的接口
        // 分页 如果分页前 新增前 进行新增行操作,需要修改那一页单据的新增行尾updatePage返回的id ,否则返回那一页 删除 对应的新增行 会没有对应的行id
        console.log(docIdx, "docIdx");
        const data = await this.saveDocDetailModified();
        if (data !== false) {
          this.$message.success("操作成功");
          console.log(this.docDataList, "this.docDataList");
          this.docDataList[docIdx]["tableContentTr"].forEach((row) => {
            const commonItem = data.find((n) => row.timeStamp == n.timeStamp);
            console.log(commonItem, "commonItem");
            if (commonItem !== undefined) {
              row.id = commonItem.id;
              delete row.isNew;
            }
          });
        }

        this.clearPageData();
        this.imageListDown(this.curPage - 1, this.imageList[this.curPage - 1]);
        let container = this.$el.querySelector(".text-annotation-container");
        container.scrollTop = 0;
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
        console.log(offsetWidth);
        return this.getPageArea().width - offsetWidth;
      },
      init() {
        this.wrapperWidth = this.getWrapperWidth();
        // console.log(this.getWrapperWidth())
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
    },
  };
</script>

<style scoped lang="scss">
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
    .pp-radio-container {
      display: flex;
      margin-left: 64px;
      justify-content: flex-start;
    }

    .ppBox {
      display: flex;
      flex-flow: column;
      /*text-align: center;*/

      .el-radio {
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }

    /deep/ .el-button--primary {
      padding: 8px 30px;
    }

    /deep/.el-dialog__footer {
      text-align: center;
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
      justify-content: space-around;
      background: linear-gradient(to right,
          rgba(69, 114, 162, 0.05) 50%,
          #fff 50%);
      border-radius: 10px 10px 0 0;

      .title {
        text-align: center;
        padding: 20px 0;
        font-size: 24px;
        color: #333333;
        font-weight: 500;
        margin-left: -80px;
      }
    }

    .boxBox {
      display: flex;
    }

    .pagePart {
      background: linear-gradient(to right,
          rgba(69, 114, 162, 0.2) 50%,
          rgba(49, 86, 161, 0.05) 50%);
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 50px;

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
      position: relative;

      .delBtn {
        // position: absolute;
        // top: 0px;
        // left: 0px;
        // z-index:1000;
        margin: 0 0 5px 10px;
      }
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

      .center-w {
        width: 100%;
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
        }
      }
    }
  }

  .left-btn {
    width: 120px;
    height: 50px;
    background: rgba(250, 250, 250, 1);
    border-radius: 25px;
    text-align: center;
    color: #333333;
    border-color: transparent;
  }

  .el-button--primary.is-plain:focus,
  .el-button--primary.is-plain:hover {
    width: 120px;
    height: 50px;
    background: rgba(250, 250, 250, 1);
    border-radius: 25px;
    text-align: center;
    color: #333333;
    border-color: transparent;
  }

  .right-btn {
    width: 120px;
    height: 50px;
    background: rgba(64, 104, 182, 1);
    border-radius: 25px;
    border-color: transparent;
  }

  /deep/.el-input__suffix {
    right: 50px;
  }

  /deep/.el-dialog__footer {
    text-align: center;
  }

  /deep/.hospital-name-input,
  /deep/.sele {
    .el-input__inner {
      width: 252px;
      height: 50px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(221, 221, 221, 1);
    }
  }
</style>