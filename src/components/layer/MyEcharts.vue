<!--
 * @Descripttion: 
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-08-30 10:28:22
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-09-02 10:54:55
-->
<template>
    <div :id="id" :name="name" :color="color" :fontSize="fontSize" :chartData="chartData" :radius="radius">
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props: {
            id: {
                type: String,
            },
            name: {
                type: String,
            },
            fontSize: {
                type: Number,
            },
            radius: {
                type: String,
            },
            color: {
                type: Array,
            },
            chartData: {
                type: Array,
            }
        },
        mounted: function () {
            const vm = this
            vm.$nextTick(() => {
                vm.drawLine()
            })
        },
        watch: {
            chartData(oldVal, newVal) {
                this.drawLine();
            }
        },
        methods: {
            drawLine() {
                let fontSize = this.fontSize;
                let radius = this.radius;
                let color = this.color;
                let chartData = this.chartData;
                let name = this.name;
                let echartId = this.$echarts.init(document.getElementById(this.id));
                //绘制
                echartId.setOption({
                    legend: {
                        left: 32,
                        top: 32,
                        itemWidth: 10,
                        itemHeight: 10,
                        itemGap: 20, // 设置间距
                        textStyle: {
                            color: "rgba(0,0,0,.5)",
                            fontSize: fontSize
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        textStyle: {
                            fontSize: 24,
                        },
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    // 注意颜色写的位置
                    color: color,
                    series: [{
                        name: name,
                        top: '15%',
                        type: "pie",
                        // 如果radius是百分比则必须加引号
                        radius: ["0", radius],
                        roseType: "radius",
                        data: chartData,
                        // 修饰饼形图文字相关的样式 label对象
                        label: {
                            fontSize: fontSize
                        },
                        // 修饰引导线样式
                        labelLine: {
                            // 连接到图形的线长度
                            length: fontSize,
                            // 连接到文字的线长度
                            length2: fontSize
                        }
                    }]
                });
            }
        }
    }
</script>
<style>

</style>