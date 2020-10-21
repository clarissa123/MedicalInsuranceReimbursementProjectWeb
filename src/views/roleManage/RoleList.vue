<!--
 * @Author: your name
 * @Date: 2020-08-06 10:59:57
 * @LastEditTime: 2020-09-07 15:36:13
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \MedicalInsuranceReimbursementProjectWeb\src\views\roleManage\RoleList.vue
-->
<template>
  <div>
    <div class="table">
      <div class="head">
        <div>
          <el-button type="primary" size="small" class="addBtn" @click="goDetail(1)" v-if="addBtn">新增角色</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle"
          :cell-style="{'text-align': 'center'}" stripe v-loading="loading" :row-style="rowStyle">
          <el-table-column type="index" width="150" label="序号" :index="setIndex"></el-table-column>
          <el-table-column prop="roleId" label="角色ID"></el-table-column>
          <el-table-column prop="roleName" width="200" label="角色名称"></el-table-column>
          <el-table-column width="500" align="left" label="菜单权限">
            <template slot-scope="scope">
              <span class="sort-style">{{ scope.row.auth }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="用途"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <div class="operation">
                <span class="look cursor" @click="goDetail(2,scope.row)" v-if="updateBtn">修改</span>
                <span class="look look-red cursor" @click="clickModal(true,scope.row.roleId)" v-if="deleteBtn">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
          @pageChange="pageChangeTable"></Pagination>
      </div>
    </div>

    <!-- 删除角色 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="clickModal(false)" v-if="Popup.showModal" class="deleteUser-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <span class="fz-24">是否确认删除该条角色信息？</span>
          </div>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal(false)">取 消</div>
        <div class="btn right-btn cursor" @click="rowDelete">确 定</div>
      </div>
    </Popup>
  </div>
</template>

<script>
  import {
    isAuth
  } from '@/router/index.js';
  import Pagination from "@/components/layer/Pagination.vue";
  import {
    headerCellStyle,
    rowStyle
  } from "@/config";
  import {
    getStorageItem,
    setStorageItem,
    removeStorageItem
  } from "@/utils";
  import Api from "@/api";
  import axios from "@/axios";
  import Popup from "@/components/layer/popup.vue";

  export default {
    name: "roleList",
    components: {
      Popup,
      Pagination,
    },
    mounted() {
      this.addBtn = isAuth("/medicare/role/updateAdd");
      this.deleteBtn = isAuth("/medicare/role/deleted");
      this.updateBtn = isAuth("/medicare/role/updateAdd");
      this.getList(this.queryParams);
    },
    data() {
      return {
        //删除提示
        Popup: {
          width: 492,
          height: 170,
          showModal: false,
          title: "提示",
        },
        tableData: [{
            code: "1",
            id: "001",
            name: "审核员",
            dx: "单据处理人员",
            qx1: "功能权限：除审批和用户管理外所有功能；",
            qx2: "数据权限：本单位的单据上传、操作、编辑和查看",
            yt: "上传、OCR结果调整、核算、汇总、提交审核",
          },
          {
            code: "2",
            id: "002",
            name: "复核员",
            dx: "单据复核人员",
            qx1: "功能权限：除用户管理外所有功能，且不能修改单据；",
            qx2: "数据权限：仅本单位的单据查看",
            yt: "单据查证、审核、回填",
          },
          {
            code: "3",
            id: "003",
            name: "管理员",
            dx: "管理人员",
            qx1: "功能权限：仅用户管理；",
            qx2: "数据权限：无",
            yt: "用户管理",
          },
        ],
        loading: false,
        headerCellStyle,
        rowStyle,
        deleteId: "",
        //搜索参数
        queryParams: {
          pageNumber: 1, //当前页数
          pageSize: 10, //每页显示多少条
        },
        //分页
        total: 0, //总条数
        hide: true,
        background: true,
        //按钮权限
        addBtn: '',
        deleteBtn: '',
        updateBtn: '',
      };
    },
    methods: {
      //分页
      pageChangeTable(item) {
        this.queryParams.pageNumber = item.page_index;
        this.getList(this.queryParams);
      },
      clickModal(flag, id) {
        if (flag) {
          this.Popup.showModal = true;
          this.deleteId = id;
        } else {
          this.Popup.showModal = false;
        }
      },
      getList(params) {
        this.loading = true;
        Api.manager
          .userList(params)
          .then((res) => {
            if (res.status === 200) {
              this.tableData = res.data.rows;
              this.total = res.data.total;
              this.$store.commit('SET_TOTAL', this.total);
            } else {
              this.$message.error("获取列表失败");
            }
            this.loading = false;
          })
          .catch((err) => {
            this.$message.error("获取列表失败");
            this.loading = false;
          });
      },
      handleCurrentChange(val) {
        this.pageNumber = val;
        this.getList(this.queryParams);
      },
      setIndex(index) {
        return (
          (this.queryParams.pageNumber - 1) * this.queryParams.pageSize +
          (index + 1)
        );
      },
      goDetail(flag, data) {
        if (flag == 2) {
          //编辑
          this.$router.push({
            name: "roleinfoEdit",
            params: {
              id: data.roleId,
            },
          });
        } else {
          //新增
          this.$router.push({
            name: "roleinfo",
          });
        }
      },
      rowDelete() {
        Api.manager
          .roleDelete(this.deleteId)
          .then((res) => {
            if (res.status == 200) {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
              this.Popup.showModal = false;
              this.getList(this.queryParams);
            } else {
              this.$message.error("删除失败");
            }
            this.loading = false;
          })
          .catch((err) => {
            this.$message.error("删除失败");
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang='scss' scoped>
  @import "../../assets/myStyle/mixin.scss";

  .table {
    background-color: #fff;
    border-radius: 10px;
    margin-top: 15px;
    height: fit-content;

    .table {
      padding: 0 15px;
    }

    .page {
      text-align: center;
      padding: 20px 0;
    }

    .head {
      color: 14px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 16px;

      .addBtn {
        width: 120px;
        height: $btn-height;
        background: $btn-blue;
        border-color: $btn-blue;
        border-radius: 25px;
        font-weight: 500;
        font-family: "PingFang Medium";
        font-size: 16px;
      }
    }

    .look {
      display: inline-block;
      color: $font-btn-blue;

      &:last-child {
        margin-left: 28px;
      }
    }

    .look-red {
      color: $font-btn-red;
    }
  }

  .sort-style {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  /deep/.el-pagination {
    text-align: center;
  }

  .slot-btns {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;

    .btn {
      width: 120px;
      height: 50px;
      border-radius: 25px;
      text-align: center;
      line-height: 50px;
    }

    .left-btn {
      background: rgba(250, 250, 250, 1);
    }

    .right-btn {
      background: $btn-blue;
      color: #fff;
      margin-left: 16px;
      margin-right: 24px;
    }
  }
</style>