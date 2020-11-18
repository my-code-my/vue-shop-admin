<template>
  <div>
    <!--面包屑导航区域-->
<!--    <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>商品管理</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>商品分类</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->

    <BreadCrumb>
      <BreadCrumbItem :breadlist="breadlist"></BreadCrumbItem>
    </BreadCrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--商品列表区域-->
      <tree-table :data="cateList"
                  :columns="columns"
                  :show-index="true"
                   border
                   index-text="序号"
                  :selection-type="false"
                  :expand-type="false">

        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="primary" size="mini" v-else>三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!--分页导航区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryParams.pagenum"
          :page-sizes="[1, 3, 5]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!--添加分类的对话框-->
    <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClose">
      <el-form label-width="100px" :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef">

        <el-form-item label="分类名称：" prop="cate_name">
          <el-input v-model="addCateForm.cate_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类：">
          <!--option  用来指定数据源-->
          <!--props  用来指定配置对象-->
          <!--v-model  选中的父级分类的  id  数组-->
          <el-cascader
              expand-trigger="hover"
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select>
          </el-cascader>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/common/breadcrumb/BreadCrumb"
import BreadCrumbItem from "@/common/breadcrumb/BreadCrumbItem"
export default {
  name: "Categories",
  components: {
    BreadCrumb,
    BreadCrumbItem
  },
  data() {
    return {
      breadlist: [
        {
          id: 1,
          name: '商品管理'
        },
        {
          id: 2,
          name: '商品分类'
        }
      ],
      cateList: [],
      queryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name' //这一列显示的数据的属性名
        },
        {
          label: '是否有效',
          type: 'template', //表示将当前 列 定义为模板列
          template: 'isok' //表示当前这一列使用的 模板名称
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        },
      ],
      //控制添加分类的对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        cate_name: '', //将要添加的分类名称
        cat_pid: 0, //父级分类的 id
        cat_level: 0, //分类的等级，默认要添加的是1级分类
      },
      addCateFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      //父级分类数据列表
      parentCateList: [],
      //指定 级联 选择器的 配置对象
      cascaderProps: {
        value: 'cat_id', //指定具体选🀄的那个属性
        label: 'cat_name', //指定看到的那个属性
        children: 'children', //指定父子嵌套用的那个属性
      },
      //选中的父级分类的 id 数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      // const {data: res} = await this.$http.get('categories/',{params: this.queryParams})
      const res = await this.$api.goods.getCateList(this.queryParams)
      if(res.meta.status !== 200) return this.$message.error('获取商品列表失败！')

      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.cateList)
    },
    handleCurrentChange(newPage) {
      this.queryParams.pagenum = newPage
      this.getCateList()
    },
    handleSizeChange(newSize) {
      this.queryParams.pagesize = newSize
      this.getCateList()
    },
    //点击添加分类按钮，显示对话框
    async addCateDialog() {
      // const {data: res} = await this.$http.post('categores', this.addCateForm)
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      // const {data: res} = await this.$http.get('categories', {params: {type: 2}})
      const res = await this.$api.goods.getParentCateList({type: 2})

      console.log(res)
      this.parentCateList = res.data
    },
    //选择项 发生变化触发这个函数
    parentCateChanged() {
      if(this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      console.log(this.selectedKeys)
      console.log(this.addCateForm)
    },
    //点击添加分类按钮，添加分类
    addCateInfo() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const res = await this.$api.goods.addCateInfo(this.addCateForm)
        console.log(res)
        this.getCateList()
      })

      this.addCateDialogVisible = false
    },
    //监听添加分类对话框的关闭事件，重置表单数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style scoped>
  .zk-table {
    margin-top: 20px
  }
  .el-cascader {
    width: 100%
  }
</style>