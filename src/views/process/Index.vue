<template>
  <div class="cont">
    <pageHeader next="处理日志" last="报销列表"></pageHeader>
    <div class="block-box">
      <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          color="#108EE9"
          size="large"
          :timestamp="activity.createTime">
          <span style="color:#777"> {{activity.userName}} </span>
          <span> {{activity.describe}} </span>
        </el-timeline-item>
      </el-timeline>
    </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api'
import pageHeader from '@/components/layer/PageHeader'
import { getStorageItem, setStorageItem } from '@/utils'

export default {
  name: 'process',
  components: { pageHeader },
  data() {
    return {
      activities: []
    }
  },
  mounted() {
    // this.caseId = this.$route.query.id
    console.log(getStorageItem('dataId'))
    this.dataId = getStorageItem('dataId') ? getStorageItem('dataId') : ''
    this.getProgress()
  },
  methods: {
    getProgress() {
      Api.submit.history(this.dataId).then((res) => {
        if (res.code === 1000) {
          console.log(res.data)
          this.activities = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.block{
  width: 80%;
  margin: 0 auto;
  /deep/.el-timeline-item{
    padding-bottom: 70px;
  }
  /deep/.el-timeline-item__tail{
    border-left: 2px dashed #E4E7ED
  }
}
.block-box{
  background-color: #fff;
  padding-top: 70px;
  border-radius: 10px;
  margin-top: 15px;
  // min-height: calc(100vh - 70px);
}
</style>
