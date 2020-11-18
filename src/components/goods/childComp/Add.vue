<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>

      <el-steps :active="activeIndex-0" finish-status="success" space="200px" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="100px">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="addForm.goods_cat"
                  expand-trigger="hover"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
<!--            action 表示图片要上传到后台API地址-->
            <el-upload
                :action="uploadURL"
                :headers="headerObj"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
<!--            添加商品的按钮-->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

<!--    图片预览-->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewUrl" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "Add",
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //级联选择框选中的id数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品的详情描述
        goods_introduce: '',
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //商品 参数列表数据
      manyTableData: [],
      //商品 动态属性列表数据
      onlyTableData: [],
      //上传的图片的 url 地址
      uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      //图片上传的 headers 请求头 对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewUrl: '',
      previewDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat[2]
    }
  },
  methods: {
    async getCateList() {
      const res = await this.$api.goods.getAddCateList()
      this.cateList = res.data
      console.log(res)
    },
    //级联选择器 选中项发生变化，会触发的函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName,oldActiveName) {
      // console.log('即将离开的标签页的名字是：'+oldActiveName)
      // console.log('即将进入的标签页的名字是：'+activeName)
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      console.log(this.activeIndex)
      //证明访问的是商品参数面板
      if(this.activeIndex === '1') {
        const {data: res} = await this.$api.goods.getTabGoods(this.cateId, 'many')
        res.forEach(item => {
          item.attr_vals = item.attr_vals.length? []: item.attr_vals.split(',')
        })
        this.manyTableData = res
      }
      else if(this.activeIndex === '2') {
        const {data: res} = await this.$api.goods.getTabGoods(this.cateId, 'only')
        console.log(res)
        this.onlyTableData = res
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    //处理移除图片的操作
    handleRemove(file) {
      console.log(file)
      const removePath = file.response.data.tmp_path
      // this.addForm.pics.forEach((item,i) => {
      //   if(item.pic.indexOf(removePath) !== -1) {
      //     this.addForm.pics.splice(i,1)
      //   }
      // })
      const i = this.addForm.pics.findIndex(item => item === removePath)
      this.addForm.pics.splice(i,1)
      console.log(this.addForm.pics)
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response)
      const picObj = {pic: response.data.tmp_path}
      this.addForm.pics.push(picObj)
      console.log(this.addForm.pics)
    },
    //添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return this.$message.error('请填写必要的表单项')
        //添加商品的业务逻辑
        const form = _.cloneDeep(this.addForm) //深拷贝
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.manyTableData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        //发起请求添加商品
        //商品的名称，必须是唯一的
        const res = await this.$api.goods.getAddGoods(this.form)
        console.log(res)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped>
  .el-checkbox {
    margin:0 10px 0 0!important;
  }
  .previewImg {
    width: 100%;
  }
  .btnAdd {
    margin-top: 15px;
  }
</style>