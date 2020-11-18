<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <div class="header_logo">
        <img src="../assets/heima.b5a855ee.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!--页面主体区域-->
    <el-container>
      <!--左边侧边栏区域-->
      <el-aside :width="isCollapse ? '64px' : '200px'">

        <div class="toggle_btn" @click="toggleBtn">|||</div>

        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409eff"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item1.id + ''" v-for="item1 in menuList" :key="item1.id">
            <template slot="title">
              <i :class="iconsObj[item1.id]"></i>
              <span>{{item1.authName}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="item2.path"
                          v-for="item2 in item1.children"
                          :key="item2.id"
                          @click="saveNavState(item2.path)">
              <template>
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>

      <!--右边内容区域区域-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-seeuser',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-chart'
      },
      //是否折叠
      isCollapse: false,
      //被激活的二级菜单的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
    //请求所有的菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    //点击按钮，切换菜单的折叠与展开
    toggleBtn() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
  .home_container {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373d41;
    padding-left: 0;
  }
  .header_logo {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }
  .header_logo span {
    margin-left: 15px;
  }
  .el-aside {
    background-color: #333744;
  }
  .toggle_btn {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer
  }
  .el-menu {
    border-right: none;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
</style>