<template>
  <div class="ocr-table">
    <div class="top">
      <div class="title">
        <div class="l">
          <span> 标&emsp;&emsp;题：</span>
          <el-input placeholder="请输入标题" v-model="title" clearable class="input1">
          </el-input>
        </div>
        <div class="r">
          <el-button @click="submit">提交</el-button>
        </div>
      </div>
      <div class="username">
        <div class="l">
          <span> 患者姓名：</span>
          <el-input placeholder="请输入患者姓名" v-model="username" clearable class="input1">
          </el-input>
        </div>
        <div class="r">
          <div class="page">
            <i class="el-icon-arrow-left cursor" @click="prevPage"></i>
            <span>&emsp;&emsp;{{ current_page }}&emsp;/&emsp;{{
                num
              }}&emsp;&emsp;</span>
            <i class="el-icon-arrow-right cursor" @click="nextPage"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div v-if="num != 0">
      <div v-for="(v, i) in num" :key="i">
        <div :id="test(i)" v-show="current_page - 1 == i"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Handsontable from "handsontable";
  import "handsontable/dist/handsontable.full.css";
  import "handsontable/languages/zh-CN"; //引入中文语言包
  import Api from "@/api";

  export default {
    data() {
      return {
        num: 0,
        //跳转的数据 id
        dataId: "",
        //标题
        title: "",
        //患者姓名
        username: "",
        //分页
        current_page: 1, //当前页
        total: 0, //总页数
        tempHeaders: [], //存放每一页的表头
        temp: [],
        tempData: [], //存放每一页的表体
        tempPageData: [], //存放每一页的完整数据（包含表头+表体）
        allData: [], //全部表格数据
        bigData: [], //全部表格数据 + 标题 + 用户名 + 传的 id
      };
    },
    mounted() {
      this.dataId = this.$route.query.id;
      this.getText();
    },
    methods: {
      test(i) {
        return "table" + (i + 1);
      },
      getText() {
        Api.submit
          .ocrTextAndHandle(this.dataId)
          .then((res) => {
            if (res.code === 1000) {
              res.data = JSON.parse(res.data);
              console.log('数据是：', res);
              this.num = res.data.length;
              this.$nextTick(() => {
                this.getData(res);
              });
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error("要素识别失败");
          });
      },
      getData(res) {
        const _this = this;
        this.allData[0] = {}
        this.allData[1] = {}
        console.log('res==>', res);
        this.allData[0].body = res.data[0].body
        this.allData[1].body = res.data[1].body

        const container1 = document.getElementById("table1");
        const container2 = document.getElementById("table2");
        this.createTable(container1, res.data[0]);
        this.createTable(container2, res.data[1]);
      },
      createTable(container, res) {
        console.log("res>>>>>>>", res);
        let tempData = res.body;
        let tempHeaders = res.head[0];
        const _this = this;
        let ht = new Handsontable(container, {
          data: tempData,
          licenseKey: "non-commercial-and-evaluation",
          observeChanges: true,
          colHeaders: true, // 列头
          rowHeaders: true, // 行头
          colWidths: 70,
          mergeCells: true,
          stretchH: "all",
          width: "100%",
          autoWrapRow: true,
          height: 650,
          autoWrapRow: true, //自动换行
          colHeaders: tempHeaders,
          contextMenu: true,
          manualRowResize: true,
          manualColumnResize: true,
          manualRowMove: true,
          manualColumnMove: true,
          dropdownMenu: true,
          collapsibleColumns: true,
          hiddenColumns: true,
          language: "zh-CN", //声明用中文的语言包
          dropdownMenu: {
            items: tempHeaders,
            callback: function (key, options) {
              //互换位置
              tempHeaders[options[0].end.col] = tempHeaders.splice(
                key,
                1,
                tempHeaders[options[0].end.col]
              )[0];
              ht.updateSettings({
                colHeaders: tempHeaders,
              });
            },
          },
          //自定义右键菜单
          contextMenu: {
            items: {
              // 自定义菜单
              setTitle: {
                name: "设为标题",
              },
              setUserName: {
                name: "设为患者姓名",
              },
              hsep1: "---------",
              // 上面插入一行
              row_above: {},
              // 下面插入一行
              row_below: {},
              hsep2: "---------",
              // 左侧插入一列
              col_left: {},
              // 右侧插入一列
              col_right: {},
              hsep3: "---------",
              // 删除行
              remove_row: {},
              // 删除列
              remove_col: {},
              hsep4: "---------",
            },
            callback: function (key, options) {
              let row = options[0].start.row;
              let col = options[0].start.col;
              if (key === "setTitle") {
                //设为标题后，删除整行
                //获取被选中的数据
                let data = ht.getDataAtCell(row, col);
                // //获取被选中数据所在行的整行数据
                // this.rowData = ht.getDataAtRow(row);
                //成功提示
                _this.$nextTick(() => {
                  _this.title = data;
                });
                //移除整行
                ht.alter("remove_row", row);
              }
              if (key === "setUserName") {
                //设为患者姓名后，删除整行
                //获取被选中的数据
                let data = ht.getDataAtCell(row, col);
                //成功提示
                _this.$nextTick(() => {
                  _this.username = data;
                });
                //移除整行
                ht.alter("remove_row", row);
              }
            },
          },
          beforeRemoveCol(index, amount) {
            if (
              tempHeaders[index] == "费用名称" ||
              tempHeaders[index] == "金额"
            ) {
              $message.error("不能删除费用名称或金额");
              return false;
            }
          },
          afterChange: function (changes, source) {
            // 数据改变时触发此方法
            if (source == "edit" || source == "loadData") {
              _this.allData[_this.current_page].body = this.getData();
            }
          },
        });

        return ht;
      },
      //提交到数据库
      submit() {
        Api.submit
          .changeOcrResult({
            data1: this.allData,
            data2: {
              title: this.title,
              username: this.username,
              reimbursementId: this.dataId,
            },
          })
          .then((res) => {
            if (res.code === 1000) {
              //跳转到详情页
              this.$router.push({
                path: "/documents/docIndex/documentsDet",
                query: {
                  id: this.dataId,
                },
              });
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error("操作失败");
          });
      },
      //上一页
      prevPage() {
        if (this.current_page <= 1) {
          return false;
        } else {
          this.current_page--;
        }
      },
      //下一页
      nextPage() {
        if (this.current_page >= this.num) {
          return false;
        } else {
          this.current_page++;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/myStyle/mixin.scss";

  .ocr-table {
    @include wh(100%, 100%);
    box-sizing: border-box;
    padding: 20px;

    .top {
      margin-bottom: 30px;

      .title {
        margin-bottom: 15px;
        @include fj;

        span {
          color: $font-btn-blue;
        }

        button {
          width: 120px;
          height: 50px;
          background: #4068b6;
          border-radius: 25px;
          color: #fff;
          font-weight: 500;
        }
      }

      .username {
        @include fj;

        span {
          color: $font-btn-blue;
        }

        .r {}
      }

      .input1 {
        display: inline-block;
        width: 800px !important;

        input.el-input__inner {
          width: 800px !important;
        }
      }

      .page {

        .el-icon-arrow-left,
        .el-icon-arrow-right {
          color: $font-btn-blue;
        }

        span {
          color: $font-btn-blue;
        }
      }
    }
  }
</style>