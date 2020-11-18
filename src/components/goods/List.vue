<template>
  <div>
    <BreadCrumb>
      <BreadCrumbItem :breadlist="breadlist"></BreadCrumbItem>
    </BreadCrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="$router.push('goods/add')">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" stripe border style="width: 100%">

        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
<!--            {{scope.row.add_time | dateFormat}}-->
            {{formatTime(scope.row.add_time)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">

          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsList(scope.row.goods_id)"></el-button>
          </template>

        </el-table-column>

      </el-table>

      <!--分页导航菜单-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pagenum"
          :page-sizes="[6, 8, 10]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "@/common/breadcrumb/BreadCrumb"
import BreadCrumbItem from "@/common/breadcrumb/BreadCrumbItem"

export default {
name: "List",
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
          name: '商品列表'
        }
      ],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created() {
  this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const {data: res} = await this.$api.goods.getGoodsList(this.queryParams)
      console.log(res)
      this.goodsList = res.goods
      this.total = res.total
    },
    handleSizeChange(newsize) {
      this.queryParams.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryParams.pagenum = newpage
      this.getGoodsList()
    },
    formatTime (originVal) {
      const dt = new Date(originVal)

      const y = (dt.getFullYear() + '').padStart(2, '0')
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDay() + '').padStart(2, '0')

      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
    //删除当前行的列表数据
    async removeGoodsList(id) {
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if(result !== 'confirm') return this.$message.info('已取消了删除')
      const res = await this.$api.goods.removeGoodsList(id)

      if(res.meta.status!==200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()
    }
  }
}
</script>

<style scoped>

</style>