<template>
  <div>
    <div class="form">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="row">
          <el-form-item
            label="所属地区："
            prop="regionList"
            :rules="[{ required: true, message: '地区不能为空'}]"
          >
            <el-cascader
              v-model="ruleForm.regionList"
              placeholder="请选择地区"
              clearable
              ref="myCascader"
              @active-item-change="handleItemChange"
              :options="areaList"
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="机构名："
            prop="organizationName"
            :rules="[{ required: true, message: '机构名不能为空'}]"
          >
            <el-input v-model="ruleForm.organizationName"></el-input>
          </el-form-item>
          <el-form-item
            label="地址："
            prop="organizationAddress"
            :rules="[{ required: true, message: '地址不能为空'}]"
          >
            <el-input v-model="ruleForm.organizationAddress"></el-input>
          </el-form-item>
        </div>
        <div class="btn">
          <div class="btn1 left-btn cursor" @click="goback">取 消</div>
          <div class="btn1 right-btn cursor" @click="edit">确 定</div>
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
  name: "orgInfo",
  components: {
    PageHeader,
  },
  mounted() {
    this.$store.commit("SET_TOTAL", 0);
    this.getArea("");
    this.id = this.$route.params.id;
    this.getData();
  },
  data() {
    return {
      id:'',
      areaList2: [
        {
          value: "1",
          label: "四川省",
          children: [
            {
              value: "2",
              label: "成都市",
              children: [
                {
                  value: "3",
                  label: "双流区",
                },
              ],
            },
          ],
        },
        {
          value: "4",
          label: "江西省",
        },
      ],
      areaList: [],
      ruleForm: {
        regionId: "",
        regionList: [],
        organizationName: "",
        organizationAddress: "",
      },
      props: {
        value: "value",
        children: "cities",
        checkStrictly: true,
      },
      value: {},
      options: [{}],
      tit: "新增机构",
    };
  },
  methods: {
    getData() {
      Api.myApi
        .getOrg(this.id)
        .then((res) => {
          if (res.status === 200) {
            this.ruleForm = res.data;
            this.$nextTick(() => {
              this.ruleForm.regionList = JSON.parse(res.data.list);
              this.getArea(this.ruleForm.regionList[0]);
              setTimeout(() => {
                this.getArea(this.ruleForm.regionList.slice(0, 2));
              }, 500);
              this.$refs.ruleForm.validateField("region");
            });
          } else {
            this.$message.error("获取详情失败");
          }
        })
        .catch((err) => {
          this.$message.error("重置失败");
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
                value: String(e.regionId),
                label: e.regionName,
                cities: [],
              }));
            } else if (val.length === 1) {
              // 加载二级
              vm.areaList.map((item) => {
                if (item.value === val[0]) {
                  item.cities = res.data.map((e) => ({
                    value: String(e.regionId),
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
                        value: String(e.regionId),
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
    handleItemChange(val) {
      this.getArea(val);
    },
    edit() {
      const areaNode = this.$refs.myCascader.getCheckedNodes()[0];
      this.ruleForm.regionId = areaNode.value;
      const req = this.ruleForm;
      req.regionList = JSON.stringify(this.ruleForm.regionList);
      Api.myApi
        .orgUpdate(this.ruleForm)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
            });
            this.$router.go(-1);
          } else {
            this.$message.error("修改失败");
          }
        })
        .catch((err) => {
          this.$message.error("修改失败");
        });
    },
    goback() {
      this.$router.go(-1);
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

  .row {
    @include fj(column, center);

    /deep/.el-input {
      width: 250px;
    }

    /deep/.el-select > .el-input {
      width: 250px;
    }
  }

  .btn {
    @include fj(row, center);
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