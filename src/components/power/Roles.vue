<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" stripe border style="width: 100%">
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-row v-for="(item1,i1) in scope.row.children"
                    :key="item1.id"
                    :class="['bdbottom', i1 === 0 ? 'bdtop': '','vcenter']">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children"
                        :key="item2.id"
                        :class="[i2 === 0 ? '': 'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightsById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3, i3) in item2.children"
                            :key="item3.id"
                            type="warning"
                            closable
                            @close="removeRightsById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

        <el-table-column prop="level" label="操作" width="300px">

          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"
                       @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>

        </el-table-column>

      </el-table>
    </el-card>

    <!--分配权限的对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClose">
      <!--树形控件-->
      <el-tree
          :data="setRightList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="defKeys"
          :props="defaultProps"
          ref="treeRef">
      </el-tree>
      <!--   node-key="id" 表示只要选中了某个复选框节点就是选中了节点所对应的id值   -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      //控制分配权限的对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      setRightList: [],
      //树形控件的属性绑定对象
      defaultProps: {
        children: 'children',//实现父子节点是通过哪个属性来进行嵌套的
        label: 'authName'//我们看到的是哪个属性所对应的值
      },
      //默认选中的 节点 所对应的 id值 数组
      // defKeys: [105,116]
      defKeys: [],
      //保存当前即将分配权限的角色id值
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      console.log(res)
      this.rolesList = res.data
    },
    //根据id删除对应的权限
    async removeRightsById(role, rightId) {
      //弹框提示用户是否要删除
      const confirmResult =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult == 'cancel') return this.$message.info('取消了删除')

      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('删除权限失败')

      this.$message.success('删除成功')
      // this.getRolesList() 这种会发生页面的完整渲染
      role.children = res.data //重新喂这个角色赋值
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id

      const {data: res} = await this.$http.get('rights/tree')

      if(res.meta.status !==200) return this.$message.error('获取权限数据失败')
      //把获取到的权限的数据保存到 data 中
      this.setRightList = res.data
      console.log(res.data)

      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },

    //通过递归的形式，获取角色下所有三级权限的id，并保存到 defkeys 数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children 属性，则是三级节点
      if(!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]

      const idStr = keys.join()
      console.log(idStr)

      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      console.log(res)

      if(res.meta.status !== 200) return this.$message.error('分配权限失败')

      this.$message.success('分配权限成功')
      this.getRolesList()

      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
  .el-tag {
    margin: 7px
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center
  }

</style>