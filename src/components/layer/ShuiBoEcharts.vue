<!--
 * @Descripttion: 水球图
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-08-30 10:28:22
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-10-12 15:04:27
-->
<template>
  <div :id="id" :backgroundColor="backgroundColor" :color="color" :fontSize="fontSize" :chartData="chartData"></div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: {
      id: {
        type: String,
      },
      fontSize: {
        type: Number,
      },
      backgroundColor: {
        type: String,
      },
      color: {
        type: String,
      },
      chartData: {
        type: Array,
      },
    },
    mounted: function () {
      const vm = this;
      vm.$nextTick(() => {
        vm.drawLine();
      });
    },
    watch: {
      chartData(oldVal, newVal) {
        this.drawLine();
      },
    },
    methods: {
      drawLine() {
        let fontSize = this.fontSize;
        let chartData = this.chartData;
        let color = this.color;
        let backgroundColor = this.backgroundColor;
        let echartId = this.$echarts.init(document.getElementById(this.id));
        //绘制
        echartId.setOption({
          series: [{
            type: "liquidFill",
            radius: "100%", // 水球图的半径
            center: ['50%', '50%'], // 水球图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
            data: chartData, // 系列中的数据内容数组
            label: {
              normal: {
                color: "#fff",
                insideColor: "transparent",
                textStyle: {
                  fontSize: fontSize,
                  fontWeight: "bold",
                  fontFamily: "Microsoft YaHei",
                },
              },
            },
            outline: {
              show: false,
            },
            // 图形样式
            itemStyle: {
              color: color, // 水球显示的背景颜色
            },
            backgroundStyle: {
              color: backgroundColor, // 水球未到的背景颜色
            },
          }, ],
        });
      },
    },
  };
</script>
<style>
</style>