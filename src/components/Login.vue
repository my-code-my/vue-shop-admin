<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--登陆表单区域-->
      <el-form class="login_form"
               :model="loginForm"
               :rules="loginRules"
               label-width="0"
               ref="loginFormRef">

        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-geren"></el-input>
        </el-form-item>

        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-tuceng"></el-input>
        </el-form-item>

        <!--按钮区域-->
        <el-form-item class="login_btns">
          <el-button @click="submitLoginForm">登陆</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
name: "Login",
  data() {
    return {
      //设置登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //这是表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //点击重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    //点击登陆表单
    submitLoginForm() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return this.$message.error('登陆失败')
        const { data: res } = await this.$http.post('login',this.loginForm)

        console.log(res)
        if(res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')

        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
  .login_container {
    position: relative;
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
  }
  .avatar_box {
    position: absolute;
    left: 50%;
    width: 120px;
    height: 120px;
    padding: 10px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    transform: translate(-50%,-50%);
  }
  .avatar_box img {
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .login_btns {
    display: flex;
    justify-content: flex-end;
  }
</style>