<template>
  <div>
    <!--面包屑导航-->
    <BreadCrumb>
      <BreadCrumbItem :breadlist="breadlist"></BreadCrumbItem>
    </BreadCrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>


      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader
              expand-trigger="hover"
              v-model="selectedKeys"
              :options="paramsList"
              :props="cascaderProps"
              @change="handelChanged"
              clearable
              change-on-select>
          </el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isShowBtn" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>

            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" closable :key="i" @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
<!--                {{scope.row}}-->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isShowBtn" @click="addDialogVisible = true">添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>

            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" closable :key="i" @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>

    <!--添加参数的对话框-->
    <el-dialog
        :title="'添加'+ titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">

        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getAddParams">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改参数的对话框-->
    <el-dialog
        :title="'修改'+ titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">

        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getSubmitEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/common/breadcrumb/BreadCrumb"
import BreadCrumbItem from "@/common/breadcrumb/BreadCrumbItem";
export default {
  name: "Params",
  components: {
    BreadCrumb,
    BreadCrumbItem
  },
  data() {
    return {
      breadlist: [{id: 1, name: '商品管理'}, {id: 2, name: '参数列表'}],
      paramsList: [],
      selectedKeys: [],//这是级联选择框双向绑定到的数组
      cascaderProps: {  //级联选择框的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //被激活的页签的名称
      activeName: 'many',
      //动态参数的数据
      manyTableData: [],
      //静态属性的数据
      onlyTableData: [],

      //1.控制添加对话框的显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        attr_name: ''
      },
      //添加用户的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

      //2.控制修改参数的显示与隐藏的对话框
      editDialogVisible: false,
      //修改动态参数的表单数据
      editForm: {},
      //修改动态参数的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制按钮与文本框的切换显示
      // inputVisible: false,
      // 文本框中输入的内容
      // inputValue: ''
    }
  },
  created() {
    this.getParamsList()
  },
  computed: {
    //如果按钮需要被禁用，则返回true，否则返回false
    isShowBtn() {
      return this.selectedKeys.length === 3 ? false : true
    },
    //当前选中的三级分类的id
    cateId() {
      if(this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
    },
    //动态计算对话框的标题文本
    titleText() {
      return this.activeName === 'many' ? '动态参数': '静态属性'
    }
  },
  methods: {
    async getParamsList() {
      const res = await this.$api.goods.getParamsList()
      console.log(res)
      this.paramsList = res.data
    },
    //级联选择框变化会触发的事件
    handelChanged() {
      this.getParamsdata()
    },
    handleClick() {
      this.getParamsdata()
    },
    async getParamsdata() {
      if(this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      }
      const res = await this.$api.goods.getGoodsParams(this.cateId,this.activeName)
      console.log(res)

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //控制文本框的显示与隐藏
        item.inputVisible = false
        //文本框中输入的值
        item.inputValue = ''
      })

      if(this.activeName === 'many') {
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
    },
    //添加对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //点击确定添加参数
    getAddParams() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const res = await this.$api.goods.getAddParams(this.cateId, {attr_name: this.addForm.attr_name, attr_sel: this.activeName})
        console.log(res)

        this.addDialogVisible = false
        this.getParamsList()
      })
    },
    //关闭对话框重置表单数据
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //点击修改动态参数
    async editDialog(attr_id) {
      const res = await this.$api.goods.getEditParams(attr_id, this.cateId, this.activeName)
      console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //点击确定修改参数
    getSubmitEditParams() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const res = await this.$api.goods.getSubmitEditParams(this.cateId, this.editForm.attr_id, this.editForm.attr_name, this.activeName)
        console.log(res)

        this.getParamsList()

        this.editDialogVisible = false
      })
    },
    //根据id 删除对应的参数项
    async removeParams(attr_id) {
      const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if(result !== 'confirm') return this.$message.info('已取消了删除')
      const res = await this.$api.goods.removeParams(this.cateId,attr_id)
      this.getParamsList()

    },
    //文本框失去焦点，或者 按下了 enter 都会触发的事件
    async handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }else{
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        //发起请求保存添加的数据到数据库
        const res = await this.$api.goods.getAddTagsProps(this.cateId, row.attr_id, row.attr_name, row.attr_sel,row.attr_vals.join(' '))
      }
    },
    //点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      //让文本框自动获取焦点
      // $nextTick方法的作用：就是当页面上元素被重新渲染之后，才会执行回掉函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    //删除标签
    async handleClose(index,row) {
      row.attr_vals.splice(index, 1)
      const res = await this.$api.goods.getAddTagsProps(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(' '))
    }
  }
}
</script>

<style scoped>
  .cat_opt {
    margin: 15px 0
  }
  .el-tag {
    margin: 10px
  }
  .input-new-tag {
    width: 120px;
  }
</style>