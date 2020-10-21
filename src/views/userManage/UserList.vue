<template>
  <div>
    <div class="table">
      <div class="head">
        <div>
          <span style="width: 80px;font-size:14px;font-weight:500;">机构名称：</span>
          <el-autocomplete
            class="my-autocomplete"
            v-model="queryParams.organizationName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入机构名称"
            @select="handleSelect"
            suffix-icon="el-icon-search"
            clearable
            @clear="clear"
            :trigger-on-focus="false"
          ></el-autocomplete>
          <el-input
            class="search-name"
            suffix-icon="el-icon-search"
            v-model="queryParams.userName"
            placeholder="请输入用户名"
            @input="searchName"
            clearable
            @clear="clearName"
          ></el-input>
        </div>
        <div>
          <el-button type="primary" size="small" @click="goAdd" class="addBtn" v-if="addBtn">新增人员</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="headerCellStyle"
          :cell-style="{'text-align': 'center'}"
          stripe
          v-loading="loading"
          :row-style="rowStyle"
        >
          <el-table-column type="index" width="150" label="序号" :index="setIndex"></el-table-column>
          <el-table-column prop="userAccount" label="用户名"></el-table-column>
          <el-table-column prop="userPhone" label="电话"></el-table-column>
          <el-table-column prop="organizationName" label="机构名称"></el-table-column>
          <el-table-column prop="roleName" label="角色"></el-table-column>
          <el-table-column width="300" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <span class="look cursor" @click="goEdit(scope.row.userId)" v-if="updateBtn">修改</span>
                <span
                  class="look cursor"
                  @click="clickModal(true,scope.row.userId)"
                  v-if="resetBtn"
                >重置</span>
                <span
                  class="look look-red cursor"
                  @click="clickModal2(true,scope.row.userId)"
                  v-if="deleteBtn"
                >删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page" v-if="pageshow">
        <Pagination
          :background="background"
          :hide="hide"
          :pageSize="queryParams.pageSize"
          :total="total"
          @pageChange="pageChangeTable"
        ></Pagination>
      </div>
    </div>

    <!-- 重置密码 -->
    <Popup
      :showModal="Popup.showModal"
      :width="Popup.width"
      :height="Popup.height"
      :title="Popup.title"
      @close="clickModal(false)"
      v-if="Popup.showModal"
      class="deleteUser-pop"
    >
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <span class="fz-24">是否确认重置密码？</span>
          </div>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal(false)">取 消</div>
        <div class="btn right-btn cursor" @click="resetPwd">确 定</div>
      </div>
    </Popup>

    <!-- 删除 -->
    <Popup
      :showModal="Popup2.showModal"
      :width="Popup2.width"
      :height="Popup2.height"
      :title="Popup2.title"
      @close="clickModal2(false)"
      v-if="Popup2.showModal"
      class="deleteUser-pop"
    >
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <span class="fz-24">是否确认删除该用户？</span>
          </div>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal2(false)">取 消</div>
        <div class="btn right-btn cursor" @click="personDeleted">确 定</div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { isAuth } from "@/router/index.js";
import Pagination from "@/components/layer/Pagination.vue";
import Popup from "@/components/layer/popup.vue";
import { headerCellStyle, rowStyle } from "@/config";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/utils";
import Api from "@/api";

