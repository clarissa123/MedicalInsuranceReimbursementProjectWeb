<template>
  <div>
    <div class="form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="row">
          <el-form-item label="角色名称：" prop="roleName" required>
            <el-input v-model="ruleForm.roleName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限：" prop="checkList" class="roles">
            <!-- <el-checkbox-group v-model="checkList">
              <el-checkbox v-show="roles.length>0" v-for="item in roles" :key="item.menuId" :label="item.menuId">
                <span class="caidan">{{item.menuName}}</span>
                <el-checkbox-group v-model="checkList2">
                  <el-checkbox v-show="item.portList.length>0" v-for="v in item.portList" :key="v.portId"
                    :label="v.portId">
                    <span class="anniu">{{v.portDescription}}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </el-checkbox>
            </el-checkbox-group>-->

            <div class="roles-content">
              <div class="top">
                <el-checkbox
                  v-show="roles.length>0"
                  v-for="item in roles"
                  :key="item.menuId"
                  :label="item.menuId"
                  v-model="checkList"
                >
                  <span class="caidan">{{item.menuName}}</span>
                </el-checkbox>
              </div>
              <div class="bottom" v-show="false">
                <el-checkbox-group
                  v-model="checkList2"
                  v-for="item in roles"
                  class="my-group"
                  :key="item.portId"
                >
                  <el-checkbox
                    v-show="item.portList.length>0"
                    v-for="v in item.portList"
                    :key="v.portId"
                    :label="v.portId"
                    class="son"
                  >
                    <span class="anniu">{{v.portDescription}}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="功能权限：" prop="checkList" class="roles">
            <div class="roles-content">
              <div class="top" v-show="false">
                <el-checkbox
                  v-show="roles.length>0"
                  v-for="item in roles"
                  :key="item.menuId"
                  :label="item.menuId"
                  v-model="checkList"
                >
                  <span class="caidan">{{item.menuName}}</span>
                </el-checkbox>
              </div>
              <div class="bottom">
                <el-checkbox-group
                  v-model="checkList2"
                  v-for="item in roles"
                  class="my-group"
                  :key="item.portId"
                >
                  <el-checkbox
                    v-show="item.portList.length>0"
                    v-for="v in item.portList"
                    :key="v.portId"
                    :label="v.portId"
                    class="son"
                  >
                    <span class="anniu">{{v.portDescription}}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="用途：" prop="description">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入（不必填）"
              v-model="ruleForm.description"
            ></el-input>
          </el-form-item>
        </div>
        <div class="row btn">
          <div class="btn1 left-btn cursor" @click="goback">取 消</div>
          <div class="btn1 right-btn cursor" @click="add">确 定</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/layer/PageHeader";
import { headerCellStyle } from "@/config";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/utils";
import Api from "@/api";
import axios from "@/axios";

