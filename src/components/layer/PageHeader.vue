<template>
  <div class="header">
    <span @click="goMain" class='goMain'>{{last}}</span>
    <span class="deep"> > </span>
    <span class="deep">{{next}}</span>
  </div>
</template>

<script>
export default {
  name: 'process',
  props: {
    last: {
      type: String,
      required: true
    },
    next: {
      type: String,
      required: true
    },
    srcGo: {
      type: String,
      required: false
    }
  },
  methods: {
    goMain() {
      if (this.srcGo) {
        this.$router.push({
          path: this.srcGo
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.header{
  padding: 0 5px;
  // background-color: beige;
  color: gray;
  .deep{
    color: #333;
  }
}
.goMain{
  cursor: pointer;
}
</style>
