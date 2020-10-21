<template>
  <div class="cu-text-annotation" ref="cuTextAnnotation">
    <slot name="header" class="cu-text-annotation__header"></slot>
    <div class="cu-text-annotation__body">
      <div class="left-original-doc" ref="canvasWrapper">
        <canvas :id="canvasId"
                :ref="canvasId"
                :width="width"
        />
      </div>
      <div class="right-identification-doc" :style="identificationDocStyle">
        <div class="doc-header">
          <div class="doc-header-item"
               :style="calcDocItemPos(value)"
               v-for="(value,key,idx) in tableHeader"
               :key="key">
            <span>{{value.text}}</span>
          </div>
        </div>
        <div class="doc-content">
          <table>
            <tr v-for="(tr,trIdx) in tableContentTr" :key="trIdx">
              <th
                 :style="calcDocItemPos(td.coordinate)"
                  v-if="tr.trStyle == 1 && td.coordinate"
                  v-for="(td,tdKey,tdIdx) in tr.tdDomain"
                  :key="trIdx+'-'+tdKey">
                <div>{{td.value}}</div>
              </th>
              <!-- ['td-' + trIdx + '-' + tdIdx],class -->
              <td :style="calcDocItemPos(td.coordinate)"
                  :class="['td-' + trIdx + '-' + tdIdx]"
                  v-if="tr.trStyle == 0 && td.coordinate"
                  v-for="(td,tdKey,tdIdx) in tr.tdDomain"
                  :key="trIdx+'-'+tdKey">
                <div
                    style="min-height:100%;min-width:100%;backgroundColor: rgba(46, 139, 240, 0.2)"
                    @dblclick="handleEditColumn(tr,td,$event)"
                    :class="['td-' + trIdx + '-' + tdIdx + '__text']"
                    v-if="td.editStatus !== 1">{{td.value}}
                </div>
                <input
                    :style="calcDocItemPos(td.coordinate,'input')"
                    class="cu-input"
                    v-if="td.editStatus === 1"
                    @blur="handleColumnBlur(td)"
                    @keyup.enter="$event.target.blur"
                    type="text" v-model="td.value">
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   * @author: Homastin
   * @date: 2020/2/14  13:24
   * @Description: ODR
   * @Remark: {
   *     cu: 'custom', // 表示自定义，属于前缀
   *     text-annotation: '文书标注',
   * }
   */

