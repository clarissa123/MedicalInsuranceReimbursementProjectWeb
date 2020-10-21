<!--
 * @Descripttion: 
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-09-02 17:48:27
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-09-07 14:53:10
-->
<template>
  <div class="menu4">
    <div class="head">
      <div class="left">
        <div class="item item1">
          <div :class="activeCls==1?'active cursor':'cursor'" @click="toggle(1)">
            <span>药品</span>
          </div>
          <span class="dot" v-show="activeCls!=1">|</span>
          <div :class="activeCls==2?'active cursor':'cursor'" @click="toggle(2)">
            <span>诊疗</span>
          </div>
          <span class="dot" v-show="activeCls!=2">|</span>
          <div :class="activeCls==3?'active cursor':'cursor'" @click="toggle(3)">
            <span>医疗器械</span>
          </div>
        </div>
        <div class="item item2" v-show="activeCls==1">
          <el-select clearable class="selectTwo" placeholder="药品分类" v-model="queryParams1.medicinalType"
            @change="changeOne" @clear="clearOne">
            <el-option v-for="item in optionsOne1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item item3" v-show="activeCls==1">
          <el-select clearable class="selectThree" placeholder="甲类/乙类" v-model="queryParams1.medicinalReimburseType"
            @change="changeTwo" @clear="clearTwo">
            <el-option v-for="item in optionsTwo1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item item4" v-show="activeCls==1">
          <el-input placeholder="请输入药品名称" class="search" v-model="queryParams1.medicinalName" @input="searchMediName"
            suffix-icon="el-icon-search" clearable />
        </div>
        <div class="item item4" v-show="activeCls==2">
          <el-input placeholder="请输入诊疗项目名称" class="search" v-model="queryParams2.name" @input="searchName"
            suffix-icon="el-icon-search" clearable />
        </div>
        <div class="item item4" v-show="activeCls==3">
          <el-input placeholder="请输入材料名称" class="search" v-model="queryParams3.materialName" @input="searchMaterialName"
            suffix-icon="el-icon-search" clearable />
        </div>
        <div class="item item4" v-show="activeCls==3">
          <el-input placeholder="请输入诊疗项目名称" class="search" v-model="queryParams3.surgeName" @input="searchSurgeName"
            suffix-icon="el-icon-search" clearable />
        </div>
      </div>
      <div class="right" v-show="activeCls==1 && addBtn1">
        <el-button type="primary" size="small" @click="clickModal1(true)" class="addBtn">新增药品</el-button>
      </div>
      <div class="right" v-show="activeCls==2 && addBtn2">
        <el-button type="primary" size="small" @click="clickModal4(true)" class="addBtn">新增诊疗</el-button>
      </div>
      <div class="right" v-show="activeCls==3 && addBtn3">
        <el-button type="primary" size="small" @click="clickModal7(true)" class="addBtn">新增材料</el-button>
      </div>
    </div>
    <!-- 药品 表格-->
    <div class="container" v-show="activeCls==1">
      <el-table :data="tableData1" style="width: 100%" :header-cell-style="headerCellStyle"
        :cell-style="{'text-align': 'center'}" stripe v-loading="loading" :row-style="rowStyle">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column label="药品分类" align="center">
          <template slot-scope="scope">
            <span class="sort-style">{{ scope.row.medicinalType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="medicinalReimburseType" label="甲类/乙类" align="center"></el-table-column>
        <el-table-column label="药品名称" align="center">
          <template slot-scope="scope">
            <span class="sort-style">{{ scope.row.medicinalName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="medicinalForm" label="剂型" align="center" width="100"></el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span class="sort-style">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="operation">
              <span class="look cursor" @click="clickModal2(true,scope.row)" v-show="addBtn1">修改</span>
              <span class="look look-red cursor" @click="clickModal3(true,scope.row.id)" v-show="deleteBtn1">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" v-show="activeCls==1" v-if="pageshow1">
      <Pagination :background="background1" :hide="hide1" :pageSize="queryParams1.pageSize" :total="total1"
        @pageChange="pageChangeTable1"></Pagination>
    </div>
    <!-- 诊疗 表格-->
    <div class="container" v-show="activeCls==2">
      <el-table :data="tableData2" style="width: 100%" :header-cell-style="headerCellStyle"
        :cell-style="{'text-align': 'center'}" stripe v-loading="loading" :row-style="rowStyle">
        <el-table-column prop="diagnosisCode" label="诊疗编号" align="center"></el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span class="sort-style">{{ scope.row.diagnosisName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目说明" align="center">
          <template slot-scope="scope">
            <span class="sort-style">{{ scope.row.diagnosisRemark }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="threeA" label="三甲" align="center"></el-table-column>
        <el-table-column prop="threeB" label="三乙" align="center"></el-table-column>
        <el-table-column prop="twoA" label="二甲" align="center"></el-table-column>
        <el-table-column prop="twoB" label="二乙" align="center"></el-table-column>
        <el-table-column width="300" label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span class="look cursor" @click="clickModal5(true,scope.row)" v-show="addBtn2">修改</span>
              <span class="look look-red cursor" @click="clickModal6(true,scope.row.id)" v-show="deleteBtn2">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" v-show="activeCls==2" v-if="pageshow2">
      <Pagination :background="background2" :hide="hide2" :pageSize="queryParams2.pageSize" :total="total2"
        @pageChange="pageChangeTable2"></Pagination>
    </div>
    <!-- 材料 表格-->
    <div class="container" v-show="activeCls==3">
      <el-table :data="tableData3" style="width: 100%" :header-cell-style="headerCellStyle"
        :cell-style="{'text-align': 'center'}" stripe v-loading="loading" :row-style="rowStyle">
        <el-table-column prop="materialCode" label="材料编码" align="center" width="200"></el-table-column>
        <el-table-column prop="materialName" label="材料名称" align="center"></el-table-column>
        <el-table-column prop="surgeCode" label="诊疗项目编码" align="center"></el-table-column>
        <el-table-column prop="surgeName" label="诊疗项目名称" align="center"></el-table-column>
        <el-table-column width="300" label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span class="look cursor" @click="clickModal8(true,scope.row)" v-show="addBtn3">修改</span>
              <span class="look look-red cursor" @click="clickModal9(true,scope.row.userId)" v-show="deleteBtn3">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" v-show="activeCls==3" v-if="pageshow3">
      <Pagination :background="background3" :hide="hide3" :pageSize="queryParams3.pageSize" :total="total3"
        @pageChange="pageChangeTable3"></Pagination>
    </div>

    <!-- 药品 新增 -->
    <Popup :showModal="Popup1.showModal" :width="Popup1.width" :height="Popup1.height" :title="Popup1.title"
      @close="clickModal1(false)" v-if="Popup1.showModal" class="add-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <el-form ref="addform1" :model="addform1" class="resetPwdForm">
            <el-form-item prop="type" label="药品分类：">
              <el-select clearable class="popup1-select1" placeholder="请选择" v-model="addform1.medicinalReimburseType"
                @change="changeOne1" @clear="clearOne1">
                <el-option v-for="item in optionsOne1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="jiayi" label="甲/乙类：">
              <el-select clearable class="popup1-select2" placeholder="请选择" v-model="addform1.medicinalType"
                @change="changeTwo1" @clear="clearTwo1">
                <el-option v-for="item in optionsTwo1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="name" label="药品名称：">
              <el-input class="popup1-input1" v-model="addform1.medicinalName" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="beizhu" label="备注：">
              <el-input class="popup1-input2" v-model="addform1.remark" type="textarea" :rows="4" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal1(false)">取 消</div>
        <div class="btn right-btn cursor" @click="add1">确 定</div>
      </div>
    </Popup>

    <!-- 药品 修改 -->
    <Popup :showModal="Popup2.showModal" :width="Popup2.width" :height="Popup2.height" :title="Popup2.title"
      @close="clickModal2(false)" v-if="Popup2.showModal" class="edit-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <el-form ref="editform1" :model="editform1" class="resetPwdForm">
            <el-form-item prop="type" label="药品分类：">
              <el-select clearable class="popup1-select1" placeholder="请选择" v-model="editform1.medicinalReimburseType"
                @change="changeOne2" @clear="clearOne2">
                <el-option v-for="item in optionsOne1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="jiayi" label="甲/乙类：">
              <el-select clearable class="popup1-select2" placeholder="请选择" v-model="editform1.medicinalType"
                @change="changeTwo2" @clear="clearTwo2">
                <el-option v-for="item in optionsTwo1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="name" label="药品名称：">
              <el-input class="popup1-input1" v-model="editform1.medicinalName" type="text" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item prop="beizhu" label="备注：">
              <el-input class="popup1-input2" v-model="editform1.remark" type="textarea" :rows="4" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal2(false)">取 消</div>
        <div class="btn right-btn cursor" @click="edit1">确 定</div>
      </div>
    </Popup>

    <!-- 药品 删除 -->
    <Popup :showModal="Popup3.showModal" :width="Popup3.width" :height="Popup3.height" :title="Popup3.title"
      @close="clickModal3(false)" v-if="Popup3.showModal" class="delete2-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <span class="fz-24">是否确认删除该药品？</span>
          </div>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal3(false)">取 消</div>
        <div class="btn right-btn cursor" @click="del1">确 定</div>
      </div>
    </Popup>

    <!-- 诊疗 新增 -->
    <Popup :showModal="Popup4.showModal" :width="Popup4.width" :height="Popup4.height" :title="Popup4.title"
      @close="clickModal4(false)" v-if="Popup4.showModal" class="add2-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <el-form ref="addform2" :model="addform2" class="resetPwdForm">
            <el-form-item prop="name" label="诊疗编码：">
              <el-input class="popup4-input1" v-model="addform2.diagnosisCode" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="诊疗名称：">
              <el-input class="popup4-input2" v-model="addform2.diagnosisName" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="项目说明：" class="extra">
              <el-input class="popup4-input3" v-model="addform2.diagnosisRemark" type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="三甲：">
              <el-input class="popup4-input4" v-model="addform2.threeA" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="三乙：">
              <el-input class="popup4-input5" v-model="addform2.threeB" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="二甲：">
              <el-input class="popup4-input6" v-model="addform2.twoA" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="二乙：">
              <el-input class="popup4-input7" v-model="addform2.twoB" type="text" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal4(false)">取 消</div>
        <div class="btn right-btn cursor" @click="add2">确 定</div>
      </div>
    </Popup>

    <!-- 诊疗 修改 -->
    <Popup :showModal="Popup5.showModal" :width="Popup5.width" :height="Popup5.height" :title="Popup5.title"
      @close="clickModal5(false)" v-if="Popup5.showModal" class="add2-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <el-form ref="editform2" :model="editform2" class="resetPwdForm">
            <el-form-item prop="name" label="诊疗编码：">
              <el-input class="popup4-input1" v-model="editform2.diagnosisCode" type="text" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item prop="name" label="诊疗名称：">
              <el-input class="popup4-input2" v-model="editform2.diagnosisName" type="text" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item prop="name" label="项目说明：" class="extra">
              <el-input class="popup4-input3" v-model="editform2.diagnosisRemark" type="textarea"
                :autosize="{ minRows: 8, maxRows: 8}" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="三甲：">
              <el-input class="popup4-input4" v-model="editform2.threeA" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="三乙：">
              <el-input class="popup4-input5" v-model="editform2.threeB" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="二甲：">
              <el-input class="popup4-input6" v-model="editform2.twoA" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="二乙：">
              <el-input class="popup4-input7" v-model="editform2.twoB" type="text" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal5(false)">取 消</div>
        <div class="btn right-btn cursor" @click="edit2">确 定</div>
      </div>
    </Popup>

    <!-- 诊疗 删除 -->
    <Popup :showModal="Popup6.showModal" :width="Popup6.width" :height="Popup6.height" :title="Popup6.title"
      @close="clickModal6(false)" v-if="Popup6.showModal" class="delete2-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <span class="fz-24">是否确认删除该诊疗？</span>
          </div>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal6(false)">取 消</div>
        <div class="btn right-btn cursor" @click="del2">确 定</div>
      </div>
    </Popup>

    <!-- 材料 新增 -->
    <Popup :showModal="Popup7.showModal" :width="Popup7.width" :height="Popup7.height" :title="Popup7.title"
      @close="clickModal7(false)" v-if="Popup7.showModal" class="add3-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <el-form ref="addform3" :model="addform3" class="resetPwdForm">
            <el-form-item prop="type" label="材料编码：">
              <el-input class="popup7-input1" v-model="addform3.materialCode" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="jiayi" label="材料名称：">
              <el-input class="popup7-input2" v-model="addform3.materialName" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="诊疗项目编码：">
              <el-input class="popup7-input3" v-model="addform3.surgeCode" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="beizhu" label="诊疗项目名称：">
              <el-input class="popup7-input4" v-model="addform3.surgeName" type="textarea" :rows="4" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal7(false)">取 消</div>
        <div class="btn right-btn cursor" @click="add3">确 定</div>
      </div>
    </Popup>

    <!-- 材料 修改 -->
    <Popup :showModal="Popup8.showModal" :width="Popup8.width" :height="Popup8.height" :title="Popup8.title"
      @close="clickModal8(false)" v-if="Popup8.showModal" class="edit3-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <el-form ref="editform3" :model="editform3" class="resetPwdForm">
            <el-form-item prop="type" label="材料编码：">
              <el-input class="popup7-input1" v-model="editform3.materialCode" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="jiayi" label="材料名称：">
              <el-input class="popup7-input2" v-model="editform3.materialName" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="诊疗项目编码：">
              <el-input class="popup7-input3" v-model="editform3.surgeCode" type="text" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="beizhu" label="诊疗项目名称：">
              <el-input class="popup7-input4" v-model="editform3.surgeName" type="textarea" :rows="4" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal8(false)">取 消</div>
        <div class="btn right-btn cursor" @click="edit3">确 定</div>
      </div>
    </Popup>

    <!-- 材料 删除 -->
    <Popup :showModal="Popup9.showModal" :width="Popup9.width" :height="Popup9.height" :title="Popup9.title"
      @close="clickModal9(false)" v-if="Popup9.showModal" class="delete2-pop">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <span class="fz-24">是否确认删除该材料？</span>
          </div>
        </div>
      </div>
      <div class="slot-btns">
        <div class="btn left-btn cursor" @click="clickModal9(false)">取 消</div>
        <div class="btn right-btn cursor" @click="del3">确 定</div>
      </div>
    </Popup>
  </div>
</template>
<script>
  import {
    isAuth
  } from "@/router/index.js";
  import Pagination from "@/components/layer/Pagination.vue";
  import Popup from "@/components/layer/popup.vue";
  import {
    headerCellStyle,
    rowStyle
  } from "@/config";
  import Api from "@/api";

  export default {
    name: 'mennu4',
    mounted() {
      let tab =
        window.sessionStorage.getItem("tab") == null ?
        1 :
        window.sessionStorage.getItem("tab");
      if (tab === '1') {
        //查询药品
        this.activeCls = 1;
        this.getList1(this.queryParams1);
      } else if (tab === '2') {
        //查询诊疗
        this.activeCls = 2;
        this.getList2(this.queryParams2);
      } else {
        //查询材料
        this.activeCls = 3;
        this.getList3(this.queryParams3);
      }
      //----药品----
      this.addBtn1 = isAuth("/medicare/dict/addMedicinalToDict");
      this.deleteBtn1 = isAuth("/medicare/dict/deleteMedicinal");
      //----诊疗----
      this.addBtn2 = isAuth("/medicare/dict/addDiagnosisToDict");
      this.deleteBtn2 = isAuth("/medicare/dict/deleteDiagnosis");
      //----材料----
      this.addBtn3 = isAuth("/medicare/dict/addMaterialToDict");
      this.deleteBtn3 = isAuth("/medicare/dict/deleteMaterial");
    },
    inject: ["reload"], //注入reload方法
    components: {
      Popup,
      Pagination,
    },
    data() {
      return {
        //按钮权限
        addBtn1: "",
        deleteBtn1: '',
        addBtn2: '',
        deleteBtn2: '',
        addBtn3: '',
        deleteBtn3: '',
        //切换 药品/诊疗/医疗器材
        activeCls: 1,
        // ------------------药品--------------------
        //解决elementui的分页bug 当选择其他页码时，进行搜索框搜索，当前页码数据不对！
        pageshow1: '',
        //新增表单
        addform1: {
          medicinalName: "", //药品名称
          medicinalReimburseType: "", //药品类型
          medicinalType: "", //甲/乙类
          remark: "", //备注
        },
        //编辑表单
        editform1: {},
        //表格
        tableData1: [{
            index: 1,
            userAccount: "感冒药",
            userPhone: "甲类",
            organizationName: "枇杷膏",
            roleName: "300ml",
            beizhu: "无",
          },
          {
            index: 2,
            userAccount: "感冒药",
            userPhone: "乙类",
            organizationName: "急支糖浆",
            roleName: "200ml",
            beizhu: "无",
          },
        ],
        headerCellStyle,
        rowStyle,
        loading: false,
        //分页
        total1: 0, //总条数
        hide1: true,
        background1: true,
        //搜索参数
        queryParams1: {
          //药品名称
          medicinalName: "",
          //报销类型
          medicinalReimburseType: "",
          //甲/乙
          medicinalType: "",
          pageNumber: 1,
          pageSize: 10,
        },
        //要删除的id
        deleteId1: "",
        //要修改的id
        updateId1: "",
        optionsOne1: [{
            label: "中成药部分",
            value: "中成药部分",
          },
          {
            label: "中药饮片部分",
            value: "中药饮片部分",
          },
          {
            label: "西药部分",
            value: "西药部分",
          },
        ],
        optionsTwo1: [{
            label: "甲",
            value: "甲",
          },
          {
            label: "乙",
            value: "乙",
          },
        ],
        optionsThree: [],
        //新增提示
        Popup1: {
          width: 816,
          height: 690,
          showModal: false,
          title: "新增药品",
        },
        //修改提示
        Popup2: {
          width: 816,
          height: 690,
          showModal: false,
          title: "修改药品",
        },
        //删除提示
        Popup3: {
          width: 492,
          height: 170,
          showModal: false,
          title: "提示",
        },
        // ------------------诊疗--------------------
        //解决elementui的分页bug 当选择其他页码时，进行搜索框搜索，当前页码数据不对！
        pageshow2: '',
        //搜索参数
        queryParams2: {
          name: "", //诊疗项目名称
          pageNumber: 1,
          pageSize: 10,
        },
        //要删除的id
        deleteId2: "",
        //新增表单
        addform2: {
          diagnosisCode: "", //诊疗编码
          diagnosisName: "", //诊疗名字
          diagnosisRemark: "", //项目说明
          threeA: "", //三甲
          threeB: "", //三乙
          twoA: "", //二甲
          twoB: "", //二乙
        },
        //编辑表单
        editform2: {},
        //要修改的id
        updateId2: "",
        //表格数据
        tableData2: [{
            index: 1,
            userAccount: "感冒药",
            userPhone: "甲类",
            organizationName: "枇杷膏",
            roleName: "300ml",
            beizhu: "无",
          },
          {
            index: 2,
            userAccount: "感冒药",
            userPhone: "乙类",
            organizationName: "急支糖浆",
            roleName: "200ml",
            beizhu: "无",
          },
        ],
        //分页
        total2: 0, //总条数
        hide2: true,
        background2: true,
        //新增提示
        Popup4: {
          width: 811,
          height: 950,
          showModal: false,
          title: "新增诊疗",
        },
        //修改提示
        Popup5: {
          width: 811,
          height: 950,
          showModal: false,
          title: "修改诊疗",
        },
        //删除提示
        Popup6: {
          width: 492,
          height: 170,
          showModal: false,
          title: "提示",
        },
        // ------------------材料--------------------
        //解决elementui的分页bug 当选择其他页码时，进行搜索框搜索，当前页码数据不对！
        pageshow3: '',
        queryParams3: {
          materialName: "", //材料名称
          surgeName: "", //诊疗名称
          pageNumber: 1,
          pageSize: 10,
        },
        //要删除的id
        deleteId3: "",
        //要修改的id
        updateId3: "",
        //表格数据
        tableData3: [{
            index: 1,
            userAccount: "感冒药",
            userPhone: "甲类",
            organizationName: "枇杷膏",
            roleName: "300ml",
            beizhu: "无",
          },
          {
            index: 2,
            userAccount: "感冒药",
            userPhone: "乙类",
            organizationName: "急支糖浆",
            roleName: "200ml",
            beizhu: "无",
          },
        ],
        //新增表单
        addform3: {
          medicinalName: "", //药品名称
          medicinalReimburseType: "", //药品类型
          medicinalType: "", //甲/乙类
          remark: "", //备注
        },
        //编辑表单
        editform3: {},
        //分页
        total3: 0, //总条数
        hide3: true,
        background3: true,
        //新增提示
        Popup7: {
          width: 816,
          height: 657,
          showModal: false,
          title: "新增材料",
        },
        //修改提示
        Popup8: {
          width: 816,
          height: 657,
          showModal: false,
          title: "修改材料",
        },
        //删除提示
        Popup9: {
          width: 492,
          height: 170,
          showModal: false,
          title: "提示",
        },
      };
    },
    methods: {
      //----------------药品-------------------------
      //----------------头部搜索框-------------------------
      //切换
      toggle(num) {
        this.activeCls = num;
        this.$store.dispatch("saveActiveCls", num);
        switch (num) {
          case 1: {
            this.getList1(this.queryParams1);
          }
          case 2: {
            this.getList2(this.queryParams2);
          }
          case 3: {
            this.getList3(this.queryParams3);
          }
        }
      },
      //选中药品分类
      changeOne(v) {
        this.$nextTick(() => {
          this.queryParams1.pageNumber = 1;
        });
      },
      //清空下拉框
      clearOne() {},
      //搜索甲/乙类
      changeTwo(v) {
        this.$nextTick(() => {
          this.queryParams1.pageNumber = 1;
        });
      },
      //清空下拉框
      clearTwo() {},
      //搜索药品名称
      searchMediName(v) {
        this.queryParams1.pageNumber = 1;
        this.queryParams1.medicinalName = v;
        this.pageshow1 = false;
        this.getList1(this.queryParams1);
        this.$nextTick(() => {
          this.pageshow1 = true;
        })
      },
      //----------------新增-------------------------
      //选中药品分类
      changeOne1(v) {},
      //清空下拉框
      clearOne1() {},
      //搜索甲/乙类
      changeTwo1(v) {},
      //清空下拉框
      clearTwo1() {},
      //----------------修改-------------------------
      //选中药品分类
      changeOne2(v) {},
      //清空下拉框
      clearOne2() {},
      //搜索甲/乙类
      changeTwo2(v) {},
      //清空下拉框
      clearTwo2() {},
      //----------------表格-------------------------
      //分页查询药品
      getList1(params) {
        Api.myApi.selectMedicinal(params).then((res) => {
          if (res.code === 1000) {
            this.pageshow1 = true;
            this.tableData1 = res.data.rows;
            this.total1 = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //新增药品
      add1() {
        Api.myApi.addMedicinalToDict(this.addform1).then((res) => {
          if (res.code === 1000) {
            this.Popup1.showModal = false;
            this.$message({
              showClose: true,
              message: "新增成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //修改药品
      edit1() {
        this.editform1.id = this.updateId1;
        Api.myApi.editMedicinalToDict(this.editform1).then((res) => {
          if (res.code === 1000) {
            this.Popup2.showModal = false;
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //删除药品
      del1() {
        Api.myApi.deleteMedicinal(this.deleteId1).then((res) => {
          if (res.code === 1000) {
            this.Popup3.showModal = false;
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //分页
      pageChangeTable1(item) {
        this.queryParams1.pageNumber = item.page_index;
        this.getList1(this.queryParams1);
      },
      clickModal1(flag) {
        if (flag) {
          this.Popup1.showModal = true;
        } else {
          this.Popup1.showModal = false;
        }
      },
      clickModal2(flag, row) {
        if (flag) {
          this.editform1 = row;
          this.updateId1 = row.id;
          this.Popup2.showModal = true;
        } else {
          this.Popup2.showModal = false;
        }
      },
      clickModal3(flag, id) {
        if (flag) {
          this.deleteId1 = id;
          this.Popup3.showModal = true;
        } else {
          this.Popup3.showModal = false;
        }
      },
      //----------------诊疗-------------------------
      clickModal4(flag) {
        if (flag) {
          this.Popup4.showModal = true;
        } else {
          this.Popup4.showModal = false;
        }
      },
      clickModal5(flag, row) {
        if (flag) {
          this.editform2 = row;
          this.updateId2 = row.id;
          this.Popup5.showModal = true;
        } else {
          this.Popup5.showModal = false;
        }
      },
      clickModal6(flag, id) {
        if (flag) {
          this.Popup6.showModal = true;
          this.deleteId2 = id;
        } else {
          this.Popup6.showModal = false;
        }
      },
      //搜索诊疗项目名称
      searchName(v) {
        this.queryParams2.pageNumber = 1;
        this.queryParams2.name = v;
        this.pageshow2 = false;
        this.getList2(this.queryParams2);
        this.$nextTick(() => {
          this.pageshow2 = true;
        })
      },
      //分页查询药品
      getList2(params) {
        Api.myApi.selectDiagnosis(params).then((res) => {
          if (res.code === 1000) {
            this.pageshow2 = true;
            this.tableData2 = res.data.rows;
            this.total2 = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //新增诊疗
      add2() {
        Api.myApi.addDiagnosisToDict(this.addform2).then((res) => {
          if (res.code === 1000) {
            this.Popup4.showModal = false;
            this.$message({
              showClose: true,
              message: "新增成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //修改诊疗
      edit2() {
        this.editform2.id = this.updateId2;
        Api.myApi.editDiagnosisToDict(this.editform2).then((res) => {
          if (res.code === 1000) {
            this.Popup5.showModal = false;
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //删除诊疗
      del2() {
        Api.myApi.deleteDiagnosis(this.deleteId2).then((res) => {
          if (res.code === 1000) {
            this.Popup6.showModal = false;
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //分页
      pageChangeTable2(item) {
        this.queryParams2.pageNumber = item.page_index;
        this.getList2(this.queryParams2);
      },
      //----------------材料-------------------------
      //分页查询药品
      getList3(params) {
        Api.myApi.selectMaterial(params).then((res) => {
          if (res.code === 1000) {
            this.pageshow3 = true;
            this.tableData3 = res.data.rows;
            this.total3 = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //搜索诊疗名称
      searchSurgeName(v) {
        this.queryParams3.pageNumber = 1;
        this.queryParams3.surgeName = v;
        this.pageshow3 = false;
        this.getList3(this.queryParams3);
        this.$nextTick(() => {
          this.pageshow3 = true;
        })
      },
      //搜索材料名称
      searchMaterialName(v) {
        this.queryParams3.pageNumber = 1;
        this.queryParams3.materialName = v;
        this.pageshow3 = false;
        this.getList3(this.queryParams3);
        this.$nextTick(() => {
          this.pageshow3 = true;
        })
      },
      clickModal7(flag, id) {
        if (flag) {
          this.Popup7.showModal = true;
        } else {
          this.Popup7.showModal = false;
        }
      },
      clickModal8(flag, row) {
        if (flag) {
          this.editform3 = row;
          this.updateId3 = row.id;
          this.Popup8.showModal = true;
        } else {
          this.Popup8.showModal = false;
        }
      },
      clickModal9(flag, id) {
        if (flag) {
          this.Popup9.showModal = true;
        } else {
          this.Popup9.showModal = false;
        }
      },
      //新增诊疗
      add3() {
        Api.myApi.addMaterialToDict(this.addform3).then((res) => {
          if (res.code === 1000) {
            this.Popup7.showModal = false;
            this.$message({
              showClose: true,
              message: "新增成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //修改诊疗
      edit3() {
        this.editform3.id = this.updateId3;
        Api.myApi.editMaterialToDict(this.editform3).then((res) => {
          if (res.code === 1000) {
            this.Popup8.showModal = false;
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //删除诊疗
      del3() {
        Api.myApi.deleteMaterial(this.deleteId3).then((res) => {
          if (res.code === 1000) {
            this.Popup9.showModal = false;
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            this.reload(); //此处刷新页面
          } else {
            this.$message.error(res.message);
          }
        });
      },
      //分页
      pageChangeTable3(item) {
        this.queryParams3.pageNumber = item.page_index;
        this.getList3(this.queryParams3);
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/myStyle/mixin.scss";

  /deep/input::-webkit-input-placeholder {
    color: $font-color-gray;
  }

  /deep/input::-moz-input-placeholder {
    color: $font-color-gray;
  }

  /deep/input::-ms-input-placeholder {
    color: $font-color-gray;
  }

  /deep/textarea::-webkit-input-placeholder {
    color: $font-color-gray;
  }

  /deep/textarea::-moz-input-placeholder {
    color: $font-color-gray;
  }

  /deep/textarea::-ms-input-placeholder {
    color: $font-color-gray;
  }

  .menu4 {
    background-color: #fff;
    border-radius: 10px;
    margin-top: 22px;
    min-height: calc(100vh - 355px);

    .head {
      display: flex;
      align-items: center;
      color: 14px;
      padding: 0 32px;
      box-sizing: border-box;
      @include fj();

      .left {
        @include fj();
        margin-right: auto;

        .item {
          margin-right: 24px;
        }

        .item1 {
          @include wh(330px, 40px);
          @include fj();
          border-radius: 4px;
          border: 1px solid #d9d9d9;

          div {
            @include wh(110px, 100%);
            text-align: center;
            line-height: 40px;

            span {
              color: #7f7f7f;
            }
          }

          .dot {
            @include wh(1px, 10px);
            color: #d9d9d9;
            line-height: 10px;
          }

          .active {
            background: #4068b6;

            span {
              color: #fff;
            }
          }
        }

        /deep/.item2 {
          .selectTwo {
            @include wh(180px, 40px);
          }
        }

        /deep/.item3 {
          .selectThree {
            @include wh(180px, 40px);
          }
        }

        /deep/.item4 {
          @include wh(322px, 40px);
        }
      }

      .right {
        .addBtn {
          width: 120px;
          height: $btn-height;
          background: $btn-blue;
          border-color: $btn-blue;
          border-radius: 25px;
          font-weight: 500;
          font-family: "PingFang Medium";
          font-size: 16px;
        }
      }
    }

    .container {
      margin-top: 21px;
      padding: 0 32px;
      box-sizing: border-box;

      .look {
        display: inline-block;
        color: $font-btn-blue;

        &:last-child {
          margin-left: 28px;
        }
      }

      .look-red {
        color: $font-btn-red;
      }

      .sort-style {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    /deep/.footer {
      .el-pagination {
        text-align: center;
      }
    }
  }

  /deep/.add-pop,
  /deep/.edit-pop {
    .popup-content {
      .popup-top {
        height: 84px;

        .popup-title {
          height: 20px;
          font-size: 20px;
          line-height: 20px;
        }
      }

      .slotWrap {
        margin-top: 60px;
        overflow-y: auto;

        .slot-content-w {
          min-height: 315px;

          .el-form-item {
            @include fj();
            justify-content: center;

            label {
              width: 92px;
              font-size: 16px;
              color: $font-color;
              font-weight: 500;
              vertical-align: middle;
            }
          }

          .el-form-item__content {
            vertical-align: middle;
          }

          .popup1-select1,
          .popup1-select2,
          .popup1-input1,
          .popup1-input2 {
            @include wh(400px, 50px);

            /deep/input.el-input__inner {
              @include wh(400px, 50px);
            }
          }
        }

        .slot-btns {
          @include fj();
          justify-content: center;
          margin-top: 48px;

          .btn {
            @include wh(120px, 50px);
            border-radius: 25px;
            line-height: 50px;
            text-align: center;
          }

          .left-btn {
            background: #fafafa;
            color: $font-color;
          }

          .right-btn {
            margin-left: 16px;
            background: $font-btn-blue;
            color: $white;
          }
        }
      }
    }
  }

  /deep/.delete-pop {
    .slot-content-w {
      text-align: left;
      margin-left: 56px;
    }

    .slot-btns {
      @include fj();
      justify-content: flex-end;
      margin-top: 22px;

      .btn {
        @include wh(120px, 50px);
        border-radius: 25px;
        line-height: 50px;
        text-align: center;
      }

      .left-btn {
        background: #fafafa;
        color: $font-color;
      }

      .right-btn {
        margin-left: 16px;
        background: $font-btn-blue;
        color: $white;
        margin-right: 24px;
      }
    }
  }

  /deep/.add2-pop,
  /deep/.edit2-pop {
    .popup-content {
      .popup-top {
        height: 84px;

        .popup-title {
          height: 20px;
          font-size: 20px;
          line-height: 20px;
        }
      }

      .slotWrap {
        padding-top: 0;
        overflow-y: auto;

        .slot-content-w {
          min-height: 315px;

          .el-form-item {
            @include fj();
            justify-content: center;

            label {
              width: 92px;
              font-size: 16px;
              color: $font-color;
              font-weight: 500;
              vertical-align: middle;
            }
          }

          /deep/.extra {
            .el-form-item__content {
              min-height: 180px;
            }
          }

          .el-form-item__content {
            vertical-align: middle;
          }

          .popup4-input1,
          .popup4-input2,
          .popup4-input3,
          .popup4-input4,
          .popup4-input5,
          .popup4-input6,
          .popup4-input7 {
            @include wh(400px, 50px);

            /deep/input.el-input__inner {
              @include wh(400px, 50px);
            }
          }
        }

        .slot-btns {
          @include fj();
          justify-content: center;
          margin-top: 72px;

          .btn {
            @include wh(120px, 50px);
            border-radius: 25px;
            line-height: 50px;
            text-align: center;
          }

          .left-btn {
            background: #fafafa;
            color: $font-color;
          }

          .right-btn {
            margin-left: 16px;
            background: $font-btn-blue;
            color: $white;
          }
        }
      }
    }
  }

  /deep/.delete2-pop {
    .slot-content-w {
      text-align: left;
      margin-left: 56px;
    }

    .slot-btns {
      @include fj();
      justify-content: flex-end;
      margin-top: 22px;

      .btn {
        @include wh(120px, 50px);
        border-radius: 25px;
        line-height: 50px;
        text-align: center;
      }

      .left-btn {
        background: #fafafa;
        color: $font-color;
      }

      .right-btn {
        margin-left: 16px;
        background: $font-btn-blue;
        color: $white;
        margin-right: 24px;
      }
    }
  }

  /deep/.add3-pop,
  /deep/.edit3-pop {
    .popup-content {
      .popup-top {
        height: 84px;

        .popup-title {
          height: 20px;
          font-size: 20px;
          line-height: 20px;
        }
      }

      .slotWrap {
        margin-top: 30px;
        overflow-y: auto;

        .slot-content-w {
          min-height: 315px;

          .el-form-item {
            @include fj();
            justify-content: center;

            label {
              width: 125px;
              font-size: 16px;
              color: $font-color;
              font-weight: 500;
              vertical-align: middle;
            }
          }

          /deep/.extra {
            .el-form-item__content {
              min-height: 180px;
            }
          }

          .el-form-item__content {
            vertical-align: middle;
          }

          .popup7-input1,
          .popup7-input2,
          .popup7-input3,
          .popup7-input4 {
            @include wh(400px, 50px);

            /deep/input.el-input__inner {
              @include wh(400px, 50px);
            }
          }
        }

        .slot-btns {
          @include fj();
          justify-content: center;
          margin-top: 72px;

          .btn {
            @include wh(120px, 50px);
            border-radius: 25px;
            line-height: 50px;
            text-align: center;
          }

          .left-btn {
            background: #fafafa;
            color: $font-color;
          }

          .right-btn {
            margin-left: 16px;
            background: $font-btn-blue;
            color: $white;
          }
        }
      }
    }
  }

  /deep/.delete3-pop {
    .slot-content-w {
      text-align: left;
      margin-left: 56px;
    }

    .slot-btns {
      @include fj();
      justify-content: flex-end;
      margin-top: 22px;

      .btn {
        @include wh(120px, 50px);
        border-radius: 25px;
        line-height: 50px;
        text-align: center;
      }

      .left-btn {
        background: #fafafa;
        color: $font-color;
      }

      .right-btn {
        margin-left: 16px;
        background: $font-btn-blue;
        color: $white;
        margin-right: 24px;
      }
    }
  }
</style>