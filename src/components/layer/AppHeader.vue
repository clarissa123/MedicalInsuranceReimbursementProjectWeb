<template>
  <el-header class="cu-header" style="height: 75px;">
    <div class="left">
      <div class="logo">
        <img src="~@/assets/logo_new.png" />
      </div>
      <div class="tit">
        <span>{{title}}</span>
        <span v-if="globalTotal>0" class="global-total">（{{globalTotal}}）</span>
      </div>
    </div>
    <!-- <div class="quick-search">
      <el-input
        placeholder="请输入药品名称、诊疗、材料"
        @keyup.enter.native="handleSearchMedicine"
        v-model="inputSearchVal"
      >
        <el-select v-model="defaultFilterType" slot="prepend" placeholder="请选择">
          <el-option
            v-for="(filterItem,filterIdx) in filterTypeList"
            :key="filterIdx"
            :label="filterItem.desc"
            :value="filterItem.desc"
          />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleSearchMedicine" />
      </el-input>
    </div>-->
    <div class="right">
      <div class="left-item">
        <el-input placeholder="请输入药品名称、诊疗、材料" @keyup.enter.native="handleSearchMedicine" v-model="inputSearchVal"
          class="input-search">
          <el-select v-model="defaultFilterType" slot="prepend" placeholder="请选择">
            <el-option v-for="(filterItem,filterIdx) in filterTypeList" :key="filterIdx" :label="filterItem.desc"
              :value="filterItem.desc" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearchMedicine" />
        </el-input>
      </div>
      <div class="right-item">
        <el-dropdown class="my-dropdown">
          <span class="el-dropdown-link">
            <img class="user-head" src="@/assets/defaultHead.png" alt />
            <span>{{userName}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <p @click="clickModal">
                <el-button type="text">修改密码</el-button>
              </p>
            </el-dropdown-item>
            <el-dropdown-item>
              <p class="drop-p" @click="loginOut">
                <el-button type="text">退出</el-button>
              </p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="检索结果" :visible.sync="dialogVisible" custom-class="global-search-dialog" width="70%">
      <div class="cu-dialog-content">
        <div class="top-search-container">
          <div class="input-box">
            <el-input placeholder="请输入药品名称、诊疗、材料" @keyup.enter.native="handleSearchMedicine" v-model="inputSearchVal">
              <el-select v-model="defaultFilterType" slot="prepend" placeholder="请选择">
                <el-option v-for="(filterItem,filterIdx) in filterTypeList" :key="filterIdx" :label="filterItem.desc"
                  :value="filterItem.desc" />
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="handleSearchMedicine" />
            </el-input>
          </div>
          <div class="search-result-tip">共为您找到 {{calcSearchResTotal}}个结果</div>
        </div>
        <el-card class="box-card" v-if="computedMedicinalShow">
          <div slot="header" class="cu-title">药品</div>
          <div class="table-container">
            <el-table :data="medicinalTableData" style="width: 100%">
              <el-table-column v-for="(col,colIdx) in medicinalTableColumn" :key="colIdx" show-overflow-tooltip
                tooltip-effect="light" :prop="col.prop" :label="col.label"></el-table-column>
            </el-table>
          </div>
          <div class="pagination-container" v-if="medicinalTotal>5">
            <el-pagination background @current-change="handleMedicinalPageChange" layout="prev, pager, next,jumper"
              :page-size="medicinalPageSize" :total="medicinalTotal"></el-pagination>
          </div>
        </el-card>
        <el-card class="box-card" v-if="computedDiagnosisShow">
          <div slot="header" class="cu-title">诊疗</div>
          <div class="table-container">
            <el-table :data="diagnosisTableData" style="width: 100%">
              <el-table-column v-for="(col,colIdx) in diagnosisTableColumn" :key="colIdx" show-overflow-tooltip
                tooltip-effect="light" :prop="col.prop" :label="col.label"></el-table-column>
            </el-table>
          </div>
          <div class="pagination-container" v-if="diagnosisTotal>5">
            <el-pagination background @current-change="handleDiagnosisPageChange" layout="prev, pager, next,jumper"
              :page-size="diagnosisPageSize" :total="diagnosisTotal"></el-pagination>
          </div>
        </el-card>
        <el-card class="box-card" v-if="computedMaterialShow">
          <div slot="header" class="cu-title">材料</div>
          <div class="table-container">
            <el-table :data="materialTableData" style="width: 100%">
              <el-table-column v-for="(col,colIdx) in materialTableColumn" :key="colIdx" show-overflow-tooltip
                tooltip-effect="light" :prop="col.prop" :label="col.label"></el-table-column>
            </el-table>
          </div>
          <div class="pagination-container" v-if="materialTotal>5">
            <el-pagination background @current-change="handleMaterialPageChange" layout="prev, pager, next,jumper"
              :page-size="materialPageSize" :total="materialTotal"></el-pagination>
          </div>
        </el-card>
      </div>
    </el-dialog>
    <!-- 修改密码 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="clickModal" v-if="Popup.showModal">
      <div class="slot-content-w">
        <div class="slot-middle">
          <el-form ref="form" :model="form" class="resetPwdForm">
            <el-form-item prop="oldPwd" :rules="[{ required: true, message: '请输入旧密码'}]">
              <el-input v-model="form.oldPwd" prefix-icon="el-icon-lock" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item prop="newPwd" :rules="[{ required: true, message: '请输入新密码'}]">
              <el-input v-model="form.newPwd" type="password" @keyup.enter.native="onSubmit" prefix-icon="el-icon-lock"
                placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item prop="newPwdAgain" :rules="[{ required: true, message: '请确认新密码'}]">
              <el-input v-model="form.newPwdAgain" type="password" @keyup.enter.native="onSubmit"
                prefix-icon="el-icon-lock" placeholder="请确认新密码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="slot-btns">
          <div class="btn left-btn" @click="clickModal">取消</div>
          <div class="btn right-btn" @click="onSubmit">确定</div>
        </div>
      </div>
    </Popup>
  </el-header>
</template>

<script>
  /**
   * @author: Homastin
   * @date: 2020/3/6  2:18 下午
   * @Description: add header
   */
  import Api from "@/api";
  import {
    MathRand,
    getStorageItem,
    setStorageItem,
    removeStorageItem,
    clearStorage,
    clearSessionStorage,
  } from "@/utils";
  import Popup from "@/components/layer/popup.vue";

  export default {
    name: "AppHeader",
    components: {
      Popup,
    },
    data() {
      return {
        form: {
          oldPwd: "",
          newPwd: "",
          newPwdAgain: "",
        },
        title: "",
        //修改密码弹框
        Popup: {
          width: 492,
          height: 424,
          showModal: false,
          title: "修改密码",
        },
        userName: JSON.parse(window.sessionStorage.getItem("userInfo"))
          .userAccount,
        inputSearchVal: "",
        defaultFilterType: "综合",
        filterTypeList: [],
        dialogVisible: false,
        // 药品
        medicinalTableLoading: false,
        medicinalTableColumn: [{
            label: "类别",
            prop: "type",
          },
          {
            label: "药品分类代码",
            prop: "medicinalCode",
          },
          {
            label: "药品分类",
            prop: "medicinalType",
            minWidth: 180,
          },
          {
            label: "分类1",
            prop: "typeOne",
            minWidth: 180,
          },
          {
            label: "分类2",
            prop: "typeTwo",
            minWidth: 180,
          },
          {
            label: "分类3",
            prop: "typeThree",
            minWidth: 180,
          },
          {
            label: "甲类/乙类",
            prop: "remiburseType",
            minWidth: 180,
          },
          {
            label: "药品名称",
            prop: "name",
            minWidth: 180,
          },
          {
            label: "剂型",
            prop: "form",
            minWidth: 180,
          },
          {
            label: "备注",
            prop: "remark",
            minWidth: 180,
          },
        ],
        medicinalTableData: [],
        medicinalPageNum: 1,
        medicinalTotal: 0,
        medicinalPageSize: 5,
        // 诊疗
        diagnosisTableLoading: false,
        diagnosisTableColumn: [{
            label: "诊疗编码",
            prop: "diagnosisCode",
          },
          {
            label: "名称",
            prop: "diagnosisName",
            minWidth: 180,
          },
          {
            label: "项目内涵",
            prop: "diagnosisInclude",
            minWidth: 180,
          },
          {
            label: "除外内容",
            prop: "diagnosisExcept",
            minWidth: 180,
          },
          {
            label: "项目说明",
            prop: "remakr",
            minWidth: 180,
          },
          {
            label: "计价单位",
            prop: "unit",
            minWidth: 180,
          },
          {
            label: "三甲",
            prop: "threeA",
            minWidth: 180,
          },
          {
            label: "三乙",
            prop: "threeB",
            minWidth: 180,
          },
          {
            label: "二甲",
            prop: "twoA",
            minWidth: 180,
          },
          {
            label: "二乙",
            prop: "twoB",
            minWidth: 180,
          },
          {
            label: "二乙下浮10%",
            prop: "oneA",
            minWidth: 180,
          },
          {
            label: "二乙下浮20%",
            prop: "unknowLevel",
            minWidth: 180,
          },
        ],
        diagnosisTableData: [],
        diagnosisPageNum: 1,
        diagnosisTotal: 0,
        diagnosisPageSize: 5,
        // 材料
        materialTableLoading: false,
        materialTableColumn: [{
            label: "材料编码",
            prop: "materialCode",
          },
          {
            label: "材料名称",
            prop: "materialName",
          },
          {
            label: "诊疗项目编码",
            prop: "diagnosisCode",
          },
          {
            label: "诊疗项目名称",
            prop: "diagnosisName",
          },
        ],
        materialTableData: [],
        materialPageNum: 1,
        materialTotal: 0,
        materialPageSize: 5,
      };
    },
    computed: {
      globalTotal() {
        return this.$store.state.globalTotal;
      },
      // 计算搜索结果总数
      calcSearchResTotal() {
        if (this.defaultFilterType === "综合") {
          return this.medicinalTotal + this.diagnosisTotal + this.materialTotal;
        } else if (this.defaultFilterType === "药品") {
          return this.medicinalTotal;
        } else if (this.defaultFilterType === "诊疗") {
          return this.diagnosisTotal;
        } else if (this.defaultFilterType === "材料") {
          return this.materialTotal;
        }
      },
      computedMedicinalShow() {
        const conditionList = ["综合", "药品"];
        if (conditionList.includes(this.defaultFilterType)) {
          return this.medicinalTotal > 0;
        }
        return false;
      },
      computedDiagnosisShow() {
        const conditionList = ["综合", "诊疗"];
        if (conditionList.includes(this.defaultFilterType)) {
          return this.diagnosisTotal > 0;
        }
        return false;
      },
      computedMaterialShow() {
        const conditionList = ["综合", "材料"];

        if (conditionList.includes(this.defaultFilterType)) {
          return this.materialTotal > 0;
        }
        return false;
      },
    },
    methods: {
      // 打开/关闭 弹窗
      clickModal() {
        this.Popup.showModal = !this.Popup.showModal;
      },
      //修改密码 提交
      onSubmit() {
        this.$refs.form
          .validate((valid) => {
            if (valid) {
              this.base64 = require("js-base64").Base64;
              let newPwd = this.base64.encode(this.form.newPwd);
              let oldPwd = this.base64.encode(this.form.oldPwd);
              //加入干扰字符
              let Num = MathRand();
              newPwd = newPwd.slice(0, 5) + Num + newPwd.slice(5);
              oldPwd = oldPwd.slice(0, 5) + Num + oldPwd.slice(5);
              const req = {
                newPwd: newPwd,
                oldPwd: oldPwd,
              };
              Api.myApi.updateSelf(req).then((res) => {
                if (res.status === 200) {
                  this.$message({
                    showClose: true,
                    message: "修改成功",
                    type: "success",
                  });
                  this.Popup.showModal = false;
                  this.$router.push({
                    name: "login",
                  });
                } else {
                  this.$message.error(res.msg);
                }
              });
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      },
      loginOut() {
        Api.user.logout().then((res) => {
          if (res.status === 200) {
            // 清空localStorage
            clearStorage();
            this.$message({
              message: "退出成功",
              type: "success",
            });
            this.$router.push({
              name: "login",
            });
          } else {
            this.$message.error("系统错误！");
          }
        });
      },
      async handleSearchMedicine() {
        switch (this.defaultFilterType) {
          case "药品":
            await this.handlePageMedicinal();
            if (!this.medicinalTotal) {
              return this.$message.warning("暂无数据");
            }
            break;
          case "诊疗":
            await this.handlePageDiagnosis();
            if (!this.diagnosisTotal) {
              return this.$message.warning("暂无数据");
            }
            break;
          case "材料":
            await this.handlePageMaterial();
            if (!this.materialTotal) {
              return this.$message.warning("暂无数据");
            }
            break;
          default:
            await this.handlePageMedicinal();
            await this.handlePageDiagnosis();
            await this.handlePageMaterial();
            if (
              !this.medicinalTotal &&
              !this.diagnosisTotal &&
              !this.materialTotal
            ) {
              return this.$message.warning("暂无数据");
            }
            break;
        }
        this.dialogVisible = true;
      },
      async getDictTypeList() {
        try {
          const res = await Api.submit.dictTypeList();
          if (res.code !== 1000) {
            this.$message.error(res.message);
            return false;
          }
          this.filterTypeList = res.data;
        } catch (e) {
          this.$message.error(e.message);
        }
      },
      // 获取药品列表
      async getPageMedicinal() {
        try {
          const res = await Api.submit.pageMedicinal({
            name: this.inputSearchVal,
            pageNum: this.medicinalPageNum,
            pageSize: 5,
          });
          if (res.code !== 1000) {
            this.$message.error(res.message);
            return false;
          }
          return res.data;
        } catch (e) {
          Promise.reject(e.message || "系统错误");
        }
      },
      async handlePageMedicinal() {
        const data = await this.getPageMedicinal();

        if (data) {
          this.medicinalTableData = data.list;
          this.medicinalTotal = data.total;
        }
      },
      handleMedicinalPageChange(e) {
        this.medicinalPageNum = e;
        this.handlePageMedicinal();
      },
      // 获取诊疗列表
      async getPageDiagnosis() {
        try {
          const res = await Api.submit.pageDiagnosis({
            name: this.inputSearchVal,
            pageNum: this.diagnosisPageNum,
            pageSize: 5,
          });

          if (res.code !== 1000) {
            this.$message.error(res.message);
            return false;
          }
          return res.data;
        } catch (e) {
          Promise.reject(e.message || "系统错误");
        }
      },
      async handlePageDiagnosis() {
        const data = await this.getPageDiagnosis();

        if (data) {
          this.diagnosisTableData = data.list;
          this.diagnosisTotal = data.total;
        }
      },
      handleDiagnosisPageChange(e) {
        this.diagnosisPageNum = e;
        this.handlePageDiagnosis();
      },
      // 获取材料列表
      async getPageMaterial() {
        try {
          const res = await Api.submit.pageMaterial({
            name: this.inputSearchVal,
            pageNum: this.materialPageNum,
            pageSize: 5,
          });

          if (res.code !== 1000) {
            this.$message.error(res.message);
            return false;
          }
          return res.data;
        } catch (e) {
          Promise.reject(e.message || "系统错误");
        }
      },
      async handlePageMaterial() {
        const data = await this.getPageMaterial();

        if (data) {
          this.materialTableData = data.list;
          this.materialTotal = data.total;
        }
      },
      handleMaterialPageChange(e) {
        this.materialPageNum = e;
        this.handlePageMaterial();
      },
      init() {
        this.getDictTypeList();
      },
    },
    mounted() {
      this.init();
      this.title = this.$route.meta.title;
    },
    watch: {
      $route(newRouter, oldRouter) {
        this.$nextTick(() => {
          this.title = newRouter.meta.title;
        });
      },
    },
  };
</script>

<style lang="scss">
  @import "../../assets/myStyle/mixin.scss";
  @import "../../assets/myStyle/common.scss";

  .cu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 60px;
    box-sizing: border-box;
    background: #f9f9f9;

    .left {
      display: flex;
      align-items: center;

      .logo {
        vertical-align: bottom;

        .product-name {
          margin-left: 12px;
          color: $font-color;
          font-size: 22px;
        }

        >img {
          /*width:280px;*/
          height: 24px;
        }
      }

      .tit {
        margin-left: 25px;
        font-size: 20px;
        font-family: "PingFang Medium";
        font-weight: 500;
        color: $font-color;
        vertical-align: bottom;

        .global-total {
          color: $nav-font-blue;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        margin-right: 16px;
      }

      span {
        color: $font-color;
        font-size: 14px;
        cursor: pointer;
      }

      .left-item {
        .el-icon-search {
          color: $font-light-blue;
        }
      }

      .right-item {
        margin-left: 32px;
      }

      .input-search {
        width: 397px;

        input::-webkit-input-placeholder {
          color: $font-light-blue;
        }

        input::-moz-input-placeholder {
          color: $font-light-blue;
        }

        input::-ms-input-placeholder {
          color: $font-light-blue;
        }

        .el-input-group__prepend {
          background-color: #f9f9f9;

          .el-select {
            width: 80px;
          }
        }

        .el-input-group__append {
          background-color: #f9f9f9;
        }

        input.el-input__inner {
          color: $font-light-blue;
        }
      }

      .my-dropdown {}

      .quick-search {
        width: 397px;

        .el-input-group__prepend {
          background-color: #ffffff;

          .el-select {
            width: 80px;
          }
        }

        .el-input-group__append {
          background-color: #ffffff;
        }
      }
    }

    // 弹窗设置
    .slot-content-w {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;

      .slot-middle {
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom: 56px;

        /deep/form.el-form.resetPwdForm {
          width: 300px;
          box-sizing: content-box;
          background-color: #fff;

          .el-form-item {
            margin-bottom: 24px;
          }

          .el-input--prefix .el-input__inner {
            width: 300px;
            height: 50px;
            border-radius: 30px;
            border: 1px solid rgba(217, 217, 217, 1);
            font-family: "PingFang Medium";
            padding-left: 35px;
          }
        }
      }

      .slot-btns {
        width: 100%;
        height: 52px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;

        .btn {
          width: 120px;
          height: 50px;
          border-radius: 25px;
          line-height: 50px;
        }

        .right-btn {
          background: #4068b6;
          color: #fff;
          margin-left: 16px;
        }

        .left-btn {
          background: rgba(250, 250, 250, 1);
        }
      }
    }
  }

  .global-search-dialog {
    .cu-dialog-content {
      max-height: 600px;
      overflow: auto;

      .top-search-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;

        .input-box {
          width: 380px;

          .el-input-group__prepend {
            background-color: #ffffff;

            .el-select {
              width: 80px;
            }
          }

          .el-input-group__append {
            background-color: #ffffff;
          }
        }

        .search-result-tip {
          color: #0091ff;
          font-size: 18px;
          padding-right: 25px;
        }
      }
    }

    .box-card+.box-card {
      margin-top: 25px;
    }

    .box-card {
      .cu-title {
        font-size: 20px;
      }

      .pagination-container {
        display: flex;
        justify-content: center;
        padding: 20px 20px 10px 20px;
      }
    }
  }
</style>