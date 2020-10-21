<template>
  <div>
    <div class="form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="row">
          <el-form-item label="用户名：" prop="userAccount" required>
            <el-input v-model="ruleForm.userAccount" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="userPhone" required>
            <el-input v-model="ruleForm.userPhone" maxlength="11" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="roleId" required>
            <el-select v-model="ruleForm.roleId" placeholder="请选择角色" clearable @change="selectOne($event)">
              <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构：" prop="organizationId" required>
            <el-select v-model="ruleForm.organizationId" placeholder="请选择机构" clearable @change="selectTwo($event)">
              <el-option v-for="item in orgs" :key="item.organizationId" :label="item.organizationName"
                :value="item.organizationId"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="btn">
          <div class="btn1 left-btn cursor" @click="goback"><span>取消</span></div>
          <div class="btn1 right-btn cursor" @click="edit"><span>确定</span></div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    headerCellStyle
  } from "@/config";
  import {
    getStorageItem,
    setStorageItem,
    removeStorageItem
  } from "@/utils";
  import Api from "@/api";
  import axios from "@/axios";

  export default {
    name: "userlnfo",
    mounted() {
      this.$store.commit("SET_TOTAL", 0);
      // 查询所有角色信息
      this.selectAll();
      //查询所有机构
      this.selectAllOrg();
      this.getData(this.$route.params.id)
    },
    data() {
      return {
        ruleForm: {
          userAccount: '',
          userPhone: "",
          roleId: "",
          organizationId: "",
        },
        // 查询所有登陆者可创建账号的机构
        orgs: [],
        //根据当前登录人查询可选父级角色
        roles: [],
        rules: {
          userAccount: [{
            required: true,
            message: "用户名不能为空"
          }],
          userPhone: [{
            required: true,
            message: "电话不能为空"
          }],
          roleId: [{
            required: true,
            message: "请选择角色",
            trigger: "change",
          }, ],
          organizationId: [{
            required: true,
            message: "请选择机构",
            trigger: "change",
          }, ],
        },
      };
    },
    methods: {
      //根据id获取数据
      getData() {
        Api.myApi.getUserDetail(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.ruleForm = res.data
          } else {
            this.$message.error('获取详情失败')
          }
        }).catch((err) => {
          this.$message.error('获取详情失败')
        })
      },
      //获取所有角色
      selectAll() {
        Api.user
          .selectAll()
          .then((res) => {
            if (res.status === 200) {
              this.roles = res.data;
            } else {
              this.$message.error("获取角色列表失败");
            }
          })
          .catch((err) => {
            this.$message.error("获取角色列表失败");
          });
      },
      //查询所有机构
      selectAllOrg() {
        Api.user
          .selectAllOrg()
          .then((res) => {
            if (res.status === 200) {
              this.orgs = res.data;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      goback() {
        this.$router.go(-1);
      },
      // 修改
      edit() {
        Api.myApi.editUser(this.ruleForm).then((res) => {
          if (res.status === 200) {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.$router.go(-1);
          } else {
            this.$message.error(res.message)
          }
        }).catch((err) => {
          this.$message.error(err.message)
        })
      },

      //角色 下拉框
      selectOne(event) {
        this.$forceUpdate();
        this.ruleForm.roleId = event;
      },
      //机构 下拉框
      selectTwo(event) {
        this.$forceUpdate();
        this.ruleForm.organizationId = event;
      },
    },
  };
</script>

<style lang='scss' scoped>
  @import "../../assets/myStyle/mixin.scss";

  .form {
    background-color: #fff;
    border-radius: 10px;
    margin-top: 15px;
    padding-top: 100px;
    min-height: calc(100vh - 130px);
    display: flex;
    flex-direction: column;
    align-items: center;

    .demo-ruleForm {
      .row {
        .el-input {
          width: 252px;
        }

        /deep/.el-select>.el-input {
          width: 252px;
        }

        /deep/.el-form-item__label {
          font-weight: 500;
        }

        /deep/.el-input__inner {
          height: 50px;
        }
      }

      .btn {
        margin-top: 65px;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      .btn1 {
        width: 120px;
        height: 50px;
        border-radius: 25px;
        text-align: center;
        line-height: 50px;
        font-weight: 500;
        letter-spacing: 1px;

        span {
          font-size: 16px;
        }
      }

      .left-btn {
        background: rgba(250, 250, 250, 1);
      }

      .right-btn {
        background: $btn-blue;
        color: #fff;
        margin-left: 16px;
      }
    }
  }
</style>