<template>
  <div class="document">
    <!-- <div>
      <div class="breadList">
        <div class="item" v-for="(item,index) in  factList" :key="index" @click="toGo(item.Url)">{{item.name}}<span class="right" v-if="index < factList.length -1">></span></div>
      </div>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { getStorageItem, setStorageItem } from '@/utils'
import Api from '@/api'

export default {
  name: 'docIndex',
  data() {
    return {
      breadList: [
        {
          name: '单据列表',
          Url: '/documents/list'
        }, {
          name: 'OCR识别结果',
          Url: '/documents/docIndex/documentsDet'
        }, {
          name: 'OCR识别结果',
          Url: '/documents/docIndex/documentsDetFuHe'
        },
        {
          name: '核算结果',
          Url: '/documents/docIndex/cacResult'
        }, {
          name: '汇总结果',
          Url: '/documents/docIndex/summary'
        }],
      factList: [],
      dataId: ''
    }
  },
  mounted() {
    this.$store.commit("SET_TOTAL", 0);
    this.dataId = this.$route.query.id
    this.status = this.$route.query.status
    this.getStatus()
    this.$eventBus.$on('bread', this.changeBread)
  },
  methods: {
    changeBread(status) {
      Api.submit.getFlowStatus(this.dataId).then((res) => {
        if (res.code === 1000) {
          this.status = res.data
          this.getStatus()
        } else {
          this.$message.error('系统错误')
        }
      }).catch((err) => {
        this.$message.error('系统错误')
      })
    },
    getStatus() {
      // 根据进入确定是面包屑
      console.log(this.status,'debugger breadList')
      switch (this.status) {
        case 'WAIT_OCR':
          this.factList = this.breadList.slice(0, 2)
          break
        case 'NLP_SUCCESS':
          this.factList = this.breadList.slice(0, 2)
          break
        case 'COMPLETE_CALCULATION':
          this.factList = this.breadList.slice(0, 3)
          break
        case 'EXAMINE_ERROR':
          this.factList = this.breadList.slice(0, 4)
          break
        case 'EXAMINE_SUCCESS':
          this.factList = this.breadList.slice(0, 4)
          break
        case 'BACKFILL':
          this.factList = this.breadList.slice(0, 4)
          break
        case 'SUMMARY':
          this.factList = this.breadList.slice(0, 4)
          break
        case 'WAIT_EXAMINE':
          this.factList = this.breadList.slice(0, 3)
          break;
        default:
          this.factList = this.breadList.slice(0, 2)
      }
    },
    toGo(url) {
      console.log(this.dataId)
      this.$router.push({
        path: url,
        query: {
          id: this.dataId,
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
.breadList{
  display: flex;
  .item{
    cursor: pointer;
  }
  .right{
    color: grey;
    padding: 0 5px;
  }
}
</style>
