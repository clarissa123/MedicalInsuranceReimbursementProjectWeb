<template>
  <div class="cu-text-annotation" ref="cuTextAnnotation">
    <slot name="header" class="cu-text-annotation__header"></slot>
    <div class="cu-text-annotation__body">
      <!-- 左边 -->
      <div class="left-original-doc" ref="canvasWrapper" :style="cvsDeg">
        <canvas :id="canvasId" :ref="canvasId" :width="width" />
      </div>
      <!-- 右边 -->
      <div class="right-identification-doc" :style="identificationDocStyle">
        <div class="doc-header">
          <div class="doc-header-item" :style="calcDocHeaderPos(value)" v-for="(value,key,idx) in tableHeader"
            :key="key">
            <span>{{computeDocHeaderKey(key,value)}}{{value.text}}</span>
          </div>
        </div>
        <div class="doc-content">
          <table>
            <tr v-for="(tr,trIdx) in tableContentTr" :key="trIdx" :style="calcDocItemPos(tr.trCoordinate)">
              <th :style="calcColWidth(td)" v-if="tr.trStyle === '1' " v-for="(td,tdKey) in calcColumnNum(tr.tdDomain)"
                :key="trIdx+'-'+tdKey">
                <!-- @click="handleClickColumn({'rowIdx':trIdx,'colIdx':tdKey,'col':td,'row':tr})"
              @click.right.prevent="handleRow({'rowIdx':trIdx,'colIdx':tdKey,'col':td,'row':tr,'evt':$event})" -->
                <div :style="bgCac(td.updateFlag)"
                  :class="['td-' + trIdx + '-' + tdKey + '__text',{active: highLightCol === `${trIdx}--${tdKey}`}]">
                  {{td.value}}
                </div>
              </th>
              <td :style="calcColWidth(td)" :class="['td-' + trIdx + '-' + tdKey]" v-if="tr.trStyle === '0'"
                v-for="(td,tdKey) in calcColumnNum(tr.tdDomain)" :key="trIdx+'-'+tdKey">
                <!-- @click.right.prevent="handleRow({'rowIdx':trIdx,'colIdx':tdKey,'col':td,'row':tr,'evt':$event})"
                -->
                <!-- @dblclick="handleEditColumn(tr,td)" -->
                <div style="width: 100%;height: 100%" :style="bgCac(td.updateFlag)"
                  @click="handleClickColumn({'rowIdx':trIdx,'colIdx':tdKey,'col':td,'row':tr})"
                  :class="['td-' + trIdx + '-' + tdKey + '__text',{active: highLightCol === `${trIdx}--${tdKey}`}]"
                  v-if="td.editStatus !== 1">{{td.value}}
                </div>
                <label v-show="td.editStatus === 1">
                  <input :style="calcInputStyle()" class="cu-input" @blur="handleColumnBlur(td,tr,trIdx)"
                    @keyup.enter="$event.target.blur" @keyup.esc="handleCancelInput(td)" type="text"
                    v-model="td.value" />
                </label>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="cu-mouse-right-menu" :style="rightMenuVisibleObj" ref="menu">
      <div class="menu-item" @click="handleMenuEvent(menuItem)" v-for="(menuItem,index) in mouseRightMenu" :key="index">
        <span>{{menuItem.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  /**˚
   * @author: Homastin
   * @date: 2020/2/14  13:24
   * @Description: ODR
   * @Remark: {
   *     cu: 'custom', // 表示自定义，属于前缀
   *     text-annotation: '文书标注',
   * }
   */
  import {
    getStorageItem,
    setStorageItem,
    removeStorageItem,
    getDateByType
  } from '@/utils'

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
      },
      /**
       * @description: 容器的classname
       */
      className: {
        type: String,
        default: 'text-annotation-container'
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
        temWord: '',
        currentDocCols: [],
        trLeft: '10px',
        docHeaderKey: {
          name: '姓名',
          sex: '性别',
          age: '年龄',
          begintime: '入院日期',
          hospitalDay: '住院天数',
          department: '住院科室',
          totalMoney: '费用总额',
          hospital: '',
          title: '',
          formDate: '制表日期'
        },
        highLightCol: '', // 高亮的单元格
        currentActiveCell: { // 当前高亮的单元格
          rowIdx: -1,
          colIdx: -1,
          col: {},
          row: {}
        },
        rightMenuVisibleObj: {
          display: 'none',
          left: '0px',
          top: '0px'
        },
        mouseRightMenu: [{
            name: '在上方插入一行',
            value: 'addFront'
          },
          {
            name: '在下方插入一行',
            value: 'addBack'
          },
          {
            name: '删除所在行',
            value: 'delete'
          },
          {
            name: '使之变为表体',
            value: 'convertToBody'
          }
        ],
        averageRowHeight: 0, // 平均行高
        cellUnderEditing: false, // 记录是否有单元格被编辑
        // role: '',
        keyboardWhiteList: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F2', 'Tab']
      }
    },
    watch: {
      //翻页刷新页面
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
      cvsDeg() {
        return {
          transform: `rotate(${this.data.rotationAngle}deg)`
        }
      }
    },
    methods: {
      bgCac(updateFlag) {
        // this.role = getStorageItem('UserInfo') ? getStorageItem('UserInfo').roleType : ''
        this.role = 'EXAMINE';
        if ((this.role === 'EXAMINE') && (updateFlag === '2')) {
          return {
            backgroundColor: 'rgba(155, 104, 236, 0.5)'
          }
        }
        return ''
      },
      computeDocHeaderKey(key, val) {
        if (Object.keys(val).length) {
          return this.docHeaderKey[key] !== '' ? `${this.docHeaderKey[key]}：` : ''
        }
      },
      calcDocRowStyle(row) {
        if (row.trStyle !== '1') {
          return {}
        }
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
      calcDocHeaderPos(pos) {
        if (!pos.ymax || !pos.xmin) {
          return
        }

        const height = (pos.ymax.y - pos.xmin.y) / this.scale
        const width = (pos.ymax.x - pos.xmin.x) / this.scale
        return {
          position: 'absolute',
          top: `${pos.xmin.y / this.scale}px`,
          left: `${pos.xmin.x / this.scale}px`,
          width: `${width}+${this.computeFontSize(Math.floor(height))}px`, // 补充精度不足
          height: `${height + 1}px`,
          fontSize: `${this.computeFontSize(Math.floor(height))}px`,
        }
      },
      calcInputStyle() {
        return {
          // width: `${width + 35}px`, // 补充精度不足
          // height: `${height + 4}px`,
          // lineHeight: `${height + 4}px`,
          width: '100%',
          padding: '0 10px',
          border: '2px solid red',
          color: '#606266',
          outlineColor: 'red',
          transition: 'border-color .2s cubic-bezier(.645,.045,.355,1)',
          cursor: 'pointer',
        }
      },
      calcDocItemPos(pos, type = '', td) {
        if (!pos.ymax || !pos.xmin) {
          return
        }

        let height = (pos.ymax.y - pos.xmin.y) / this.scale
        const width = (pos.ymax.x - pos.xmin.x) / this.scale
        const fontSize = this.computeFontSize(Math.floor(height))
        if (Math.floor(height) < 12) {
          height = 14
        }
        return {
          position: 'absolute',
          top: `${pos.xmin.y / this.scale}px`,
          left: this.trLeft,
          // width: `${width + 4}px`, // 补充精度不足
          width: `calc(100% - ${this.trLeft})`,
          height: `${height + 1}px`,
          lineHeight: `${height}px`,
          fontSize: `${fontSize}px`,
          // overflow: 'hidden',
          display: 'flex',
          boxSizing: 'border-box'
        }
      },
      // 计算列数 删除无用的列
      calcColumnNum(row) {
        // console.log(row)
        // console.log(this.currentDocCols)
        // console.log(row.filter(col => this.currentDocCols.find(e => e.key === col.key) !== undefined))
        return row.filter(col => this.currentDocCols.find(e => e.key === col.key) !== undefined)
      },
      // 计算列的宽度
      calcColWidth(col) {
        let colStyle = {}
        switch (col.key) {
          case 'medicineName':
            colStyle = {
              flex: '4'
            }
            break;
          case 'medicineNode':
            colStyle = {
              flex: '2'
            }
            break;
          case 'medicineType':
            colStyle = {
              flex: '2'
            }
            break;
          case 'specs':
            colStyle = {
              flex: '1'
            }
            break;
          case 'unit':
            colStyle = {
              flex: '1'
            }
            break;
          case 'price':
            colStyle = {
              flex: '1'
            }
            break;
          case 'number':
            colStyle = {
              flex: '1'
            }
            break;
          case 'cost':
            colStyle = {
              flex: '1'
            }
            break;
        }
        return colStyle
      },
      computeFontSize(height) {
        if (height >= 35 && height < 40) {
          return height - 9.5
        } else if (height >= 24 && height < 26) {
          return height - 5
        } else if (height >= 22 && height < 24) {
          return height - 4
        } else if (height >= 20 && height < 22) {
          return height - 3
        } else if (height >= 18 && height < 20) {
          return height - 2
        } else if (height >= 16 && height < 19) {
          return height - 1
        }
        return 12
      },
      //初始化左边canvas
      createCanvas() {
        return new Promise((resolve, rehect) => {
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
            console.log(this.canvasDom)
            // this.pureImageData = this.canvasCtx.getImageData(0, 0, this.rect.width, this.rect.height)
            //添加到历史记录
            this.pushHistory()
            resolve(true)
            // this.handleDefaultRect()
          }
        })
      },
      //添加到历史记录
      pushHistory() {
        this.history.push(this.canvasCtx.getImageData(0, 0, this.rect.width, this.rect.height))
      },
      //初始化右边的表格内容
      createContent() {
        console.log('表格内容', this.data.tableHead)
        const tableHead = this.data.tableHead
        console.log('表格内容2', this.data.tableContentTr)
        // 对当前行进去坐标排序
        if (this.data.tableContentTr === null) {
          this.$message.error('单据当前页识别出错!')
          return;
        }
        const tableContentTr = this.data.tableContentTr.sort((a, b) => {
          if (!Object.keys(a.trCoordinate).length) {
            return !Object.keys(b.trCoordinate).length ? -1 : 1
          }
          if (!Object.keys(b.trCoordinate).length) {
            return !Object.keys(b.trCoordinate).length ? 1 : -1
          }
          return a.trCoordinate.xmin.y - b.trCoordinate.xmin.y
        })

        // 渲染头部 由于后台数据的key 命名有歧义,这里将错就错
        // tableHeader :  单据的头部,  tableContent: 单据的主体(表格部分,包含表头)
        this.tableHeader = tableHead

        const theadCol = tableContentTr[0].tdDomain
        this.currentDocCols = theadCol.filter(col => col.value !== null)

        // 渲染表格
        this.tableContentTr = tableContentTr.map(row => ({
          ...row,
          tdDomain: this.calcColumnNum(row.tdDomain)
        }))
        this.currentActiveCell = {
          ...this.currentActiveCell,
          rowIdx: -1,
          colIdx: -1,
          col: {},
          row: {}
        }
        this.highLightCol = ''
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

        console.log(cuTextAnnotationBodyDom)

        this.rect.width = canvas.width
        this.rect.height = canvas.height

        this.rect.offsetWidth = canvas.offsetWidth
        this.rect.offsetHeight = canvas.offsetHeight

        const rect = canvas.getBoundingClientRect()
        this.rect.top = rect.top + scrollTop
        this.rect.left = rect.left + scrollLeft
      },
      // 处理编辑单元格
      handleEditColumn(row, column, keyboardVal = '') {
        if (this.role !== 'EXAMINE') {
          return
        }
        // console.log(row, 'row')
        // console.log(column, 'column')
        this.temWord = column.value
        this.cellUnderEditing = true //记录是否有单元格被编辑
        // 第一步 显示输入框
        this.handleColumnInput(column, keyboardVal)
        // 第二步 进行标注
        // this.handleDrawRect(row.tdDomain)
        console.log('row.trCoordinate????', row.trCoordinate);
        this.handleDrawRect(row.trCoordinate)
      },
      handleColumnInput(column, keyboardVal) {
        column.editStatus = 1
        column.value = column.value ? column.value + keyboardVal : column.value
        this.$forceUpdate()
        // const tdClassName = `.${event.target.className.split('__')[0]}`;
        const tdClassName = `.td-${this.currentActiveCell.rowIdx}-${this.currentActiveCell.colIdx}`

        this.$nextTick(() => {
          document.querySelector(`${tdClassName} input`).focus()
        })
      },
      // 处理单击单元格子 单元格高亮
      handleClickColumn({
        rowIdx,
        colIdx,
        col,
        row
      }) {
        console.log('rowIdx', rowIdx)
        console.log('colIdx', colIdx)
        console.log('col', col)
        console.log('row', row)
        this.highLightCol = `${rowIdx}--${colIdx}`
        this.currentActiveCell.rowIdx = rowIdx
        this.currentActiveCell.colIdx = colIdx
        this.currentActiveCell.col = col
        this.currentActiveCell.row = row
        // col = Object.assign({}, col, {isActive: !col.isActive});
        this.handleDrawRect(row.trCoordinate)
      },
      // 处理鼠标右键菜单,包括行 添加 删除
      handleRow({
        rowIdx,
        colIdx,
        col,
        row,
        evt
      }) {
        if (this.role !== 'EXAMINE') {
          return
        }
        // 保存右键选择行的数据
        this.handleClickColumn({
          rowIdx,
          colIdx,
          col,
          row
        })
        // 计算右键菜单的位置
        const {
          x,
          y
        } = evt
        const {
          xPoint,
          yPoint
        } = this.computePosition(x, y)
        this.rightMenuVisibleObj = {
          ...this.rightMenuVisibleObj,
          display: 'block',
          left: `${xPoint}px`,
          top: `${yPoint}px`
        }
      },
      // 右键菜单-分类
      handleMenuEvent(item) {
        console.log(666);
        console.log('item---', item);
        const actions = {
          addFront: this.handleAddFrontRow,
          addBack: this.handleAddBackRow,
          delete: this.handleDelRow,
          convertToBody: this.handleConvertToBody
        }
        actions[`${item.value}`].call(this)
      },
      // 计算鼠标右键菜单位置
      computePosition(x, y) {
        const page = document.documentElement || document.body
        const wrapper = document.querySelector('.cu-text-annotation')
        const wrapperRect = wrapper.getBoundingClientRect()

        const allHeight = page.offsetHeight // 整个网页的高度
        const allWidth = page.offsetWidth // 整个网页的宽度
        // const scrollLeft = page.scrollLeft // 整个网页scrollLeft
        // const scrollTop = page.scrollTop // 整个网页scrollTop

        const {
          scrollLeft,
          scrollTop
        } = page;
        const clientWidth = this.$refs.menu.clientWidth || 120
        const clientHeight = this.$refs.menu.clientHeight || 120
        const xPoint = x + scrollLeft;
        const yPoint = y - wrapperRect.top + scrollTop + 2;
        // const xPoint = (x + clientWidth) <= allWidth ? x + scrollLeft : (allWidth - clientWidth - 5)
        // const yPoint = (y + clientHeight) <= allHeight ? y + scrollTop + 2 - wrapperRect.top : (allHeight - clientHeight - 5)

        return {
          xPoint,
          yPoint
        }
      },
      // 医保单在上方插入一行
      handleAddFrontRow() {
        console.log(row, '在上方插入一行')
        const {
          row,
          rowIdx
        } = this.currentActiveCell
        const length = this.tableContentTr.length
        if (!this.averageRowHeight) {
          // 计算行高 如果没有空间,警告,添加行会导致行错误
          this.averageRowHeight = (this.tableContentTr[length - 1].trCoordinate.ymax.y - this.tableContentTr[0]
            .trCoordinate.xmin.y) / length
        }
        // 表头之前不允许插入
        if (!rowIdx) {
          return this.$message.warning('此处禁止在上房添加行!')
        }
        // 如果间距不够 不允许添加
        if ((this.tableContentTr[rowIdx].trCoordinate.xmin.y - this.tableContentTr[rowIdx - 1].trCoordinate.ymax.y >=
            this.averageRowHeight)) {
          const rowTemplate = {
            ...row,
            id: new Date().getTime(),
            trStyle: '0',
            tdDomain: row.tdDomain.map(e => ({
              ...e,
              id: '',
              value: '',
              groupId: ''
            })),
            isNew: true,
            timeStamp: new Date().getTime()
          }
          this.tableContentTr.splice(rowIdx, 0, rowTemplate)
          this.tableContentTr.map((tr, trIdx) => {
            if (trIdx > rowIdx) {
              tr.trCoordinate.xmin.y = tr.trCoordinate.xmin.y + this.averageRowHeight
              tr.trCoordinate.ymax.y = tr.trCoordinate.ymax.y + this.averageRowHeight
            }
            return tr
          })
          // this.$emit('addFrontRow', rowTemplate)
        } else {
          return this.$message.warning('上方间距不足以添加一行!')
        }
      },
      // 医保单在下方方插入一行
      handleAddBackRow() {
        console.log('在下方插入一行')
        const {
          row,
          rowIdx
        } = this.currentActiveCell
        const length = this.tableContentTr.length

        if (!this.averageRowHeight) {
          // 计算行高 如果没有空间,警告,添加行会导致行错误
          const length = this.tableContentTr.length
          this.averageRowHeight = (this.tableContentTr[length - 1].trCoordinate.ymax.y - this.tableContentTr[0]
            .trCoordinate.xmin.y) / length
        }

        // 如果间距不够 不允许添加
        // 判断当前行是否是最后一行,如果是就不要限制间距
        if (rowIdx < length - 1) {
          if ((this.tableContentTr[rowIdx + 1].trCoordinate.xmin.y - this.tableContentTr[rowIdx].trCoordinate.ymax.y <
              this.averageRowHeight)) {
            return this.$message.warning('下方间距不足以添加一行!')
          }
        }
        const rowTemplate = {
          ...row,
          id: new Date().getTime(),
          tdDomain: row.tdDomain.map(e => ({
            ...e,
            id: '',
            value: '',
            groupId: ''
          })),
          isNew: true,
          timeStamp: new Date().getTime()
        }
        this.tableContentTr.splice(rowIdx + 1, 0, JSON.parse(JSON.stringify(rowTemplate)))
        this.tableContentTr.map((tr, trIdx) => {
          if (trIdx === rowIdx + 1) {
            tr.trCoordinate.xmin.y = tr.trCoordinate.xmin.y + this.averageRowHeight
            tr.trCoordinate.ymax.y = tr.trCoordinate.ymax.y + this.averageRowHeight
          }
          return tr
        })
        // 高亮单元格

        this.handleClickColumn({
          rowIdx: rowIdx + 1,
          colIdx: 0,
          col: this.calcColumnNum(rowTemplate.tdDomain),
          row: this.tableContentTr[rowIdx + 1]
        })
      },
      // 医保单 删除识别错误的行
      handleDelRow() {
        console.log('删除所在行')
        const {
          rowIdx,
          row
        } = this.currentActiveCell
        this.tableContentTr.splice(rowIdx, 1)
        this.$emit('deleteTr', row)
      },
      // 使表头变成表体
      handleConvertToBody() {
        const {
          col,
          row,
          rowIdx,
          colIdx
        } = this.currentActiveCell
        // this.tableContentTr[rowIdx].trStyle = '0'
        if (row.trStyle === '0') {
          return;
        }
        row.trStyle = '0'
        this.$forceUpdate()
        this.$emit('convertToBody', row)
      },
      // handle F2
      handleF2KeyUp({
        row,
        col,
        key = ''
      }) {
        console.log(row, col, 'handle F2')
        this.handleEditColumn(row, col, key)
      },
      // 处理tab 键
      handleTabKeyUp(currentCell, colTotal) {
        console.log('move to right')
        // 往后推一格,同时还涉及到换行
        this.handleColMoveToRight(currentCell, colTotal)
      },
      // 处理shift + tab
      handleShiftTabKeyUp(currentCell, colTotal) {
        // 往前推一格,同时还涉及到换行
        this.handleColMoveToLeft(currentCell, colTotal)
      },
      // 按住快捷键esc 退出输入
      handleCancelInput(col) {
        this.cellUnderEditing = false
        col.value = this.temWord
        col.editStatus = 0
        this.$forceUpdate()
      },
      // 处理鼠标单元格左移
      handleColMoveToLeft(currentCell, colTotal) {
        console.log('move to left')
        // 如果当前cell的索引不等于0,则列索引-1,否则换行索引-1,换上一行,列索引为上一行的最后一列,即判断当前cell 是否属于边缘
        if (currentCell.colIdx) {
          --currentCell.colIdx
          // this.highLightCol = `${currentCell.rowIdx}--${currentCell.colIdx}`;
          currentCell.col = this.tableContentTr[currentCell.rowIdx].tdDomain[currentCell.colIdx]
        } else {
          --currentCell.rowIdx
          currentCell.colIdx = --colTotal
          // this.highLightCol = `${currentCell.rowIdx}--${currentCell.colIdx}`;
          currentCell.col = this.tableContentTr[currentCell.rowIdx].tdDomain[currentCell.colIdx]
          currentCell.row = this.tableContentTr[currentCell.rowIdx]
        }
        this.handleClickColumn(currentCell)
      },
      // 处理鼠标单元格右移
      handleColMoveToRight(currentCell, colTotal) {
        console.log('move to right')
        // 如果当前cell的索引小于列数,列索引+1,否则换下一行,行索引+1,列归零 ,即判断当前cell 是否属于边缘
        if (currentCell.colIdx < colTotal - 1) {
          ++currentCell.colIdx
          // this.highLightCol = `${currentCell.rowIdx}--${currentCell.colIdx}`;
          currentCell.col = this.tableContentTr[currentCell.rowIdx].tdDomain[currentCell.colIdx]
        } else {
          ++currentCell.rowIdx
          currentCell.colIdx = 0
          // this.highLightCol = `${currentCell.rowIdx}--${currentCell.colIdx}`;
          currentCell.col = this.tableContentTr[currentCell.rowIdx].tdDomain[currentCell.colIdx]
          currentCell.row = this.tableContentTr[currentCell.rowIdx]
        }
        this.handleClickColumn(currentCell)
      },
      // 处理鼠标单元格下移
      handleColMoveToUp(currentCell, colTotal) {
        console.log('move to up')
        // 行的边缘情况比较少,判断当前行是否处于上边缘,由于医保单据的问题,还需判断上一行是否可编辑,即trStyle不为1,否则继续上移
        // trStyle为1,是标题,不可修改.
        if (currentCell.rowIdx) {
          const rowIndex = this.searchForAvailableColToUp(currentCell.rowIdx)

          if (rowIndex >= 0) {
            currentCell.rowIdx = rowIndex
            // this.highLightCol = `${rowIndex}--${currentCell.colIdx}`;
            currentCell.row = this.tableContentTr[currentCell.rowIdx]
            currentCell.col = this.tableContentTr[currentCell.rowIdx].tdDomain[currentCell.colIdx]
          }
          this.handleClickColumn(currentCell)
        }
      },
      // 处理鼠标单元格下移
      handleColMoveToDown(currentCell, colTotal) {
        console.log('move to down')
        // 行的边缘情况比较少,判断当前行是否处于上边缘,由于医保单据的问题,还需判断上一行是否可编辑,即trStyle不为1,否则继续上移
        // trStyle为1,是标题,不可修改.
        // 经过体验发现 trStyle 为1 也需要高亮 否则会断层,影响效果
        const rowTotal = this.tableContentTr.length

        if (currentCell.rowIdx < rowTotal - 1) {
          const rowIndex = this.searchForAvailableColToDown(currentCell.rowIdx)

          if (rowIndex >= 0) {
            currentCell.rowIdx = rowIndex
            this.highLightCol = `${rowIndex}--${currentCell.colIdx}`
            currentCell.row = this.tableContentTr[currentCell.rowIdx]
            currentCell.col = this.tableContentTr[currentCell.rowIdx].tdDomain[currentCell.colIdx]
          }
        }
        this.handleClickColumn(currentCell)
      },
      // 查找向上移动合适的行
      searchForAvailableColToUp(rowIdx) {
        --rowIdx
        return rowIdx
        // if (rowIdx >= 0) {
        //   if (this.tableContentTr[rowIdx]['trStyle'] === '1') {
        //     this.searchForAvailableColToUp(rowIdx)
        //   } else {
        //     return rowIdx;
        //   }
        // } else {
        //   return -1;
        // }
        // return rowIdx
      },
      // 查找向下移动合适的行
      searchForAvailableColToDown(rowIdx) {
        ++rowIdx
        return rowIdx
        // const rowTotal = this.tableContentTr.length;
        // if (rowIdx < rowTotal - 1) {
        //   if (this.tableContentTr[rowIdx]['trStyle'] === '1') {
        //     this.searchForAvailableColToDown(rowIdx)
        //   } else {
        //     return rowIdx;
        //   }
        // } else {
        //   return -1
        // }
        // return rowIdx;
      },
      //绘制高亮矩形标注
      handleDrawRect(pos) {
        console.log('pos===>', pos);
        // const rowPos = Object.values(pos[0])
        console.log('00000', pos)
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
        // 绘制矩形标注
        this.autoDrawRect(computedPos)
      },
      handleColumnBlur(column, row, rowIdx) {
        console.log(column, this.temWord, 'save col value')
        this.cellUnderEditing = false //记录是否有单元格被编辑
        if (column.value === this.temWord) {
          column.editStatus = 0
          this.$forceUpdate()
          // this.resetCanvas();
          return
        }
        this.$emit('editVal', column, row, rowIdx)
        column.editStatus = 0
        this.$forceUpdate()
      },
      // 创建画笔
      createBrush() {
        this.canvasCtx.shadowBlur = 0
        this.canvasCtx.strokeStyle = this.strokeColor
        this.canvasCtx.lineWidth = this.strokeWidth
      },
      // 绘制矩形标注
      autoDrawRect(pos) {
        // console.log(pos)
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
        const height = endPos.y - y + 10;

        this.canvasCtx.beginPath()
        //绘制矩形
        this.canvasCtx.strokeRect(x, y, width, height)
        // this.canvasCtx.restore()
        this.canvasCtx.closePath()
      },
      resetCanvas() {
        //清空给定矩形内的指定像素
        this.canvasCtx.clearRect(0, 0, this.rect.width, this.rect.height)
        //将图像数据（从指定的 ImageData 对象）放回画布上
        this.canvasCtx.putImageData(this.imageData, 0, 0, 0, 0, this.rect.width, this.rect.height)
      },

      // 给各个dom元素的宽高赋值
      assignStyle() {},
      // 计算当前医保单的列数
      calcCurrentDocCols() {
        const theadCol = this.tableContentTr[0].tdDomain
        this.currentDocCols = theadCol.filter(col => col.value !== null)
      },
      // 刷新 重新部分变量
      resetSomeVar() {
        this.averageRowHeight = 0;
      },
      async init() {
        //初始化左边canvas
        await this.createCanvas()
        //初始化右边的表格内容
        this.createContent()
        this.resetSomeVar = 0
      },
      // 绑定键盘事件
      bindKeyboardEvents() {
        const wrapperEle = document.querySelector(`.${this.className}`)
        console.log('我111--》', `.${this.className}`)
        //键被松开
        window.addEventListener('keyup', (e) => {
          const {
            shiftKey,
            key,
            keyCode
          } = e
          let currentCell = this.currentActiveCell
          const colTotal = this.currentDocCols.length
          if (currentCell.colIdx < 0) {
            return;
          }
          if (!shiftKey) {
            switch (key) {
              case 'ArrowUp':
                if (this.cellUnderEditing) {
                  return
                }
                this.handleColMoveToUp(currentCell, colTotal)
                e.preventDefault()
                break
              case 'ArrowDown':
                if (this.cellUnderEditing) {
                  return
                }
                this.handleColMoveToDown(currentCell, colTotal)
                e.preventDefault()
                break
              case 'ArrowLeft':
                if (this.cellUnderEditing) {
                  return
                }
                this.handleColMoveToLeft(currentCell, colTotal)
                e.preventDefault()
                break
              case 'ArrowRight':
                if (this.cellUnderEditing) {
                  return
                }
                this.handleColMoveToRight(currentCell, colTotal)
                e.preventDefault()
                break
              case 'F2':
                this.handleF2KeyUp(currentCell)
                e.preventDefault()
                break
              case 'Tab':
                e.preventDefault()
                this.handleTabKeyUp(currentCell, colTotal)
                break
              default:
                if (this.cellUnderEditing) {
                  return
                }
                if (e.target.className === 'el-input__inner') {
                  return
                }
                if ((48 <= keyCode && keyCode <= 57) || (65 <= keyCode && keyCode <= 90) || (96 <= keyCode &&
                    keyCode <= 105)) {
                  currentCell.key = key
                  this.handleF2KeyUp(currentCell)
                }
                break;
            }
          } else {
            if (key === 'Tab') {
              this.handleShiftTabKeyUp(currentCell, colTotal)
              e.preventDefault()
            }
          }
        })
        //键按下的过程
        window.addEventListener('keydown', (e) => {
          console.log('e', e);
          const {
            shiftKey,
            key
          } = e
          //选中的高亮的矩形单元格
          const currentCell = this.currentActiveCell
          if (currentCell.colIdx < 0) {
            return;
          }
          console.log('currentCell', currentCell);
          console.log('key', key);
          console.log('shiftKey', shiftKey);
          if (!shiftKey) {
            switch (key) {
              case 'ArrowUp':
              case 'ArrowDown':
              case 'ArrowLeft':
              case 'ArrowRight':
                console.log('this.cellUnderEditing-->', this.cellUnderEditing);
                if (this.cellUnderEditing) {
                  return
                }
                e.preventDefault()
                break
              case 'F2':
              case 'Tab':
                e.preventDefault()
                break
            }
          } else {
            e.preventDefault()
          }
        })
      },
      // 绑定鼠标右键事件
      // bindMenuEvents() {
      //   console.log('你--->');
      //   window.addEventListener('click', (e) => {
      //     this.rightMenuVisibleObj.display = 'none'
      //   })
      // },
      //绑定鼠标滚动事件
      // bindScrollEvents() {
      //   console.log('他--->');
      //   window.addEventListener('scroll', () => {
      //     // let scrollTop = document.documentElement.scrollTop ||
      //     //   document.body.scrollTop ||
      //     //   document.querySelector('.text-annotation-container').scrollTop ||
      //     //   document.querySelector('.main-body').scrollTop;
      //     this.rightMenuVisibleObj.display = 'none'
      //   }, true)
      // },
    },
    mounted() {
      //初始化左边canvas和右边的表格内容
      this.init()
      // // 绑定键盘事件
      this.bindKeyboardEvents()
      // // 绑定鼠标右键事件
      // this.bindMenuEvents()
      // //绑定鼠标滚动事件
      // this.bindScrollEvents()
    }
  }
</script>

<style lang="scss">
  @import "./text-annotation.scss";
</style>