export default {
  name: "userlnfo",
  components: {
    PageHeader,
  },
  data() {
    return {
      ruleForm: {
        roleName: "", //角色名称
        // roleParentId: "", //父级ID
        description: "", //用途
      },
      checkList: [],
      checkList2: [],
      tit: "新增用户",
      orgs: [],
      roles: [],
      rules: {
        roleName: [
          {
            required: true,
            message: "角色名称不能为空",
          },
        ],
      },
      id: "",
      returnId: "",
      parentList: [],
    };
  },
  methods: {
    //清空下拉框
    clearOne() {
      // this.ruleForm.roleParentId = "";
    },
    //父级ID下拉框
    changeOne(v) {
      // this.ruleForm.roleParentId = v;
    },
    //获取父级角色下拉框
    selectParent() {
      Api.manager
        .selectParent()
        .then((res) => {
          if (res.status === 200) {
            this.parentList = res.data;
          } else {
            this.$message.error("获取父级角色失败");
          }
        })
        .catch((err) => {
          this.$message.error("获取父级角色失败");
        });
    },
    getData() {
      Api.manager
        .getRole(this.id)
        .then((res) => {
          if (res.status === 200) {
            this.ruleForm = res.data;
          } else {
            this.$message.error("获取详情失败");
          }
        })
        .catch((err) => {
          this.$message.error("获取详情失败");
        });
    },
    goback() {
      this.$router.go(-1);
    },
    //新增角色
    add() {
      Api.manager.roleAdd(this.ruleForm).then((res) => {
        this.returnId = res.data;
        if (res.status === 200) {
          Api.manager
            .setMenu({
              ids: this.checkList,
              roleId: this.returnId,
            })
            .then((res) => {
              if (res.status === 200) {
                Api.manager
                  .setPort({
                    ids: this.checkList2,
                    roleId: this.returnId,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      this.$message({
                        showClose: true,
                        message: "新增成功",
                        type: "success",
                      });
                      this.$router.go(-1);
                    }
                  });
              }
            });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getMenuPort() {
      Api.myApi
        .getMenuPort()
        .then((res) => {
          if (res.status === 200) {
            this.roles = res.data;
          } else {
            this.$message.error("获取角色失败");
          }
        })
        .catch((err) => {
          this.$message.error("获取角色失败");
        });
    },
  },
  mounted() {
    this.$store.commit("SET_TOTAL", 0);
    //获取菜单权限列表
    this.getMenuPort();
    //获取父级角色下拉框
    this.selectParent();
    // //修改
    // if (this.$route.query.id) {
    //   console.log('this.$route.query.id', this.$route.query.id);
    //   this.id = this.$route.query.id;
    //   //根据id查询详情
    //   this.getData();
    // } else {
    //   this.tit = "修改角色";
    // }
  },
};
</script>

<style lang='scss' scoped>
@import "../../assets/myStyle/mixin.scss";

.form {
  background-color: #fff;
  border-radius: 10px;
  padding-top: 80px;
  min-height: calc(100vh - 130px);
  display: flex;
  justify-content: center;

  /deep/.row {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .el-form-item {
      margin-bottom: 24px;
    }

    .el-form-item:nth-child(2) {
      margin-bottom: 0;
    }

    .el-form-item:nth-child(3) {
      margin-top: 38px;
      margin-bottom: 38px;
    }

    .el-input,
    .el-textarea {
      width: 760px;
    }

    input.el-input__inner {
      height: 50px;
    }

    /deep/.el-select > .el-input {
      width: 250px;
    }

    /deep/.el-form-item__label {
      font-weight: 500;
    }

    .roles {
      .caidan {
        color: #333333;
      }

      .anniu {
        color: #7f7f7f;
      }

      .el-form-item__content {
        display: flex;
        flex-direction: row;
        padding-top: 12px;
      }

      .el-checkbox-group,
      .el-checkbox {
        display: flex;
      }

      .el-checkbox__label {
        .el-checkbox {
          margin-left: -24px;
          margin-top: 24px;
        }

        .el-checkbox-group {
          display: flex;
          flex-direction: column;
        }
      }

      .roles-content {
        .top {
          display: flex;
          margin-bottom: 24px;

          .el-checkbox {
            margin-right: 87px;
          }
        }
        .bottom {
          display: flex;
          flex-direction: row;

          .my-group {
            flex-direction: column;
            width: 100%;
            margin-right: 28px;

            &:nth-child(3) {
              margin-right: 29px;
            }

            &:nth-child(3) {
              margin-right: 32px;
            }

            &:nth-child(4) {
              margin-right: 29px;
            }

            &:nth-child(5) {
              margin-right: 1px;
            }

            label.el-checkbox.son {
              margin-bottom: 24px;
            }
          }
        }
      }
    }
  }

  .btn {
    display: flex;
    flex-direction: row;
    margin-bottom: 50px;
  }

  .btn1 {
    margin-top: 80px;
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
  }
}
</style>