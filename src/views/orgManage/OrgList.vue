<template>
  <div>
    <div class="table">
      <div class="head">
        <div>
          <span style="width: 80px;font-size:14px">所属地区：</span>
          <el-cascader v-model="regions" placeholder="请选择地区" clearable size="small" ref="myCascader"
            @active-item-change="handleItemChange" @change="positionChange" :options="areaList" :props="props">
          </el-cascader>
          <el-input class="search-name" suffix-icon="el-icon-search" v-model="queryParams.organizationName"
            placeholder="请输入机构名称" @input="searchName" clearable @clear="clearName"></el-input>
        </div>
        <div>
          <el-button type="primary" size="small" @click="goAdd" class="addBtn" v-if="addBtn">新增机构</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle"
          :cell-style="{'text-align': 'center'}" stripe v-loading="loading" :row-style="rowStyle">
          <el-table-column type="index" width="150" label="序号" :index="setIndex"></el-table-column>
          <el-table-column prop="organizationName" label="机构名称"></el-table-column>
          <el-table-column label="机构地址" prop="organizationAddress"></el-table-column>
          <el-table-column width="300" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <span class="look cursor" @click="goEdit(scope.row.organizationId)" v-if="updateBtn">修改</span>
                <span class="look look-red cursor" @click="clickModal(true,scope.row.organizationId)"
                  v-if="deleteBtn">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page" v-if="pageshow">
        <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
          @pageChange="pageChangeTable"></Pagination>
      </div>
    </div>
    <!-- 删除机构 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="clickModal(false)" v-if="Popup.showModal" class="deleteUser-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <span class="fz-24">是否确认删除该条机构？</span>
          </div>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal(false)">取 消</div>
        <div class="btn right-btn cursor" @click="personDeleted">确 定</div>
      </div>
    </Popup>
  </div>
</template>

