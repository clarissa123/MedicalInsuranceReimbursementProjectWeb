<!--
 * @Descripttion: 
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-08-12 11:35:14
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-09-07 14:06:21
-->
<template>
  <!-- 带有背景色的分页-->
  <!-- hide-on-single-page:只有一页时是否隐藏 boolean -->
  <!-- total:总条目数 number -->
  <!-- background:是否为分页按钮添加背景色 boolean -->
  <el-pagination :background="background" :page-size="pageSize" :hide-on-single-page="hide"
    layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange"></el-pagination>
</template>

<script>
  export default {
    name: "Pagination",
    props: {
      total: {
        type: Number,
      },
      background: {
        type: Boolean,
      },
      pageSize: {
        type: Number,
      },
      hide: {
        type: Boolean,
      },
    },
    data() {
      return {
        page: {
          page_index: 1,
          page_limit: 10,
        },
      };
    },
    methods: {
      // 每页查看条数变化
      handleSizeChange(val) {
        this.page.page_limit = val;
        this.$emit("pageChange", this.page);
      },
      // 当前页码变化
      handleCurrentChange(val) {
        this.page.page_index = val;
        this.$emit("pageChange", this.page);
      },
    },
  };
</script>

<style lang="scss">
  @import "../../assets/myStyle/mixin.scss";

  .el-pagination {
    text-align: right;
    margin-top: 20px;
    margin-bottom: 50px;
  }

  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    @include minw(32px, 32px);
    @include borderRadius(4px);
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: $btn-blue;
  }

  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    border-color: $btn-blue;
    color: $btn-blue;
  }
</style>