<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>手机销售后台管理系统</span>
      </div>
      <div>
        <template>
          <div class="demo-type">
            <div>
              <el-avatar icon="el-icon-user-solid"></el-avatar>
            </div>
          </div>
        </template>
        <el-tag type="success">
          欢迎{{ username }} ! 当前角色为 : {{ this.roleName }}</el-tag
        >
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">三</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      username: '',
      rid: '',
      roleName: '',
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 50
      },
      // 用户列表
      userlist: [],
      // 当前用户列表
      new_user: []
    }
  },
  created() {
    // this.judge()
    this.getMenuList()
    this.getUserList()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.getUser()
  },
  methods: {
    // 获取用户状态
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('出现服务器错误，暂时无法验证身份')
      }
      this.userlist = res.data.users
      const userId = JSON.parse(window.sessionStorage.getItem('token')).id
      const user = this.userlist.find((item) => {
        console.log(item.id + '-----' + userId)
        if (item.id == userId) return item
      })
      if (!user.mg_state) {
        window.sessionStorage.clear()
        this.$message.error('用户已被禁止登录')
        this.$router.push('/login')
      }
    },
    // 退出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮，切换菜单的折叠与展开
    // toggleCollapse() {
    //   this.isCollapse = !this.isCollapse
    // },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    async getUser() {
      this.username = JSON.parse(
        window.sessionStorage.getItem('token')
      ).username
      this.rid = JSON.parse(window.sessionStorage.getItem('token')).rid
      const { data: res } = await this.$http.get(`roles/${this.rid}`)
      if (res.meta.status != 200) { return this.$message.error('用户角色信息获取失败') }
      this.roleName = res.data.roleName
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-tag {
  margin-right: 10px;
  font-size: 15px;
}
.el-avatar {
  margin-top: 4px;
}
</style>
