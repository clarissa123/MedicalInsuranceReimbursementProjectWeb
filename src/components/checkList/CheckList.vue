<template>
  <div class="che-box cu-text-annotation__body">
    <div class="box-left" ref="boxLeft" v-show="!open">
      <div class="left-original-doc" ref="canvasWrapper" :style="cvsDeg">
        <canvas :id="canvasId" :ref="canvasId" :width="width" />
      </div>
      <!-- <img :src="src" alt="" :style="imgStyle()" ref="text"> -->
    </div>
    <div class="box-right" ref="boxR">
      <div class="opr">
        <!--        <el-button type="primary" @click="checkMat" class="ssBtn" size='small' v-if="role == 'EXAMINE'">选定手术</el-button>-->
        <!--        <el-switch active-text="全屏查看" v-model="open"></el-switch>-->
      </div>
      <!-- <div class="header">
        <div class="hos">{{hosName}}</div>
      </div>-->
      <div class="body">
        <el-table
          :data="tableData"
          @cell-click="cellClick"
          @cell-dblclick="editClick"
          :cell-class-name="tableCellClassName"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          :header-cell-style="{height:'60px',borderRadius:'4px 4px 0px 0px',background:'#F0F2F5',fontWeight:'500',color:'#7F7F7F',fontFamily:'PingFang Medium'}"
          :height="imgHeight"
          :row-style="{height:'60px'}"
        >
          <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
          <!-- 1精确 0模糊 -->
          <el-table-column min-width="250" label="收费项目名称">
            <div
              slot-scope="scope"
              class="charge-fee-name"
              :style="{backgroundColor: scope.row.updateStatus === '1' && role === 'RE_EXAMINE'? 'rgba(155, 104, 236, 0.5)': ''}"
            >
              <!--              <div>{{scope.row.medicineName}}<span class="x" v-show="scope.row.termType === '0'" @click="giveUp(scope.row)">+</span></div>-->
              <div>
                <span>{{scope.row.medicineName}}</span>
                <a
                  type="primary"
                  class="minus"
                  v-if="!scope.row.showIcon"
                  @click="handleRemoveReimburKinds(scope.row)"
                >
                  <i class="el-icon-circle-close"></i>
                </a>
              </div>
            </div>
          </el-table-column>
          <el-table-column min-width="250" label="医保通用项目名称">
            <template slot-scope="scope">
              <span>{{scope.row.dictName ? scope.row.dictName : scope.row.reimburseReason}}</span>
              <!--              <el-tooltip class="item" effect="dark" :content="scope.row.reimburseReason" placement="top"><span>{{scope.row.dictName ? scope.row.dictName : scope.row.reimburseReason}}</span>-->
              <!--              </el-tooltip>-->
            </template>
          </el-table-column>
          <!--          <el-table-column-->
          <!--              prop="dictCode"-->
          <!--              min-width='150'-->
          <!--              label="医保通用项目编码">-->
          <!--          </el-table-column>-->
          <el-table-column prop="dictType" min-width="150" label="项目大类">
            <div slot-scope="{row}">
              <el-select
                v-model="row.dictType"
                @change="handleDictTypeChange(row)"
                placeholder="请选择"
                size="big"
              >
                <el-option
                  v-for="item in materialOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-table-column>
          <el-table-column prop="summaryDTOS" min-width="200" class-name label="报销分类">
            <div slot-scope="{row}" class="edit-reimbursement-kinds">
              <el-tag
                size="small"
                closable
                v-for="(reb,rebIdx) in row.summaryDTOS"
                :key="rebIdx"
                v-show="computedOtherShow(reb)"
                @click="handleClickTags(reb,rebIdx,row)"
                @close="handleCancelClassify(reb,rebIdx,row)"
              >{{reb.summaryType}}{{reb.summaryMoney}}</el-tag>
              <a type="primary" @click="handleSelectClassify(row)">
                <i class="el-icon-circle-plus-outline"></i>
              </a>
            </div>
          </el-table-column>
          <el-table-column prop="cost" align="center" label="实际金额"></el-table-column>
          <el-table-column prop="limitPrice" align="center" min-width="150" label="基金支付限价"></el-table-column>
          <el-table-column prop="rate" align="center" label="比例/数量"></el-table-column>
          <el-table-column prop="remark" align="center" label="备注"></el-table-column>
          <!--          <el-table-column-->
          <!--            align="center"-->
          <!--            label="自费金额">-->
          <!--            <template slot-scope="scope">-->
          <!--              <span v-show="scope.row.groupId !== editId">{{scope.row.reimburseMoney}}</span>-->
          <!--              <el-input-->
          <!--              v-show="scope.row.groupId === editId"-->
          <!--              v-model="scope.row.reimburseMoney"-->
          <!--              placeholder="自费金额"-->
          <!--              :ref='scope.row.groupId'-->
          <!--              @blur="subEdit(scope.row)"-->
          <!--              @keyup.enter.native="$event.target.blur"-->
          <!--              ></el-input>-->
          <!--           </template>-->
          <!--          </el-table-column>-->
        </el-table>
      </div>
    </div>
    <!-- 修改 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="25%"
      center
    >
      <div class="diaCenter">
        <div v-show="state === '1'">
          <div class="psPart">中药饮片部分标注“□”的指 单独使用时不予 支付，且全部由这些饮片组成的处方也不予支付。</div>
          <div class="psPart">“备注”一栏标有“▲”的药品，仅限参保人员门诊 使用和定点药店购药时医保基金方予支付。</div>
          <div class="psPart">除在“备注”一栏标有“◇”的药品外，西药名 称采用中文通用名，未包括命名中的盐基、酸根部分，剂型单列。中成药名称采用中文通用名，剂型不单列。</div>
          <div class="conPart">
            药品备注：
            <span style="color: red;">{{content}}</span>
          </div>
          <div class="conPart">请确认是否纳入医疗报销？</div>
          <el-radio v-model="stateV1" label="1">是</el-radio>
          <el-radio v-model="stateV1" label="0">否</el-radio>
        </div>
        <div v-show="(state === '2') || (state === '3')">
          <el-autocomplete
            v-model="stateV2"
            @input="handInput"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入手术名称"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subClick">{{btnName}}</el-button>
      </span>
    </el-dialog>

    <!-- 修改自费集合 和 标签集合 -->
    <el-dialog
      custom-class="edit-cost-dialog"
      width="30%"
      center
      :visible.sync="editCostDialogVisible"
    >
      <div class="form-container">
        <el-form ref="costForm" :model="editCostForm" label-width="100px" :rules="editCostRules">
          <el-form-item label="报销分类" prop="kind">
            <el-select
              v-model="editCostForm.kind"
              placeholder="请选择报销分类"
              @change="handleEditTypeChange"
              style="width: 100%"
            >
              <el-option
                :label="kind"
                :value="kind"
                v-for="(kind,kindIndex) in reimbursementKinds"
                :key="kindIndex"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用金额" prop="cost">
            <el-input v-model="editCostForm.cost" placeholder="请输入费用金额"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCostDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCostForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改自费标签 -->
    <el-dialog
      custom-class="edit-cost-dialog"
      width="30%"
      center
      :visible.sync="updateCostDialogVisible"
    >
      <div class="form-container">
        <el-form
          ref="updateCostForm"
          :model="updateCostForm"
          label-width="100px"
          :rules="editCostRules"
        >
          <el-form-item label="报销分类" prop="kind">
            <el-select
              v-model="updateCostForm.kind"
              placeholder="请选择报销分类"
              @change="handleUpdateTypeChange"
              style="width: 100%"
            >
              <el-option
                :label="kind"
                :value="kind"
                v-for="(kind,kindIndex) in reimbursementKinds"
                :key="kindIndex"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用金额" prop="cost">
            <el-input v-model="updateCostForm.cost" placeholder="请输入费用金额"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateCostDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateCostForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStorageItem, setStorageItem } from "@/utils";