<script>
  import {
    isAuth
  } from '@/router/index.js';
  import Pagination from "@/components/layer/Pagination.vue";
  import Popup from "@/components/layer/popup.vue";
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

  export default {
    name: "orgList",
    components: {
      Popup,
      Pagination,
    },
    data() {
      return {
        //解决elementui的分页bug 当选择其他页码时，进行搜索框搜索，当前页码数据不对！
        pageshow: "",
        //删除的ID
        deleteId: "",
        //删除
        Popup: {
          width: 492,
          height: 170,
          showModal: false,
          title: "提示",
        },
        regions: [],
        //搜索参数
        queryParams: {
          regionId: "", //区域id
          organizationName: "", //机构名称
          pageNumber: 1, //当前页数
          pageSize: 10, //每页显示多少条
        },
        //分页
        total: 0, //总条数
        hide: true,
        background: true,
        areaList: [],
        tableData: [],
        ZdyTime: [],
        headerCellStyle,
        rowStyle,
        loading: false,
        props: {
          value: "value",
          children: "cities",
          checkStrictly: true,
        },
        //按钮权限
        addBtn: '',
        deleteBtn: '',
        updateBtn: '',
      };
    },
    mounted() {
      this.addBtn = isAuth("/medicare/organization/addUpdate");
      this.deleteBtn = isAuth("/medicare/organization/deleted");
      this.updateBtn = isAuth("/medicare/organization/addUpdate");
      this.getList(this.queryParams);
      this.getArea("");
    },
    methods: {
      searchName() {
        this.queryParams.pageNumber = 1;
        this.pageshow = false;
        this.getList(this.queryParams);
        this.$nextTick(() => {
          this.pageshow = true;
        });
      },
      clearName() {
        this.queryParams.organizationName = "";
        this.queryParams.pageNumber = 1;
        this.getList(this.queryParams);
      },
      //分页
      pageChangeTable(item) {
        this.queryParams.pageNumber = item.page_index;
        this.getList(this.queryParams);
      },
      //删除弹框
      clickModal(flag, id) {
        if (flag) {
          this.Popup.showModal = true;
          this.deleteId = id;
        } else {
          this.Popup.showModal = false;
        }
      },
      handleItemChange(val) {
        this.getArea(val);
      },
      positionChange() {
        this.queryParams.regionId = this.regions[this.regions.length - 1];
        this.queryParams.pageNumber = 1;
        this.pageshow = false;
        this.getList(this.queryParams);
        this.$nextTick(() => {
          this.pageshow = true;
        });
      },
      getArea(val, cb) {
        const vm = this; // 查询省市县
        let req = "";
        if (val === "") {
          // 初始化加载 获取所有省份数据
          req = "";
        } else if (val.length === 1) {
          // 加载二级  获取市级数据
          req = val[0];
        } else if (val.length === 2) {
          // 3
          req = val[1];
        }
        Api.myApi
          .selectByLeavel(req)
          .then((res) => {
            if (res.status === 200) {
              if (val === "") {
                vm.areaList = res.data.map((e) => ({
                  value: e.regionId,
                  label: e.regionName,
                  cities: [],
                  // disabled: true,
                }));
              } else if (val.length === 1) {
                // 加载二级
                vm.areaList.map((item) => {
                  if (item.value === val[0]) {
                    item.cities = res.data.map((e) => ({
                      value: e.regionId,
                      label: e.regionName,
                      cities: [],
                    }));
                  }
                });
              } else {
                // 加载3级
                vm.areaList.map((item) => {
                  if (item.value === val[0]) {
                    item.cities.map((value) => {
                      if (value.value === val[1]) {
                        value.cities = res.data.map((e) => ({
                          value: e.regionId,
                          label: e.regionName,
                        }));
                      }
                    });
                  }
                });
              }
              cb && cb(res);
            } else {
              this.$message.error("获取列表失败");
            }
          })
          .catch((err) => {
            this.$message.error("获取列表失败");
          });
      },
      //列表
      getList(params) {
        this.loading = true;
        Api.manager
          .selectOrg(params)
          .then((res) => {
            if (res.status === 200) {
              this.pageshow = true;
              this.tableData = res.data.rows;
              this.total = res.data.total;
              this.$store.commit("SET_TOTAL", this.total);
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
      //删除
      personDeleted() {
        Api.myApi
          .orgDeleted(this.deleteId)
          .then((res) => {
            if (res.status === 200) {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
              this.Popup.showModal = false;
              this.getList(this.queryParams);
            } else {
              this.$message.error(res.msg);
            }
            this.loading = false;
          })
          .catch((err) => {
            this.$message.error(res.msg);
            this.loading = false;
          });
      },
      detailBtn(data) {
        this.$confirm("是否确认删除机构?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.loading = true;
          Api.manager
            .orgDelete(data.id)
            .then((res) => {
              if (res.code === 1000) {
                this.$message({
                  showClose: true,
                  message: "删除成功",
                  type: "success",
                });
                this.queryParams.pageNum = 1;
                this.getList();
              } else {
                this.$message.error("删除失败");
              }
              this.loading = false;
            })
            .catch((err) => {
              this.$message.error("删除失败");
              this.loading = false;
            });
        });
      },
      handleCurrentChange(val) {
        this.queryParams.pageNum = val;
        this.getList();
      },
      goAdd() {
        this.$router.push({
          name: "orgInfo",
        });
      },
      goEdit(id) {
        this.$router.push({
          name: "orgInfoEdit",
          params: {
            id: id,
          },
        });
      },
      //序号
      setIndex(index) {
        return (
          (this.queryParams.pageNumber - 1) * this.queryParams.pageSize +
          (index + 1)
        );
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
    min-height: calc(100vh - 308px);

    /deep/.head {
      @include fj;
      padding: 0px 15px 10px 15px;

      .el-input-group {
        width: 400px;
      }

      .timeP {
        flex: 1;

        .el-range-editor--small.el-input__inner {
          width: 270px;
        }

        /deep/.el-date-editor .el-range-separator {
          width: 10%;
        }
      }

      .el-cascader-panel {
        min-height: 100px;
      }

      .el-cascader--small {
        margin-right: 8px;
      }

      .addBtn {
        width: 120px;
        height: $btn-height;
        background: $btn-blue;
        border-color: $btn-blue;
        border-radius: 25px;
        letter-spacing: 1px;
        font-weight: 500;
        font-family: "PingFang Medium";
        font-size: 16px;
      }

      /deep/.search-name {
        @include wh(322px, 50px);

        .el-input__inner {
          @include wh(322px, 50px);
        }
      }

      .el-input--small .el-input__inner {
        height: 50px;
        line-height: 50px;
      }
    }

    .head>div {

      .el-select,
      .el-select .el-input__inner {
        width: 252px;
        height: 50px;
      }
    }

    .table {
      padding: 0 15px;

      .look {
        color: $btn-blue;
        cursor: pointer;
        margin-right: 20px;
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