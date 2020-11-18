<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryParams.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="200"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <el-template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </el-template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间" width="180">
          <el-template slot-scope="scope">
            {{formatTime(scope.row.create_time)}}
          </el-template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <el-template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"></el-button>
          </el-template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pagenum"
          :page-sizes="[5, 8, 10]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Order",
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const res = await this.$api.goods.getOrderList(this.queryParams)
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res)
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
    handleSizeChange(newsize) {
      this.queryParams.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange(newpage) {
      this.queryParams.pagenum = newpage
      this.getOrderList()
    }
  }
}
</script>

<style scoped>

</style>