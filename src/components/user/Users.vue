<template>
  <div class="users">
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图区域-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryParams.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>

        <el-table-column label="状态">

          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="userStateChanged(scope.row)">
            </el-switch>
          </template>

        </el-table-column>

        <el-table-column label="操作" width="180px">

          <template slot-scope="scope">
<!--{{scope.row}}-->
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>

            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>

            <!--分配角色按钮-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>

          </template>

        </el-table-column>
      </el-table>

      <!--分页导航菜单-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>


    <!--添加用户的对话框-->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose">

      <!--对话框内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">

        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="username">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>

      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户的对话框-->
    <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editFormClose">
      <el-form label-width="70px" :model="editForm" :rules="editFormRules" ref="editFormRef">

        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配角色的对话框-->
    <el-dialog
        title="分配角色"
        :visible.sync="setRolesDialogVisible"
        width="50%"
        @close="setRolesDialogClosed">

      <div>
        <p>当前的用户：{{userinfo.username}}</p>
        <p>当前的角色：{{userinfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRolesUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    //自定义验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
      if(regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    };
    //自定义验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    };

    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的现实与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //修改用户对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //控制分配角色对话框的显示与隐藏
      setRolesDialogVisible: false,
      //需要被分配角色的用户信息
      userinfo: {},
      //角色列表的数据
      rolesList: [],
      //已选中的角色id值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取表格中的数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryParams})
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')

      this.userlist = res.data.users
      this.total = res.data.total
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryParams.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryParams.pagenum = newPage
      this.getUserList()
    },
    //监听 switch 开关的改变
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if(res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }else{
        return this.$message.success('更新用户状态成功')
      }
    },
    //监听关闭对话框的事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //点击确定按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if(res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
        } else {
          return false;
        }
        //隐藏添加用户的对话框
        this.addDialogVisible = false
        //重新获取用户列表数据
        this.getUserList()
      });
    },
    //展示编辑的对话框
    async showEditDialog(id) {
      const {data: res} = await this.$http.get('users/'+ id)

      if(res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听修改对话框的关闭事件
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return this.$message.error('修改用户信息失败')
        const {data: res} = await this.$http.put('users/'+this.editForm.id,{
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })

        if(res.meta.status!==200) {
          return this.$message.error('更新用户信息失败')
        }
      })
      this.editDialogVisible = false
      this.getUserList()
      this.$message.success('更新用户信息成功')
    },
    //根据id删除对应的用户信息
    async removeUserById(id) {
      const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      //如果用户 确认 删除，则返回 confirm 字符串
      //如果用户 取消了 删除，则返回 cancel 字符串
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const {data: res} = await this.$http.delete('users/'+ id)
      if(res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    //分配角色的对话框
    async setRole(userinfo) {
      this.userinfo = userinfo

      //在展示对话框之前，获取所有角色列表
      const {data: res} = await this.$http.get('roles')

      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      console.log(this.rolesList)

      this.setRolesDialogVisible = true
    },
    //点击确定按钮，分配角色
    async setRolesUserInfo() {
      if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色！')


      const {data: res} = await this.$http.put(`users/${this.userinfo.id}/role`,{rid: this.selectedRoleId})
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('更新角色失败')

      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRolesDialogVisible = false
    },
    //关闭对话框后重置数据
    setRolesDialogClosed() {
      this.selectedRoleId = ''
      this.userinfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>