export default {
  name: 'text-annotation',
  props: {
    /**
       * @description 翻页刷新
       */
    refresh: {
      type: Boolean,
      default: true
    },
    /**
       * @description data
       */
    data: {
      type: Object,
      default: () => ({})
    },
    /**
       * @description canvasId
       */
    canvasId: {
      type: [String, Number],
      default: '',
      required: true
    },
    /**
       * @description src为图片的路径
       */
    src: {
      type: String,
      default: '',
      required: true
    },
    /**
       * @description 编辑文本工具栏
       * */
    confirmTool: {
      type: String,
      default: 'confirmTool',
    },
    /**
       * @description 画笔类型
       * */
    strokeType: {
      type: String,
      default: 'rect'
    },
    /**
       * @description 画笔颜色
       * */
    strokeColor: {
      type: String,
      default: '#fb3838'
    },
    /**
       * @description 画笔大小
       * */
    strokeWidth: {
      type: [String, Number],
      default: 2
    },
    /**
       * @description 填充颜色
       * */
    fillStyle: {
      type: [String],
      default: 'rgba(212,76,68,0.5)'
    },
    /**
       * @description: 详情默认带的标注
       */
    defaultPos: {
      type: Array,
      default: () => []
    },
    /**
       * @description: 容器的宽度
       */
    width: {
      type: [String, Number],
      default: 1200
    }
  },
  data() {
    return {
      scale: 1,
      rect: {
        width: 'auto',
        height: 'auto'
      },
      canvasDom: {},
      canvasCtx: {},
      imageData: {},
      history: [], // 绘制的历史队列
      /** -------  createContent start  ----------*/
      tableHeader: {},
      tableContentTr: [],
      /** -------  createContent end  ----------*/
      // 暂存字段
      temWord: ''
    }
  },
  watch: {
    refresh(newV, oldV) {
      if (newV !== oldV) {
        this.init()
      }
    }
  },
  computed: {
    identificationDocStyle() {
      return {
        width: `${this.rect.width}px`,
        height: `${this.rect.height}px`
      }
    },
  },
  methods: {
    handleTableRow() {

    },
    handleTableCol() {

    },
    calcDocRowStyle(row) {
      if (row.trStyle != 1) {
        return {}
      }
      console.log('kkkkk', row.tdDomain[0])
      const rowPos = Object.values(row.tdDomain[0])

      const computedPos = {
        startPos: {
          ...rowPos[0].coordinate.xmin
        },
        endPos: {
          ...rowPos[rowPos.length - 1].coordinate.ymax
        }
      }

      return {
        position: 'absolute',
        top: `${computedPos.endPos.y / this.scale}px`,
        left: `${computedPos.startPos.x / this.scale}px`,
        width: `${(computedPos.endPos.x - computedPos.startPos.x) / this.scale}px`,
        height: `${(computedPos.endPos.y - computedPos.startPos.y) / this.scale}px`,
        border: '1px solid #ddd'
      }
    },
    calcDocItemPos(pos, type = '', tdd) {
      // console.log(pos, 'XXXXXXXXX')
      if (!pos.ymax || !pos.xmin) {
        return
      }
      const height = (pos.ymax.y - pos.xmin.y) / this.scale
      const width = (pos.ymax.x - pos.xmin.x) / this.scale

      if (type === 'input') {
        return {
          width: `${width + 35}px`, // 补充精度不足
          // height: `${height + 4}px`,
          // lineHeight: `${height + 4}px`,
          padding: '0 10px',
          border: '2px solid red',
          color: '#606266',
          outlineColor: 'red',
          transition: 'border-color .2s cubic-bezier(.645,.045,.355,1)',
          cursor: 'pointer',
        }
      }

      return {
        position: 'absolute',
        top: `${pos.xmin.y / this.scale}px`,
        left: `${pos.xmin.x / this.scale}px`,
        width: `${width + 4}px`, // 补充精度不足
        height: `${height + 1}px`,
        fontSize: `${this.computeFontSize(Math.floor(height))}px`,
        overflow: 'hidden'
      }
    },
    computeFontSize(height) {
      if (height >= 22 < 24) {
        return height - 4
      } else if (height >= 20 < 22) {
        return height - 3
      } else if (height >= 18 < 20) {
        return height - 2
      } else if (height >= 16 < 18) {
        return height - 1
      }
    },
    createCanvas() {
      // 获取canvas dom
      this.canvasDom = this.$refs[this.canvasId]
      this.canvasCtx = this.canvasDom.getContext('2d')

      // canvas 填充一张图片
      const image = new Image()
      image.src = this.src

      image.onload = () => {
        // 根据图片大小 计算canvas的宽高，然后绘制
        const rect = this.calcCanvasSize(image)

        this.canvasDom.width = rect.width
        this.canvasDom.height = rect.height
        // console.log(image, 'ssssss')
        this.canvasCtx.drawImage(image, 0, 0, this.canvasDom.width, this.canvasDom.height)
        // 计算canvas 实际位置
        this.computedCanvasRect()
        this.imageData = this.canvasCtx.getImageData(0, 0, this.canvasDom.width, this.canvasDom.height)
        // this.pureImageData = this.canvasCtx.getImageData(0, 0, this.rect.width, this.rect.height)
        this.pushHistory()
        // this.handleDefaultRect()
      }
    },
    createContent() {
      const tableHead = this.data.tableHead
      const tableContentTr = this.data.tableContentTr

      // 渲染头部 由于后台数据的key 命名有歧义,这里将错就错
      // tableHeader :  单据的头部,  tableContent: 单据的主体(表格部分,包含表头)
      this.tableHeader = tableHead

      // 渲染表格
      this.tableContentTr = tableContentTr
      console.log(this.tableHeader, this.tableContentTr)
    },
    // 计算canvas 容器的宽度
    calcCanvasSize(image) {
      // 重置缩放比列
      this.scale = 1
      const width = image.width
      const height = image.height
      const wrapperRect = this.$refs.cuTextAnnotation.getBoundingClientRect() // 整个容器的大小
      const canvasWrapperWidth = wrapperRect.width / 2 // canvas 容器的大小 = 整个容器的二分之一
      if (width <= canvasWrapperWidth) {
        return {
          width,
          height
        }
      } else if (width > canvasWrapperWidth) {
        this.scale = width / canvasWrapperWidth
        // 设置canvas的min-width 待定
        return {
          width: canvasWrapperWidth,
          height: height / this.scale
        }
      }
    },
    computedCanvasRect() {
      const canvas = this.canvasDom
      // 计算滚动距离
      const cuTextAnnotationBodyDom = document.querySelector('.cu-text-annotation__body')
      const scrollTop = cuTextAnnotationBodyDom.scrollTop
      const scrollLeft = cuTextAnnotationBodyDom.scrollLeft

      this.rect.width = canvas.width
      this.rect.height = canvas.height

      this.rect.offsetWidth = canvas.offsetWidth
      this.rect.offsetHeight = canvas.offsetHeight

      const rect = canvas.getBoundingClientRect()
      this.rect.top = rect.top + scrollTop
      this.rect.left = rect.left + scrollLeft
    },
    // 处理编辑单元格
    handleEditColumn(row, column, event) {
      console.log(row, column, event, 'row')
      this.temWord = column.value
      // 第一步 显示输入框
      this.handleColumnInput(column, event)
      // 第二步 进行标注
      // this.handleDrawRect(row.tdDomain)
      this.handleDrawRect(row.trCoordinate)
    },
    handleColumnInput(column, event) {
      column.editStatus = 1
      this.$forceUpdate()
      const tdClassName = `.${event.target.className.split('__')[0]}`

      this.$nextTick(() => {
        document.querySelector(`${tdClassName} input`).focus()
      })
    },
    handleDrawRect(pos) {
      // const rowPos = Object.values(pos[0])
      // console.log('00000', pos)

      const computedPos = {
        startPos: {
          ...pos.xmin
        },
        endPos: {
          ...pos.ymax
        }
      }
      // console.log(computedPos)
      this.resetCanvas()
      this.createBrush()
      this.autoDrawRect(computedPos)
    },
    handleColumnBlur(column) {
      console.log(column, this.temWord, 'savesavesavesavesave')
      if (column.value === this.temWord) {
        column.editStatus = 0
        this.$forceUpdate()
        return
      }
      this.$emit('editVal', column)
      column.editStatus = 0
      this.$forceUpdate()
    },
    // 创建画笔
    createBrush() {
      this.canvasCtx.shadowBlur = 0
      this.canvasCtx.strokeStyle = this.strokeColor
      this.canvasCtx.lineWidth = this.strokeWidth
    },
    // 绘制标注
    autoDrawRect(pos) {
      console.log(pos)
      const startPos = {
        x: pos.startPos.x / this.scale,
        y: pos.startPos.y / this.scale
      }
      const endPos = {
        x: pos.endPos.x / this.scale,
        y: pos.endPos.y / this.scale
      }
      const x = startPos.x
      const y = startPos.y
      const width = endPos.x - x
      const height = endPos.y - y

      this.canvasCtx.beginPath()
      this.canvasCtx.strokeRect(x, y, width, height)

      // this.canvasCtx.restore()
      this.canvasCtx.closePath()
    },
    resetCanvas() {
      this.canvasCtx.clearRect(0, 0, this.rect.width, this.rect.height)
      this.canvasCtx.putImageData(this.imageData, 0, 0, 0, 0, this.rect.width, this.rect.height)
    },
    pushHistory() {
      this.history.push(this.canvasCtx.getImageData(0, 0, this.rect.width, this.rect.height))
    },
    // 给各个dom元素的宽高赋值
    assignStyle() {
    },
    init() {
      this.createCanvas()
      this.createContent()
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss">
  @import "./text-annotation.scss";
</style>