export default {
  name: "userList",
  components: {
    Popup,
    Pagination,
  },
  data() {
    return {
      //解决elementui的分页bug 当选择其他页码时，进行搜索框搜索，当前页码数据不对！
      pageshow: "",
      //重置密码的ID
      resetPwdId: "",
      //删除的ID
      deleteId: "",
      //重置密码
      Popup: {
        width: 492,
        height: 170,
        showModal: false,
        title: "提示",
      },
      //删除
      Popup2: {
        width: 492,
        height: 170,
        showModal: false,
        title: "提示",
      },
      tableData: [],
      headerCellStyle,
      rowStyle,
      loading: false,
      //搜索参数
      queryParams: {
        organizationName: "",
        userName: "",
        pageNumber: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
      //分页
      total: 0, //总条数
      hide: true,
      background: true,
      //按钮权限
      addBtn: "",
      deleteBtn: "",
      updateBtn: "",
      resetBtn: "",
    };
  },
  mounted() {
    this.addBtn = isAuth("/medicare/user/addUpdate");
    this.deleteBtn = isAuth("/medicare/user/deleted");
    this.updateBtn = isAuth("/medicare/user/addUpdate");
    this.resetBtn = isAuth("/medicare/user/reset/pwd");
    this.getList(this.queryParams);
  },
  methods: {
    clear() {
      this.queryParams.organizationName = "";
      this.queryParams.pageNumber = 1;
      this.getList(this.queryParams);
    },
    searchName(v) {
      this.queryParams.pageNumber = 1;
      this.pageshow = false;
      this.getList(this.queryParams);
      this.$nextTick(() => {
        this.pageshow = true;
      });
    },
    clearName() {
      this.queryParams.userName = "";
      this.queryParams.pageNumber = 1;
      this.getList(this.queryParams);
    },
    //重置密码弹框
    clickModal(flag, id) {
      if (flag) {
        this.Popup.showModal = true;
        this.resetPwdId = id;
      } else {
        this.Popup.showModal = false;
      }
    },
    //删除弹框
    clickModal2(flag, id) {
      if (flag) {
        this.Popup2.showModal = true;
        this.deleteId = id;
      } else {
        this.Popup2.showModal = false;
      }
    },
    //分页
    pageChangeTable(item) {
      this.queryParams.pageNumber = item.page_index;
      this.getList(this.queryParams);
    },
    //远程搜索
    querySearchAsync(queryString, cb) {
      Api.user.selectBy(queryString).then((res) => {
        if (res.status == 200 && res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].value = res.data[i].organizationName;
          }
        } else {
          res.data = [];
        }
        cb(res.data);
      });
    },
    //远程搜索
    handleSelect(item) {
      this.queryParams.organizationName = item.organizationName;
      this.queryParams.pageNumber = 1;
      this.pageshow = false;
      this.getList(this.queryParams);
      this.$nextTick(() => {
        this.pageshow = true;
      });
    },
    getList(params) {
      this.loading = true;
      Api.manager
        .selectPage(params)
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
    //重置密码
    resetPwd() {
      Api.manager
        .resetPwd(this.resetPwdId)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              showClose: true,
              message: "重置密码成功",
              type: "success",
            });
            this.Popup.showModal = false;
            this.getList(this.queryParams);
          } else {
            this.$message.error("重置密码失败");
          }
          this.loading = false;
        })
        .catch((err) => {
          this.$message.error("重置密码失败");
          this.loading = false;
        });
    },
    //删除
    personDeleted() {
      Api.manager
        .personDeleted(this.deleteId)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            this.Popup2.showModal = false;
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
    goAdd() {
      this.$router.push({
        name: "userInfo",
      });
    },
    goEdit(id) {
      this.$router.push({
        name: "userInfoEdit",
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

  .head {
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

    /deep/.search-name {
      @include wh(322px, 50px);

      .el-input__inner {
        @include wh(322px, 50px);
      }
    }
  }

  /deep/.head > div {
    .el-select,
    .el-select .el-input__inner {
      width: 252px;
      height: 50px;
    }

    .my-autocomplete,
    .my-autocomplete .el-input__inner {
      @include wh(252px, 50px);
      margin-right: 8px;
    }
  }

  .table {
    padding: 0 15px;

    .look {
      color: $font-btn-blue;
      cursor: pointer;
      margin-right: 20px;
    }

    .look-red {
      color: $font-btn-red;
    }
  }
}

//------重置密码弹框 css------
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

.item {
  text-align: left;
  margin-left: 56px;
}
</style>