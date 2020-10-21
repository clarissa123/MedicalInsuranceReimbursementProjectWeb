<template>
  <div class="document-detail-wrapper" v-loading="loading">
    <div class="breadcrumb-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">单据列表</el-breadcrumb-item>
        <el-breadcrumb-item>单据详情（张三，29481575213）</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="text-annotation-container">
      <text-annotation
          :canvasId="canvasId"
          :src.sync="imageSrc"
          :data="docData"
          :width="wrapperWidth"
      ></text-annotation>
    </div>
    <div class="document-detail-footer">
      <div class="cu-panel">
        <div class="cu-panel-header">
          <ul class="annotation-status-list">
            <li class="annotation-status-list-item">
              <i class="el-icon-warning"></i>
              <span>温馨提示：单击关注要素，可对比原件与OCR差异</span>
            </li>
            <li v-for="(statusItem,statusIdx) in annotationStatusList" :key="statusIdx"
                class="annotation-status-list-item">
              <el-tag :color="statusItem.color" size="mini"></el-tag>
              <span>{{statusItem.name}}</span>
            </li>
          </ul>
        </div>
        <div class="cu-panel-body">
          <div class="btn-container">
            <el-button type="primary">保存</el-button>
            <el-button type="primary">提交核算</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * @author: Homastin
   * @date: 2020/2/15  16:34
   * @Description: 单据列表详情页
   */
  import TextAnnotation from '@/components/new-text-annotation'
  import documentData from './document.json'

  export default {
    name: 'newTextAnnotation',
    data() {
      return {
        canvasId: 'canvas',
        imageSrc: require('@/components/new-text-annotation/image.jpeg'),
        loading: true,
        docData: documentData.data.evidences[0], //单据详情源数据
        wrapperWidth: '',   // 组件容器宽度
        annotationStatusList: [
          {
            type: 'error',
            name: 'OCR识别异常，需要确认',
            color: "rgba(209,60,65,0.3)"
          },
          {
            type: 'price',
            name: '药品库识别后能报销额度',
            color: "rgba(113,184,145,0.2)"
          },
          {
            type: 'area',
            name: 'OCR识别的要素区域',
            color: "rgba(46,139,240,0.1)"
          },
        ]
      }
    },
    components: {
      'text-annotation': TextAnnotation
    },
    methods: {
      // 获取整个网页高度与宽度
      getPageArea() {
        return {
          width: Math.max(document.documentElement.scrollWidth,
            document.documentElement.clientWidth),
          height: Math.max(document.documentElement.scrollHeight,
            document.documentElement.clientHeight)
        }
      },
      // 获取 组件容器的宽度
      getWrapperWidth() {
        // 单据详情的宽度 = 网页宽度 - 左侧菜单宽度
        const appMenu = document.querySelector('.cu-app-menu')
        const offsetWidth = appMenu.offsetWidth  // 左侧菜单宽度

        return this.getPageArea().width - offsetWidth
      },
      init() {
        this.wrapperWidth = this.getWrapperWidth()

        setTimeout(() => {
          this.loading = false
        }, 1000)
      },
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped lang="scss">
  $themeColor: #2E8BF0;

  .document-detail-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 26px);

    .breadcrumb-header {
      padding: 2px 0 10px 0;
    }
    .text-annotation-container {
      flex: 1;
      overflow: auto;
    }
    .document-detail-footer {
      background-color: #ffffff;
      .cu-panel {
        &-header {
          padding-left: 30px;
          padding-right: 30px;

          .annotation-status-list {
            border-bottom: 1px solid #D8D8E9;
            padding: 14px;
            display: flex;
            font-size: 14px;

            li + li {
              margin-left: 30px;
            }

            &-item {
              display: flex;
              align-items: center;

              i {
                color: $themeColor;
                margin-right: 14px;
              }

              .el-tag {
                height: 14px;
                line-height: 14px;
                width: 20px;
                margin-right: 9px;
                border: none;
              }
            }
          }
        }
        &-body {
          .btn-container {
            padding: 30px 0;
            text-align: center;
            .el-button {
              width:140px;
              height:40px;
              background:rgba(46,139,240,1);
              box-shadow:0px 4px 18px 0px rgba(46,139,240,0.3);
              border-radius:4px;
            }
            .el-button + .el-button {
              margin-left: 60px;
            }
          }
        }
      }
    }

    ul {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
      list-style: none;
    }
  }
</style>
