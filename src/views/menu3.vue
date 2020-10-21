<!--
 * @Descripttion: 
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-08-18 16:30:17
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-10-12 10:54:38
-->
<template>
  <div class="menu3">
    <div class="top">
      <div class="top-left">
        <h2>统计分析</h2>
        <p>Data analysis</p>
      </div>
      <div class="top-right">
        <el-date-picker class="selectDate" value-format="yyyy-MM" v-model="queryParams.date" type="month"
          placeholder="选择日期" @change="changeMonth"></el-date-picker>
        <el-select clearable class="selectType" placeholder="报销类型" v-model="queryParams.type" @change="selectType">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="container">
      <div class="tip tip1">
        <img src="@/assets/icon1.png" alt />
        <div class="tit" v-show="show1">
          <span v-if="!value1">{{num1}}</span>
          <span v-if="value1">{{value1}}</span>
          <p>中国</p>
        </div>
        <div class="tip1-select" v-show="!show1">
          <el-select v-model="value1" placeholder="请选择" clearable @change="change1">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item"></el-option>
          </el-select>
        </div>
        <i class="el-icon-arrow-down cursor" @click="toggleTip1" v-show="show1"></i>
      </div>
      <div class="tip tip2">
        <img src="@/assets/icon2.png" alt />
        <div class="tit" v-show="show2">
          <span v-if="!value2">{{num2}}</span>
          <span v-if="value2">{{value2}}</span>
          <p v-if="!value1">市</p>
          <p v-if="value1">{{value1}}</p>
        </div>
        <div class="tip2-select" v-show="!show2">
          <el-select v-model="value2" placeholder="请选择" clearable @change="change2" @clear="clear1">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item"></el-option>
          </el-select>
        </div>
        <i class="el-icon-arrow-down cursor" @click="toggleTip2" v-show="show2"></i>
      </div>
      <div class="tip tip3">
        <img src="@/assets/icon3.png" alt />
        <div class="tit" v-show="show3">
          <span v-if="!value3">{{num3}}</span>
          <span v-if="value3">{{value3}}</span>
          <p v-if="!value2">县</p>
          <p v-if="value2">{{value2}}</p>
        </div>
        <div class="tip3-select" v-show="!show3">
          <el-select v-model="value3" placeholder="请选择" clearable @change="change3">
            <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item"></el-option>
          </el-select>
        </div>
        <i class="el-icon-arrow-down cursor" @click="toggleTip3" v-show="show3"></i>
      </div>
      <div class="tip tip4">
        <img src="@/assets/icon4.png" alt />
        <div class="tit" v-show="show4">
          <span v-if="!value4">{{num4}}</span>
          <span v-if="value4" class="org-name">{{value4}}</span>
          <p>机构</p>
        </div>
        <div class="tip4-search" v-show="!show4">
          <el-autocomplete class="my-autocomplete" v-model="queryParams.organization"
            :fetch-suggestions="querySearchAsync" placeholder="请输入机构名称" @select="handleSelect" clearable @clear="clear"
            :trigger-on-focus="false"></el-autocomplete>
          <i class="el-icon-search cursor autocomplete-search" @click="toggleTip4" v-show="!show4"></i>
        </div>
        <i class="el-icon-search cursor" @click="toggleTip4" v-show="show4"></i>
      </div>
    </div>
    <div class="footer">
      <div class="footer-item footer-left">
        <div class="item-top">
          <h2>报销比例</h2>
        </div>
        <div class="item-center">
          <My-echarts :id="echarts1.id" :name="echarts1.name" :radius="echarts1.radius" :color="echarts1.color"
            :fontSize="echarts1.fontSize" :chartData="echarts1.chartData" v-if="echarts1.chartData.length>0">
          </My-echarts>
          <div class="right-tip">
            <span v-if="rank">{{rank}}</span>
            <span v-if="rank">报销比例</span>
          </div>
        </div>
      </div>
      <div class="footer-item footer-right">
        <div class="item-top">
          <h2>报销金额分布</h2>
        </div>
        <div class="item-center">
          <My-echarts :id="echarts2.id" :name="echarts2.name" :radius="echarts2.radius" :color="echarts2.color"
            :fontSize="echarts2.fontSize" :chartData="echarts2.chartData" v-if="echarts2.chartData.length>0">
          </My-echarts>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Api from "@/api";
  import MyEcharts from "@/components/layer/MyEcharts";

  export default {
    mounted() {
      this.$store.commit("SET_TOTAL", 0);
      this.getType();
      this.getCountRegion();
      this.getRang(this.queryParams);
      this.getMoney(this.queryParams);
    },
    components: {
      "My-echarts": MyEcharts,
    },
    watch: {
      queryParams: {
        handler: function () {
          this.getRang(this.queryParams);
          this.getMoney(this.queryParams);
        },
        deep: true,
      },
    },
    data() {
      return {
        echarts1: {
          id: "pie1",
          name: "报销比例",
          fontSize: 14,
          radius: "75%",
          color: ["#4068B6", "#F8A800"],
          chartData: [],
        },
        echarts2: {
          id: "pie2",
          name: "报销金额分布",
          fontSize: 14,
          radius: "75%",
          color: ["#346FB2", "#4AB0CA", "#F8A800"],
          chartData: [],
        },
        //选择日期
        value1: "",
        //报销类型
        options: [{
            value: "四川省",
            label: "四川省",
          },
          {
            value: "江西省",
            label: "江西省",
          },
          {
            value: "湖北省",
            label: "湖北省",
          },
          {
            value: "福建省",
            label: "福建省",
          },
          {
            value: "黑龙江省",
            label: "黑龙江省",
          },
        ],
        //搜索参数
        queryParams: {
          //机构名
          organization: "",
          //日期
          date: "",
          //机构
          organizationId: "",
          //行政区域
          regionId: "",
          //报销类型
          type: "",
        },
        show1: true,
        options1: [],
        value1: "",
        choose1: "",
        show2: true,
        options2: [],
        value2: "",
        choose2: "",
        show3: true,
        options3: [],
        value3: "",
        choose3: "",
        show4: true,
        value4: "",
        num1: "",
        num2: "",
        num3: "",
        num4: "",
        rank: "",
      };
    },
    methods: {
      //选中月份
      changeMonth(v) {
        this.queryParams.date = v;
      },
      // 获取省、市、县、机构的默认值
      getCountRegion() {
        Api.myApi.getCountRegion().then((res) => {
          if (res.status === 200) {
            this.num1 = res.data.a;
            this.num2 = res.data.b;
            this.num3 = res.data.c;
            this.num4 = res.data.d;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      //获取报销类型
      getType() {
        Api.submit.personTypeList().then((res) => {
          this.options = [];
          if (res.code === 1000) {
            res.data.forEach((v) => {
              this.options.push({
                label: v.desc,
                value: v.code,
              });
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      //获取报销比例
      getRang(params) {
        Api.myApi.getRang(params).then((res) => {
          if (res.status === 200) {
            let small = "";
            let big = "";
            this.echarts1.chartData = [];
            for (let i in res.data) {
              this.echarts1.chartData.push({
                name: i,
                value: Math.round(res.data[i] * 100) / 100,
              });
            }

            this.echarts1.chartData.forEach((v) => {
              if (v.name == "all") {
                v.name = "单据金额";
                big = v.value;
              } else {
                v.name = "报销金额";
                small = v.value;
              }
            });
            if (small == "" || big == "") {
              this.rank = "";
            } else {
              this.rank = ((small / big) * 100).toFixed(2) + "%";
              console.log("big", big);
              console.log("small", small);
              console.log("this.rank", this.rank);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      //获取报销金额分布
      getMoney(params) {
        Api.myApi.getMoney(params).then((res) => {
          if (res.status === 200) {
            this.echarts2.chartData = [];
            for (let i in res.data) {
              this.echarts2.chartData.push({
                name: i,
                value: Math.round(res.data[i] * 100) / 100,
              });
            }
            this.echarts2.chartData.forEach((v) => {
              if (v.name == "zl") {
                v.name = "诊疗";
              } else if (v.name == "yp") {
                v.name = "药品";
              } else {
                v.name = "材料";
              }
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      selectType(v) {
        this.queryParams.type = v;
      },
      toggleTip4() {
        this.show4 = !this.show4;
      },
      //远程搜索——机构
      querySearchAsync(queryString, cb) {
        console.log("queryString", queryString);
        Api.myApi.searchOrg(queryString).then((res) => {
          console.log("res===>", res);
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
      //选中——机构
      handleSelect(item) {
        console.log("item", item);
        this.value4 = item.organizationName;
        this.show4 = true;
        this.queryParams.organizationId = item.organizationId;
      },
      //清除——机构
      clear() {
        this.queryParams.organizationId = "";
        this.queryParams.organization = "";
        this.show4 = true;
        this.value4 = "";
      },
      toggleTip1() {
        this.show1 = !this.show1;
        if (!this.show1) {
          this.getSelectList1();
        }
      },
      clear1() {
        this.choose1 = "";
      },
      //获取省的下拉列表
      getSelectList1(params) {
        if (typeof params == "undefined") {
          params = "";
        }
        Api.myApi.getPro(params).then((res) => {
          if (res.status === 200) {
            res.data.forEach((v) => {
              v.value = v.regionId;
              v.label = v.regionName;
            });
            this.options1 = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      //获取市的下拉列表
      getSelectList2(params) {
        Api.myApi.getPro(params).then((res) => {
          if (res.status === 200) {
            res.data.forEach((v) => {
              v.value = v.regionId;
              v.label = v.regionName;
            });
            this.options2 = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      //获取县的下拉列表
      getSelectList3(params) {
        Api.myApi.getPro(params).then((res) => {
          if (res.status === 200) {
            res.data.forEach((v) => {
              v.value = v.regionId;
              v.label = v.regionName;
            });
            this.options3 = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      change1(v) {
        this.value1 = v.label;
        this.choose1 = v.value;
        this.show1 = !this.show1;
        this.queryParams.regionId = this.choose1;
      },
      toggleTip2() {
        this.show2 = !this.show2;
        if (!this.show2) {
          if (this.choose1 == "" || typeof this.choose1 == "undefined") {
            this.show2 = true;
            this.$message.error("请先选择上级行政区域！");
          } else {
            this.getSelectList2(this.choose1);
          }
        }
      },
      clear2() {
        this.choose2 = "";
      },
      change2(v) {
        this.value2 = v.label;
        this.choose2 = v.value;
        this.show2 = !this.show2;
        this.queryParams.regionId = this.choose2;
      },
      toggleTip3() {
        this.show3 = !this.show3;
        console.log("choose1", this.choose1);
        console.log("choose2", this.choose2);
        console.log("choose3", this.choose3);
        if (!this.show3) {
          if (
            typeof this.choose1 == "undefined" ||
            this.choose2 == "" ||
            typeof this.choose2 == "undefined"
          ) {
            this.show3 = true;
            this.$message.error("请先选择上级行政区域！");
          } else {
            this.getSelectList3(this.choose2);
          }
        }
      },
      change3(v) {
        this.value3 = v.label;
        this.choose3 = v.value;
        this.show3 = !this.show3;
        this.queryParams.regionId = this.choose3;
      },
    },
  };
</script>
<style lang='scss' scoped>
  @import "../assets/myStyle/mixin.scss";

  .menu3 {
    @include wh(100%, 100%);
    padding: 40px;
    box-sizing: border-box;

    .top {
      @include fj();
      margin-bottom: 40px;

      .top-left {
        h2 {
          color: $btn-blue;
          font-size: 28px;
          font-weight: 600;
        }

        p {
          font-size: 24px;
          font-weight: 400;
          color: #cccccc;
        }
      }

      /deep/.top-right {
        input.el-input__inner {
          @include wh(194px, 50px);
        }

        .selectDate {
          @include wh(194px, 50px);
        }

        .selectType {
          margin-left: 24px;
          @include wh(194px, 50px);
        }

        .el-input__prefix {
          top: 2px;
        }
      }
    }

    .container {
      @include fj();
      margin-bottom: 24px;

      .tip {
        @include wh(377px, 134px);
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #efefef;
        @include fj();
        justify-content: flex-start;
        margin-right: 24px;

        &:hover {
          transition: all 0.5s;
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
        }

        img {
          display: inline-flex;
          @include wh(70px, 70px);
          margin-left: 32px;
        }

        .tit {
          @include wh(fit-content, auto);
          text-align: left;
          margin-left: 24px;

          span {
            font-size: 36px;
            font-weight: 600;
            color: $btn-blue;

            &:last-child {
              font-size: 28px;
              font-weight: 500;
            }
          }

          p {
            font-size: 14px;
            font-weight: 500;
            color: #cccccc;
          }
        }

        i {
          margin-left: auto;
          margin-right: 50px;
          color: $btn-blue;
        }
      }

      .tip1 {
        .tip1-select {
          margin-left: 16px;
        }
      }

      .tip2 {
        .tip2-select {
          margin-left: 16px;
        }
      }

      .tip3 {
        .tip3-select {
          margin-left: 16px;
        }
      }

      .tip4 {
        margin-right: 0;
        position: relative;

        /deep/.tip4-search {
          margin-left: 16px;

          .el-input__suffix {
            right: 25px;
          }
        }

        .autocomplete-search {
          position: absolute;
          right: 0;
          top: 45%;
        }

        .tit {
          .org-name {
            font-size: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .footer {
      @include fj();
      margin-bottom: 56px;

      .item-top {
        @include wh(100%, 82px);
        @include fj();
        border: 1px solid #efefef;

        h2 {
          margin-left: 32px;
          font-size: 18px;
          font-weight: 500;
          color: #333333;
        }
      }

      .item-center {
        @include wh(100%, calc(100% - 82px));
        position: relative;

        .right-tip {
          @include fj(column, flex-start);
          position: absolute;
          top: 33px;
          right: 40px;

          span {
            display: block;

            &:nth-child(1) {
              font-size: 36px;
              font-weight: 600;
              color: #fa6400;
            }

            &:nth-child(2) {
              font-size: 14px;
              font-weight: 500;
              color: #cccccc;
            }
          }
        }

        #pie1 {
          @include wh(778px, 450px);
        }

        #pie2 {
          @include wh(778px, 450px);
        }
      }

      .footer-item {
        @include wh(795px, 600px);
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #efefef;

        &:hover {
          transition: all 0.5s;
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
        }
      }

      .footer-left {}

      .footer-right {}
    }
  }
</style>