import Api from "@/api";
import { setTimeout, clearTimeout } from "timers";

export default {
  name: "CheckList",
  props: {
    open: {
      type: Boolean,
      default: true,
    },
    reimburseId: {
      type: String,
    },
    showOtherClass: {
      type: Boolean,
      default: true,
    },
    rotationAngle: 0,
    /**
     * @description data
     */
    canvasId: {
      type: [String, Number],
      default: "",
      required: true,
    },
    tableData: {
      type: Array,
      default: null,
    },
    titList: {
      type: Array,
      default: null,
    },
    /**
     * @description src为图片的路径
     */
    src: {
      type: String,
      default: "",
      required: true,
    },
    refresh: {
      type: Boolean,
      default: true,
    },
    editData: {
      type: Array,
      default: [],
    },
    /**
     * @description: 容器的宽度
     */
    width: {
      type: [String, Number],
      default: 1200,
    },
    hosName: {
      type: String,
      default: "",
    },
    personType: {
      type: String,
      default: "",
    },
    updatedReimbursementKinds: {
      type: Object,
      default: () => ({
        ownCostIds: [],
        updateSummaryReqDTOS: [],
        toClGroupIds: [],
        toYpGroupIds: [],
        toZlGroupIds: [],
      }),
    },
  },
  watch: {
    refresh(newV, oldV) {
      if (newV !== oldV) {
        this.init();
      }
    },
    open(nv, ov) {
      if (!nv) {
        this.$refs.boxR.style.width = "50%";
      } else {
        this.$refs.boxR.style.width = "100%";
        this.imgWidth = "100%";
      }
    },
  },
  data() {
    return {
      // open: true,
      hos: "",
      // imgHeight: 980,
      centerDialogVisible: false,
      state: "0",
      stateV1: "1",
      loading: false,
      content: "",
      stateV2: "", // 手术名
      materialId: "", // 手术id
      editId: "",
      options: [], // 手术列表
      btnName: "确 定",
      multipleSelection: [],
      imageData: {},
      rect: {
        width: "auto",
        height: "auto",
      },
      strokeColor: "#fb3838",
      role: "",
      editCostForm: {
        kind: "",
        cost: "",
      },
      editCostDialogVisible: false,
      reimbursementKinds: [],
      currentActiveCell: {},
      currentActiveTag: {},
      editCostRules: {
        kind: [
          {
            required: true,
            message: "请选择药品分类",
            trigger: "change",
          },
        ],
        cost: [
          {
            required: true,
            message: "请选择费用金额",
            trigger: "blur",
          },
        ],
      },
      updateCostDialogVisible: false,
      updateCostForm: {
        kind: "",
        cost: "",
      },
      materialSet: {
        yp: "药品",
        zl: "诊疗",
        cl: "材料",
      },
      materialOptions: [
        {
          label: "药品",
          value: "yp",
        },
        {
          label: "诊疗",
          value: "zl",
        },
        {
          label: "材料",
          value: "cl",
        },
      ],
    };
  },
  computed: {
    cvsDeg() {
      return {
        transform: `rotate(${this.rotationAngle}deg)`,
      };
    },
    imgHeight() {
      return this.rect.height;
    },
  },
  mounted() {
    // console.log(this.tableData, this.titList)
    // this.hos = getStorageItem('hosName')
    this.init();
    this.role = getStorageItem("UserInfo")
      ? getStorageItem("UserInfo").roleType
      : "";
  },
  methods: {
    // 新增报销分类 分类改变
    handleUpdateTypeChange(e) {
      const factCost = Number(this.currentActiveCell.cost);
      if (this.currentActiveCell.dictType === "zl") {
        switch (e) {
          case "基本医疗保险之外的费用":
            Api.submit
              .updateProjectType({
                groupId: this.currentActiveCell.groupId,
                type: this.currentActiveCell.dictType,
                reimburseId: this.reimburseId,
              })
              .then((res) => {
                this.updateCostForm.cost = (
                  (factCost / res.data.num -
                    Number(this.currentActiveCell.limitPrice)) *
                  res.data.num
                ).toFixed(2);
              });
            break;
          case "200元以上检查、治疗项目":
          case "100元以上检查、治疗项目":
          case "1000元以上手术费":
          case "血费10%":
            if (factCost > Number(this.currentActiveCell.limitPrice)) {
              this.updateCostForm.cost = this.toDecimal2(
                Number(this.currentActiveCell.limitPrice)
              );
            } else {
              this.updateCostForm.cost = factCost;
            }
            break;
        }
      } else if (this.currentActiveCell.dictType === "cl") {
        switch (e) {
          case "特殊材料费10000以下":
            if (factCost > 1000 && factCost <= 5000) {
              this.updateCostForm.cost = factCost * 0.3;
            } else if (factCost > 5000 && factCost <= 10000) {
              this.updateCostForm.cost = factCost * 0.4;
            } else if (factCost > 10000 && factCost <= 50000) {
              this.updateCostForm.cost = factCost * 0.5;
            } else if (factCost > 50000) {
              this.updateCostForm.cost = factCost * 0.6;
            }
            break;
        }
      }
    },
    // 编辑报销分类 分类改变
    handleEditTypeChange(e) {
      const factCost = Number(this.currentActiveCell.cost);
      if (this.currentActiveCell.dictType === "zl") {
        switch (e) {
          case "基本医疗保险之外的费用":
            Api.submit
              .updateProjectType({
                groupId: this.currentActiveCell.groupId,
                type: this.currentActiveCell.dictType,
                reimburseId: this.reimburseId,
              })
              .then((res) => {
                this.editCostForm.cost = (
                  (factCost / res.data.num -
                    Number(this.currentActiveCell.limitPrice)) *
                  res.data.num
                ).toFixed(2);
              });
            break;
          case "200元以上检查、治疗项目":
          case "100元以上检查、治疗项目":
          case "1000元以上手术费":
          case "血费10%":
            if (factCost > Number(this.currentActiveCell.limitPrice)) {
              this.editCostForm.cost = this.toDecimal2(
                Number(this.currentActiveCell.limitPrice)
              );
            } else {
              this.editCostForm.cost = factCost;
            }
            break;
        }
      } else if (this.currentActiveCell.dictType === "cl") {
        switch (e) {
          case "特殊材料费10000以下":
            if (factCost > 1000 && factCost <= 5000) {
              this.editCostForm.cost = factCost * 0.3;
            } else if (factCost > 5000 && factCost <= 10000) {
              this.editCostForm.cost = factCost * 0.4;
            } else if (factCost > 10000 && factCost <= 50000) {
              this.editCostForm.cost = factCost * 0.5;
            } else if (factCost > 50000) {
              this.editCostForm.cost = factCost * 0.6;
            }
            break;
        }
      }
    },
    toDecimal2(x) {
      let f = parseFloat(x);
      if (isNaN(f)) {
        return false;
      }
      let h = Math.round(x * 100) / 100;
      let s = h.toString();
      let rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
    handleDictTypeChange(row) {
      console.log(row);
      this.getProjectType(row);
      let ypIdx = this.updatedReimbursementKinds.toYpGroupIds.findIndex(
        (yp) => yp.groupId === row.groupId
      );
      let clIdx = this.updatedReimbursementKinds.toClGroupIds.findIndex(
        (cl) => cl.groupId === row.groupId
      );
      let zlIdx = this.updatedReimbursementKinds.toZlGroupIds.findIndex(
        (zl) => zl.groupId === row.groupId
      );

      if (ypIdx > -1) {
        if (
          this.updatedReimbursementKinds.toYpGroupIds[ypIdx].originType ===
          row.dictType
        ) {
          this.updatedReimbursementKinds.toYpGroupIds.splice(ypIdx, 1);
          return;
        }
      }
      if (clIdx > -1) {
        if (
          this.updatedReimbursementKinds.toClGroupIds[clIdx].originType ===
          row.dictType
        ) {
          this.updatedReimbursementKinds.toClGroupIds.splice(clIdx, 1);
          return;
        }
      }
      if (zlIdx > -1) {
        if (
          this.updatedReimbursementKinds.toZlGroupIds[zlIdx].originType ===
          row.dictType
        ) {
          this.updatedReimbursementKinds.toZlGroupIds.splice(zlIdx, 1);
          return;
        }
      }

      if (row.dictType === "yp") {
        if (ypIdx > -1) {
          return;
        }
        if (clIdx > -1)
          this.updatedReimbursementKinds.toClGroupIds.splice(clIdx, 1);
        if (zlIdx > -1)
          this.updatedReimbursementKinds.toZlGroupIds.splice(zlIdx, 1);

        this.updatedReimbursementKinds.toYpGroupIds.push({
          originType: row.originType,
          groupId: row.groupId,
        });
      } else if (row.dictType === "zl") {
        if (zlIdx > -1) {
          return;
        }
        if (ypIdx > -1)
          this.updatedReimbursementKinds.toYpGroupIds.splice(ypIdx, 1);
        if (clIdx > -1)
          this.updatedReimbursementKinds.toClGroupIds.splice(clIdx, 1);

        this.updatedReimbursementKinds.toZlGroupIds.push({
          originType: row.originType,
          groupId: row.groupId,
        });
      } else if (row.dictType === "cl") {
        if (clIdx > -1) {
          return;
        }
        if (ypIdx > -1) this.updatedReimbursementKinds.splice(ypIdx, 1);
        if (zlIdx > -1)
          this.updatedReimbursementKinds.toZlGroupIds.splice(zlIdx, 1);

        this.updatedReimbursementKinds.toClGroupIds.push({
          originType: row.originType,
          groupId: row.groupId,
        });
      }
    },
    getProjectType(row) {
      Api.submit
        .updateProjectType({
          groupId: row.groupId,
          type: row.dictType,
          reimburseId: this.reimburseId,
        })
        .then((res) => {
          console.log(res);
          // row.summaryDTOS = res.data['summary'];
          row.limitPrice = res.data.limitPrice;
          row.itemNum = res.data.num;
          this.$forceUpdate();
        });
    },
    computedOtherShow(tag) {
      if (!this.showOtherClass) {
        if (tag.summaryType === "其他") {
          return;
        }
      }
      return true;
    },
    async init() {
      await this.createCanvas();
    },
    giveUp(data) {
      const req = {
        fielName: data.medicineName,
        name: data.medicineName,
      };
      Api.submit
        .insertDist(req)
        .then((res) => {
          if (res.code === 1000) {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            // 刷新
            this.$emit("getCheckData", true);
          } else {
            this.$message.error("系统错误");
          }
        })
    },
    computedCanvasRect() {
      const canvas = this.canvasDom;
      // 计算滚动距离
      const cuTextAnnotationBodyDom = document.querySelector(
        ".cu-text-annotation__body"
      );
      const scrollTop = cuTextAnnotationBodyDom.scrollTop;
      const scrollLeft = cuTextAnnotationBodyDom.scrollLeft;

      this.rect.width = canvas.width;
      this.rect.height = canvas.height;
      // console.log(this.rect)

      this.rect.offsetWidth = canvas.offsetWidth;
      this.rect.offsetHeight = canvas.offsetHeight;

      const rect = canvas.getBoundingClientRect();
      this.rect.top = rect.top + scrollTop;
      this.rect.left = rect.left + scrollLeft;
    },
    // 计算canvas 容器的宽度
    calcCanvasSize(image) {
      // 重置缩放比列
      this.scale = 1;
      const width = image.width;
      const height = image.height;
      const wrapperRect = this.$refs.boxLeft.getBoundingClientRect(); // 整个容器的大小
      // const canvasWrapperWidth = wrapperRect.width / 2// canvas 容器的大小 = 整个容器的二分之一
      const canvasWrapperWidth = this.width / 2;
      // console.log(this.width, image.width, image.height, this.$refs.boxLeft.getBoundingClientRect())
      if (width <= canvasWrapperWidth) {
        return {
          width,
          height,
        };
      } else if (width > canvasWrapperWidth) {
        this.scale = width / canvasWrapperWidth;
        // 设置canvas的min-width 待定
        // console.log(canvasWrapperWidth, height / this.scale)
        return {
          width: canvasWrapperWidth,
          height: height / this.scale,
        };
      }
    },
    createCanvas() {
      return new Promise((resolve, rehect) => {
        // 获取canvas dom
        this.canvasDom = this.$refs[this.canvasId];
        this.canvasCtx = this.canvasDom.getContext("2d");

        // canvas 填充一张图片
        const image = new Image();
        image.src = this.src;
        image.onload = () => {
          // 根据图片大小 计算canvas的宽高，然后绘制
          const rect = this.calcCanvasSize(image);

          this.canvasDom.width = rect.width;
          this.canvasDom.height = rect.height;
          this.canvasCtx.drawImage(
            image,
            0,
            0,
            this.canvasDom.width,
            this.canvasDom.height
          );
          // 计算canvas 实际位置
          this.computedCanvasRect();
          this.imageData = this.canvasCtx.getImageData(
            0,
            0,
            this.canvasDom.width,
            this.canvasDom.height
          );
          // this.pureImageData = this.canvasCtx.getImageData(0, 0, this.rect.width, this.rect.height)
          // this.pushHistory()
          resolve(true);
          // this.handleDefaultRect()
        };
      });
    },
    selectable(row) {
      return row.checkStatus === "2";
    },
    checkMat() {
      if (this.multipleSelection.length < 1) {
        this.$message.error("请选至少一项");
        return;
      }
      this.state = "3";
      this.$nextTick(() => {
        this.centerDialogVisible = true;
      });
    },
    handleSelectionChange(all) {
      // 多选
      this.multipleSelection = all;
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      if (row.checkStatus === "0" && column.label === "自费金额") {
        return "blueMon";
      } else if (row.checkStatus === "1" && column.label === "自费金额") {
        return "pink cur";
      } else if (row.checkStatus === "2" && column.label === "自费金额") {
        return "grey cur";
      } else if (row.checkStatus === "5" && column.label === "自费金额") {
        // yichang
        return "red";
      } else if (row.checkStatus === "10" && column.label === "自费金额") {
        // yichang
        return "changed";
      } else if (column.label === "药品库名称" || column.label === "药品类别") {
        return "greenMon";
      } else if (column.label === "费用名称") {
        if (row.termType === "1") {
          // 精确
          return "detColor";
        }
        return "abtColor";
      }
    },
    subEdit(row) {
      // 提交修改金额
      const reg = /^(0|[1-9][0-9]*)(\.\d+)?$/;
      // console.log(this.beforeMon, row.reimburseMoney)
      if (
        (!this.beforeMon && !row.reimburseMoney) ||
        this.beforeMon === row.reimburseMoney
      ) {
        // 是否修改
        this.editId = "";
        return;
      }
      if (!reg.test(row.reimburseMoney)) {
        // 格式
        this.$message.error("自费金额格式不正确");
        return;
      }
      // console.log(parseInt(row.reimburseMoney) - parseInt(row.cost))
      if (parseInt(row.reimburseMoney) - parseInt(row.cost) > 0) {
        // 小于cost
        this.$message.error("自费金额不得大于实际金额");
        return;
      }
      const req = {
        groupId: row.groupId,
        remiburseMoney: row.reimburseMoney,
      };
      row.checkStatus = "0";
      this.$emit("changEdit", req);
      this.editId = "";
    },
    editClick(row, column, cell, event) {
      // 双击修改
      console.log("editClick被点击了");
      console.log(row, column, cell, event);
      // console.log(row.groupId)
      if (column.label !== "自费金额") {
        return;
      }
      if (this.role !== "EXAMINE") {
        return;
      }
      console.log("双击");
      this.editId = row.groupId;
      this.beforeMon = row.reimburseMoney;
      this.$nextTick(() => {
        this.$refs[row.groupId].$el.querySelector("input").focus();
      });
    },
    subClick() {
      console.log(this.state);
      const req = {
        checkStatus: this.state,
        flag: this.stateV1 !== "0",
        groupId: this.saveGId,
        materialName: this.stateV2,
        materialId: this.materialId,
      };
      if (this.state === "2" && !this.stateV2) {
        this.$message({
          message: "请填写手术名称",
          type: "warning",
        });
        return;
      }
      if (this.state === "3") {
        // 材料接口
        const arr = [];
        this.multipleSelection.forEach((element) => {
          arr.push(element.groupId);
        });
        const mupReq = {
          groupIds: arr,
          materialName: this.stateV2,
        };
        console.log(mupReq);
        Api.submit
          .batchsurge(mupReq)
          .then((res) => {
            if (res.code === 1000) {
              this.$message({
                message: "材料选择成功",
                type: "success",
              });
              // shuaxin
              this.$emit("getCheckData", true);
            } else {
              this.$message.error("材料选择失败");
            }
            this.centerDialogVisible = false;
          })
          .catch((err) => {
            this.$message.error("材料选择失败");
          });
      } else {
        console.log(req);
        Api.submit
          .chooseRemark(req)
          .then((res) => {
            if (res.code === 1000) {
              this.$message({
                message: "选择备注成功",
                type: "success",
              });
              // shuaxin
              this.$emit("getCheckData", true);
            } else {
              this.$message.error("选择备注失败");
            }
            this.centerDialogVisible = false;
          })
          .catch((err) => {
            this.$message.error("选择备注失败");
          });
      }
    },
    handInput() {
      // console.log(this.materialId)
      this.materialId = "";
    },
    handleSelect(item) {
      // console.log(item)
      this.materialId = item.id;
    },
    querySearchAsync(queryString, cb) {
      // 手术
      if (queryString) {
        this.loading = true;
        // api
        Api.submit
          .materialSurge(queryString)
          .then((res) => {
            if (res.code === 1000) {
              console.log(res.data, "<<-------------搜索手术列表");
              cb(res.data);
            } else {
              this.$message.error("手术获取备注");
            }
            this.loading = false;
          })
          .catch((err) => {
            this.$message.error("手术获取备注");
          });
      } else {
        cb([]);
      }
    },
    cellClick(row, column, cell, event) {
      console.log("cellClick被点击了");
      console.log(row);
      console.log("column--->", column);
      if (column.label !== "自费金额") {
        this.handleDrawRect(row.trCoordinate); // 进行标注
        return;
      }
      if (this.role !== "EXAMINE") {
        return;
      }
      if (
        row.checkStatus === "0" ||
        this.editId ||
        row.checkStatus === "5" ||
        row.checkStatus === "10"
      ) {
        return;
      } else if (row.checkStatus === "1") {
        // 药品图标获取
        this.getMedicinalSearch(row.dictId);
      }
      this.state = row.checkStatus;
      this.saveGId = row.groupId;

      if (column.label === "自费金额") {
        this.centerDialogVisible = true;
      }
    },
    // 进行标注
    handleDrawRect(pos) {
      // const rowPos = Object.values(pos[0])
      pos = JSON.parse(pos);
      console.log('----------------', pos)

      const computedPos = {
        startPos: {
          ...pos.xmin,
        },
        endPos: {
          ...pos.ymax,
        },
      };
      // console.log(computedPos)
      this.resetCanvas();
      this.createBrush();
      this.autoDrawRect(computedPos);
    },
    resetCanvas() {
      this.canvasCtx.clearRect(0, 0, this.rect.width, this.rect.height);
      this.canvasCtx.putImageData(
        this.imageData,
        0,
        0,
        0,
        0,
        this.rect.width,
        this.rect.height
      );
    },
    // 创建画笔
    createBrush() {
      this.canvasCtx.shadowBlur = 0;
      this.canvasCtx.strokeStyle = this.strokeColor;
      this.canvasCtx.lineWidth = this.strokeWidth;
    },
    // 绘制标注
    autoDrawRect(pos) {
      const startPos = {
        x: pos.startPos.x / this.scale,
        y: pos.startPos.y / this.scale,
      };
      const endPos = {
        x: pos.endPos.x / this.scale,
        y: pos.endPos.y / this.scale,
      };
      const x = startPos.x;
      const y = startPos.y;
      const width = endPos.x - x;
      const height = endPos.y - y;

      this.canvasCtx.beginPath();
      this.canvasCtx.strokeRect(x, y, width, height);
      console.log("2", x, y, width, height);

      // this.canvasCtx.restore()
      this.canvasCtx.closePath();
    },
    getMedicinalSearch(dictId) {
      // 药品图标
      // console.log(dictId)
      Api.submit
        .medicinalSearch(dictId)
        .then((res) => {
          if (res.code === 1000) {
            this.content = res.data;
          } else {
            this.$message.error("获取药品备注失败");
          }
        })
        .catch((err) => {
          this.$message.error("获取药品备注失败");
        });
    },
    // 获取药品分类
    async handleSummaryList(params) {
      let res = await Api.submit.getSummary(params);

      if (res.code !== 1000) {
        this.$message.success(res.message);
      } else {
        this.reimbursementKinds = res.data;
      }
    },
    // 通过收费名称 取消报销分类
    handleRemoveReimburKinds(row) {
      console.log(row, "657");
      row.showIcon = true;
      this.$forceUpdate();
      const groupId = row.groupId;
      const materialObj = {
        yp: "药品全自费",
        zl: "基本医疗保险之外的费用",
        cl: "材料全自费",
      };
      row.summaryDTOS.splice(0);
      row.summaryDTOS.push({
        summaryMoney: row.cost,
        summaryType: materialObj[row.dictType],
      });
      this.$forceUpdate();
      this.updatedReimbursementKinds.ownCostIds.push(groupId);
      let updateSummaryIndex = this.updatedReimbursementKinds.updateSummaryReqDTOS.findIndex(
        (f) => f.groupId === groupId
      );
      if (updateSummaryIndex > -1) {
        this.updatedReimbursementKinds.updateSummaryReqDTOS.splice(
          updateSummaryIndex,
          1
        );
      }
      this.updatedReimbursementKinds.updateSummaryReqDTOS.push({
        groupId,
        summaryDTOS: [
          {
            summaryType: materialObj[row.dictType],
            summaryMoney: row.cost,
          },
        ],
      });
    },
    // 处理点击标签
    handleClickTags(tag, tagIndex, row) {
      this.updateCostForm.cost = tag.summaryMoney;
      this.updateCostForm.kind = tag.summaryType;
      this.currentActiveCell = row;
      this.currentActiveCell.tagIndex = tagIndex;
      this.currentActiveTag = tag;
      this.handleSummaryList({
        type: row.dictType,
        personType: this.personType,
      });
      this.updateCostDialogVisible = true;
    },
    submitUpdateCostForm() {
      let that = this;
      this.$refs["updateCostForm"].validate((valid) => {
        if (valid) {
          const tagIndex = that.currentActiveCell.tagIndex;
          const groupId = that.currentActiveCell.groupId;

          that.currentActiveCell.summaryDTOS[tagIndex].summaryType =
            that.updateCostForm.kind;
          that.currentActiveCell.summaryDTOS[tagIndex].summaryMoney =
            that.updateCostForm.cost;
          this.$forceUpdate();
          let updateSummaryIndex = that.updatedReimbursementKinds.updateSummaryReqDTOS.findIndex(
            (f) => f.groupId === groupId
          );
          if (updateSummaryIndex > -1) {
            const includeItem =
              that.updatedReimbursementKinds.updateSummaryReqDTOS[
                updateSummaryIndex
              ].summaryDTOS;
            const includeIdx = includeItem.findIndex(
              (f) => f.summaryType === that.currentActiveTag.summaryMoney
            );
            if (includeIdx > -1) {
              that.updatedReimbursementKinds.updateSummaryReqDTOS[
                updateSummaryIndex
              ].summaryDTOS[includeIdx].summaryType = that.updateCostForm.kind;
              that.updatedReimbursementKinds.updateSummaryReqDTOS[
                updateSummaryIndex
              ].summaryDTOS[includeIdx].summaryMoney = that.updateCostForm.kind;
            }
          } else {
            that.updatedReimbursementKinds.updateSummaryReqDTOS.push({
              groupId,
              summaryDTOS: [
                {
                  summaryType: that.updateCostForm.kind,
                  summaryMoney: that.updateCostForm.cost,
                },
              ],
            });
          }
          this.updateCostDialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 取消药品分类 进入自费列表
    handleCancelClassify(tag, tagIndex, row) {
      console.log(row, "rowww");
      console.log(tag, "tag");
      console.log(tagIndex, "tagIndex");
      this.currentActiveCell = row;
      const groupId = row.groupId;
      let updateSummaryIndex = this.updatedReimbursementKinds.updateSummaryReqDTOS.findIndex(
        (f) => f.groupId === groupId
      );

      if (row.summaryDTOS.length === 1) {
        return this.$message.warning("报销分类至少保留一个分类");
      }

      if (updateSummaryIndex > -1) {
        row.summaryDTOS.splice(tagIndex, 1);
        this.$forceUpdate();

        if (
          this.updatedReimbursementKinds.updateSummaryReqDTOS[
            updateSummaryIndex
          ].summaryDTOS.length <= 1
        ) {
          this.updatedReimbursementKinds.updateSummaryReqDTOS.splice(
            updateSummaryIndex,
            1
          );
          return;
        }

        let includeSummaryIdx = this.updatedReimbursementKinds.updateSummaryReqDTOS[
          updateSummaryIndex
        ].summaryDTOS.findIndex((f) => f.summaryType === tag.summaryType);
        this.updatedReimbursementKinds.updateSummaryReqDTOS[
          updateSummaryIndex
        ].summaryDTOS.splice(includeSummaryIdx, 1);

        // const groupId = row.groupId
        // const costIdIndex = this.updatedReimbursementKinds.ownCostIds.findIndex(g => g === groupId)
        // const updateSummaryIndex = this.updatedReimbursementKinds.updateSummaryReqDTOS.findIndex(u => u.groupId === groupId)
        //
        // if (costIdIndex < 0) {
        //   this.updatedReimbursementKinds.ownCostIds.push(groupId)
        //   row.summaryDTOS = [{
        //     summaryMoney: '',
        //     summaryType: '其他',
        //   }]
        //   this.$forceUpdate()
        //   if (updateSummaryIndex > 0) {
        //     this.updatedReimbursementKinds.updatedReimbursementKinds.splice(updateSummaryIndex, 1)
        //   }
        // } else {
        //   this.$message.warning('该药品已经设置为自费,无需重新设置')
        // }
      }
    },
    // 切换药品分类
    handleSelectClassify(row) {
      console.log(row, "table row");
      this.currentActiveCell = row;
      this.handleSummaryList({
        type: row.dictType,
        personType: this.personType,
      });
      this.editCostDialogVisible = true;
    },
    // 药品分类保存
    async submitCostForm() {
      this.$refs["costForm"].validate((valid) => {
        if (valid) {
          const groupId = this.currentActiveCell.groupId;
          // const costIdIndex = this.updatedReimbursementKinds.ownCostIds.findIndex(g => g === groupId)
          const updateSummaryIndex = this.updatedReimbursementKinds.updateSummaryReqDTOS.findIndex(
            (u) => u.groupId === groupId
          );

          if (
            this.currentActiveCell.summaryDTOS.findIndex(
              (s) => s.summaryType === this.editCostForm.kind
            ) > -1
          ) {
            return this.$message.error("当前收费项目名称已经存在次报销分类");
          }

          this.currentActiveCell.summaryDTOS.push({
            summaryMoney: this.editCostForm.cost,
            summaryType: this.editCostForm.kind,
          });
          this.$forceUpdate();

          if (updateSummaryIndex < 0) {
            this.updatedReimbursementKinds.updateSummaryReqDTOS.push({
              groupId,
              summaryDTOS: this.currentActiveCell.summaryDTOS,
              // summaryDTOS: [
              //   {
              //     summaryMoney: this.editCostForm.cost,
              //     summaryType: this.editCostForm.kind,
              //   }
              // ]
            });
          } else {
            this.updatedReimbursementKinds.updateSummaryReqDTOS[
              updateSummaryIndex
            ].summaryDTOS.push({
              summaryMoney: this.editCostForm.cost,
              summaryType: this.editCostForm.kind,
            });
          }

          this.editCostDialogVisible = false;
          this.$refs.costForm.resetFields();
        } else {
          return false;
        }
      });

      // if (updateSummaryIndex < 0) {
      //   this.updatedReimbursementKinds.updateSummaryReqDTOS.push({
      //     groupId,
      //     summaryDTOS: [
      //       {
      //         summaryMoney: this.editCostForm.cost,
      //         summaryType: this.editCostForm.kind,
      //       }
      //     ]
      //   })
      //
      //   if (costIdIndex > 0) {
      //     this.updatedReimbursementKinds.ownCostIds.splice(costIdIndex, 1)
      //   }
      // } else {
      //   this.updatedReimbursementKinds.updateSummaryReqDTOS.splice(updateSummaryIndex, 1, {
      //     groupId,
      //     summaryDTOS: [
      //       {
      //         summaryMoney: this.editCostForm.cost,
      //         summaryType: this.editCostForm.kind,
      //       }
      //     ]
      //   })
      // }
    },
  },
};
</script>

<style scoped lang='scss'>
.che-box {
  display: flex;

  .box-right {
    flex: 1;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;

    .opr {
      position: fixed;
      width: calc(50% - 60px);
      z-index: 500;
      background-color: #fff;
    }

    /deep/ .el-switch {
      position: absolute;
      right: 20px;
    }

    .ssBtn {
      // margin-top: 20px;
      // margin-right: 20px;
      position: absolute;
      left: 20px;
    }

    .body {
      padding-bottom: 100px;

      /deep/ .el-table .blueMon {
        background-color: rgba(43, 135, 238, 0.2);
      }

      /deep/ .el-table .cur {
        cursor: pointer;
      }

      /deep/ .el-table .greenMon {
        background-color: rgba(113, 184, 145, 0.2);
      }

      /deep/ .el-table .changed {
        background-color: rgba(155, 104, 236, 0.5);
      }

      /deep/ .el-table td,
      .el-table th {
        padding: 0px 0;
      }

      /deep/ .el-table .pink {
        background: rgba(255, 192, 203, 0.5);
      }

      /deep/ .el-table .red {
        background: rgba(128, 15, 0, 0.5);
      }

      /deep/ .el-table .grey {
        background: rgba(128, 128, 128, 0.5);
      }

      /deep/ .el-table .grey {
        background: rgba(128, 128, 128, 0.5);
      }

      /deep/ .el-table .detColor {
        background: rgba(105, 179, 105, 0.5);
      }

      /deep/ .el-table .abtColor {
        background: rgba(199, 190, 112, 0.5);
      }

      /deep/ .el-table__body {
        width: 100%;
        font-size: 14px;
      }

      .x {
        width: 12px;
        height: 12px;
        line-height: 10px;
        display: inline-block;
        border-radius: 50%;
        color: #fff;
        background-color: rgb(172, 4, 4);
        text-align: center;
        vertical-align: top;
        cursor: pointer;
      }
    }

    .header {
      height: 8%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hos {
      font-size: 20px;
      color: #333;
      text-align: center;
    }

    .tab-tit {
      display: flex;
      flex-wrap: wrap;
      padding: 5px 30px 10px 30px;
      color: #777;
      font-size: 12px;

      div {
        margin-right: 30px;
      }
    }
  }

  .diaCenter {
    text-align: center;

    .psPart {
      text-align: left;
      font-size: 12px;
      margin: 5px 0;
    }

    .conPart {
      margin: 10px 0;
    }
  }

  /deep/ .el-button--primary {
    padding: 8px 40px;
  }

  .edit-reimbursement-kinds {
    /*display: flex;*/
    /*align-items: center;*/

    .el-tag + .el-tag {
      margin-left: 0;
    }

    a {
      color: #409eff;
      font-size: 18px;
      cursor: pointer;
      margin-left: 5px;
    }

    .minus {
      color: #f56c6c;
    }

    a + a {
      margin-left: 5px;
    }
  }

  .charge-fee-name {
    a {
      color: #f56c6c;
      font-size: 18px;
      cursor: pointer;
      margin-left: 5px;
    }
  }
}

.edit-cost-dialog {
  .el-button--primary {
    padding: 12px 20px !important;
  }
}

.el-tag--small {
  height: 40px;
  line-height: 40px;
}
</style>