<template>
  <div class="index">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <template v-for="(item, index) in breadArr">
        <el-breadcrumb-item
          :to="{ path: item.path }"
          :key="index">
          {{ item.name }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'bread',
  props: {
    breadArr: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.index{
  height: 60px;
  line-height: 60px;
  margin-left: 20px;
  font-size: 14px;
  .el-breadcrumb {
    font-size: 14px;
    height: 60px;
    line-height: 60px;
    /deep/ .el-breadcrumb__item{
      .el-breadcrumb__inner{
        color:#8293A3;
        font-weight: normal;
      }
    }
    /deep/ .el-breadcrumb__item:last-child{
      .el-breadcrumb__inner{
        color: #373737;
        font-weight: normal;
      }
    }
  }
}
</style>
